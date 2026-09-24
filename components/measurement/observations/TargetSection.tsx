import SpinLoader from 'components/vendor/SpinLoader'
import { useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWR from 'swr'
import { DetailsBox } from '../DetailsBox'
import { fetchAggregatedObservations } from './api'
import type { TargetGroup } from './derive'
import {
  ctrlForEndpoint,
  hasHTTP,
  hasTCP,
  hasTLS,
  observationHostname,
} from './derive'
import FailureChart from './FailureChart'
import {
  bucketByDay,
  type DayBucket,
  FAILURE_FAMILIES,
  maxStack,
  NONE_SERIES,
  type Series,
} from './failures'
import { AsnLabel, Chip, NoData, StatusMark } from './StatusMark'
import type { CtrlGroundTruthEntry, WebObservation } from './types'

const thClass = 'px-3 py-2 text-sm text-start font-semibold whitespace-nowrap'
const tdClass = 'px-3 py-2 text-sm align-top'

const useNumberFormat = () => {
  const intl = useIntl()
  return (n: number) => intl.formatNumber(n)
}

const UnknownHostname = () => (
  <FormattedMessage id="Measurement.Observations.UnknownHostname" />
)

// "control: 3 ok · 1 failed" line shown under the probe's own result
const CtrlCounts = ({
  success,
  failure,
  missing,
}: {
  success?: number
  failure?: number
  missing?: boolean
}) => {
  const fmt = useNumberFormat()
  if (missing) {
    return (
      <div className="text-xs text-gray-600 mt-0.5">
        <FormattedMessage id="Measurement.Observations.Control.NoData" />
      </div>
    )
  }
  return (
    <div className="text-xs text-gray-600 mt-0.5">
      <FormattedMessage
        id="Measurement.Observations.Control.Counts"
        values={{
          ok: <strong>{fmt(success ?? 0)}</strong>,
          failed: <strong>{fmt(failure ?? 0)}</strong>,
        }}
      />
    </div>
  )
}

// The control ground truth has no target_id, so everything here is keyed by
// hostname: each probe answer is compared against the control entries of the
// hostname it was observed on.
interface CtrlByHostname {
  dnsIPs: Map<string, Set<string>> // hostname -> IPs in control DNS answers
  tlsConsistent: Map<string, Map<string, boolean>> // hostname -> ip -> ok
  entries: Map<string, CtrlGroundTruthEntry[]> // hostname -> ctrl rows
}

function indexCtrlByHostname(ctrl: CtrlGroundTruthEntry[]): CtrlByHostname {
  const dnsIPs = new Map<string, Set<string>>()
  const tlsConsistent = new Map<string, Map<string, boolean>>()
  const entries = new Map<string, CtrlGroundTruthEntry[]>()
  for (const c of ctrl) {
    const list = entries.get(c.hostname) ?? []
    list.push(c)
    entries.set(c.hostname, list)
    if (c.in_dns_answers) {
      const s = dnsIPs.get(c.hostname) ?? new Set()
      s.add(c.ip)
      dnsIPs.set(c.hostname, s)
    }
    const m = tlsConsistent.get(c.hostname) ?? new Map<string, boolean>()
    m.set(c.ip, (m.get(c.ip) ?? false) || c.tls_consistent)
    tlsConsistent.set(c.hostname, m)
  }
  return { dnsIPs, tlsConsistent, entries }
}

type AnswerStatus =
  | 'in_control'
  | 'tls_consistent'
  | 'inconsistent'
  | 'unknown'
  | null

// How a probe DNS answer relates to the control ground truth of its hostname.
// null when there is nothing to compare against (no answer, or the control
// never measured this hostname) so we don't flag absence of data as anomaly.
function answerConsistency(
  hostname: string,
  ip: string | null,
  ctrl: CtrlByHostname,
): AnswerStatus {
  if (!ip || !ctrl.entries.has(hostname)) return null
  if (ctrl.dnsIPs.get(hostname)?.has(ip)) return 'in_control'
  const tls = ctrl.tlsConsistent.get(hostname)?.get(ip)
  if (tls === true) return 'tls_consistent'
  if (tls === false) return 'inconsistent'
  return 'unknown'
}

const AnswerConsistencyChips = ({ status }: { status: AnswerStatus }) => {
  if (status === null) return null
  if (status === 'in_control') {
    return (
      <Chip tone="ok">
        <FormattedMessage id="Measurement.Observations.Chip.InControlDns" />
      </Chip>
    )
  }
  return (
    <>
      <Chip tone="warn">
        <FormattedMessage id="Measurement.Observations.Chip.NotInControlDns" />
      </Chip>
      {status === 'tls_consistent' && (
        <Chip tone="ok">
          <FormattedMessage id="Measurement.Observations.Chip.TlsConsistent" />
        </Chip>
      )}
      {status === 'inconsistent' && (
        <Chip tone="fail">
          <FormattedMessage id="Measurement.Observations.Chip.NotTlsConsistent" />
        </Chip>
      )}
    </>
  )
}

const CtrlResolutionBlock = ({
  hostname,
  showHostname,
  ctrlEntries,
  probeIPs,
}: {
  hostname: string
  showHostname: boolean
  ctrlEntries: CtrlGroundTruthEntry[]
  probeIPs: Set<string> // probe DNS answers for this hostname
}) => {
  const fmt = useNumberFormat()
  const answerIPs = ctrlEntries.filter((c) => c.in_dns_answers)
  const counts = ctrlEntries[0]
  const commonCount = [...probeIPs].filter((ip) =>
    answerIPs.some((c) => c.ip === ip),
  ).length
  // IPs the probe saw in common with the control float to the top of the list
  const sorted = [...answerIPs].sort(
    (a, b) =>
      Number(probeIPs.has(b.ip)) - Number(probeIPs.has(a.ip)) ||
      a.ip.localeCompare(b.ip),
  )

  return (
    <div>
      {showHostname && (
        <div className="text-xs font-mono font-semibold mb-1">{hostname}</div>
      )}
      {counts && (
        <p className="text-xs text-gray-600 mb-1">
          <FormattedMessage
            id="Measurement.Observations.Control.DnsCounts"
            values={{
              ok: <strong>{fmt(counts.dns_success_count)}</strong>,
              nxdomain: <strong>{fmt(counts.dns_nxdomain_count)}</strong>,
              other: <strong>{fmt(counts.dns_other_failure_count)}</strong>,
            }}
          />
        </p>
      )}
      {probeIPs.size > 0 && (
        <p className="text-xs mb-2">
          <StatusMark tone={commonCount > 0 ? 'ok' : 'warn'}>
            <FormattedMessage
              id="Measurement.Observations.Control.ProbeAnswersInControl"
              values={{ common: commonCount, total: probeIPs.size }}
            />
          </StatusMark>
        </p>
      )}
      <ul className="space-y-1 list-none m-0 p-0">
        {sorted.map((c) => {
          const common = probeIPs.has(c.ip)
          return (
            <li
              key={c.ip + String(c.port)}
              className={`text-xs ${common ? 'font-medium' : ''}`}
            >
              <span className="font-mono">{c.ip}</span>{' '}
              <AsnLabel asn={c.asn} orgName={c.as_org_name} />
              <span className="ms-1 space-x-1">
                {common && (
                  <Chip tone="ok">
                    <FormattedMessage id="Measurement.Observations.Chip.ProbeAnswer" />
                  </Chip>
                )}
                {c.is_cloud_provider && (
                  <Chip>
                    <FormattedMessage id="Measurement.Observations.Chip.Cloud" />
                  </Chip>
                )}
              </span>
            </li>
          )
        })}
        {answerIPs.length === 0 && (
          <li className="text-xs text-gray-600">
            <FormattedMessage id="Measurement.Observations.Control.NoDnsAnswers" />
          </li>
        )}
      </ul>
    </div>
  )
}

const DnsSection = ({ group }: { group: TargetGroup }) => {
  const ctrl = useMemo(() => indexCtrlByHostname(group.ctrl), [group.ctrl])
  const multiHost = group.hostnames.length > 1

  if (group.dnsByResolver.length === 0 && group.ctrl.length === 0) return null

  // Probe DNS answers per hostname, for the control-side comparison
  const probeIPsByHost = new Map<string, Set<string>>()
  for (const rg of group.dnsByResolver) {
    for (const q of rg.queries) {
      if (!q.dns_answer) continue
      const h = observationHostname(q)
      const s = probeIPsByHost.get(h) ?? new Set()
      s.add(q.dns_answer)
      probeIPsByHost.set(h, s)
    }
  }
  // Hostnames worth a control block: measured by the control, in a stable order
  const ctrlHostnames = group.hostnames.filter((h) => ctrl.entries.has(h))

  return (
    <DetailsBox
      title={<FormattedMessage id="Measurement.Observations.DnsQueries" />}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_minmax(220px,0.6fr)]">
        <div className="space-y-4">
          {group.dnsByResolver.length === 0 && (
            <p className="text-gray-600">
              <FormattedMessage id="Measurement.Observations.NoDnsQueries" />
            </p>
          )}
          {group.dnsByResolver.map((rg) => (
            <div key={rg.engine + rg.resolverAddress}>
              <div className="text-xs uppercase tracking-wide text-gray-600 mb-1">
                <FormattedMessage
                  id="Measurement.Observations.Resolver"
                  values={{
                    engine: (
                      <span className="font-semibold text-gray-900">
                        {rg.engine}
                        {rg.resolverAddress ? ` (${rg.resolverAddress})` : ''}
                      </span>
                    ),
                  }}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      {multiHost && (
                        <th className={thClass}>
                          <FormattedMessage id="Measurement.Observations.Table.Host" />
                        </th>
                      )}
                      <th className={thClass}>
                        <FormattedMessage id="Measurement.Observations.Table.Type" />
                      </th>
                      <th className={thClass}>
                        <FormattedMessage id="Measurement.Observations.Table.Answer" />
                      </th>
                      <th className={thClass}>
                        <FormattedMessage id="Measurement.Observations.Table.Network" />
                      </th>
                      <th className={`${thClass} text-end`}>
                        <FormattedMessage id="Measurement.Observations.Table.Time" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rg.queries.map((q) => {
                      const hostname = observationHostname(q)
                      return (
                        <tr key={q.observation_idx} className="even:bg-gray-50">
                          {multiHost && (
                            <td className={`${tdClass} font-mono text-xs`}>
                              {hostname || <UnknownHostname />}
                            </td>
                          )}
                          <td className={`${tdClass} font-mono text-xs`}>
                            {q.dns_query_type ?? <NoData />}
                          </td>
                          <td className={tdClass}>
                            {q.dns_failure ? (
                              <StatusMark tone="fail">
                                {q.dns_failure}
                              </StatusMark>
                            ) : (
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="font-mono text-xs">
                                  {q.dns_answer ?? <NoData />}
                                </span>
                                <AnswerConsistencyChips
                                  status={answerConsistency(
                                    hostname,
                                    q.dns_answer,
                                    ctrl,
                                  )}
                                />
                              </div>
                            )}
                          </td>
                          <td className={tdClass}>
                            <AsnLabel
                              asn={q.dns_answer_asn}
                              orgName={q.dns_answer_as_org_name}
                            />
                          </td>
                          <td
                            className={`${tdClass} text-end text-xs text-gray-600 tabular-nums`}
                          >
                            {q.dns_t != null
                              ? `${(q.dns_t * 1000).toFixed(0)}ms`
                              : ''}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <aside className="border-t md:border-t-0 md:border-s border-gray-300 pt-3 md:pt-0 md:ps-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
            <FormattedMessage id="Measurement.Observations.ControlResolution" />
          </h4>
          {ctrlHostnames.length === 0 ? (
            <p className="text-gray-600">
              <FormattedMessage id="Measurement.Observations.Control.NoHostnames" />
            </p>
          ) : (
            <div className="space-y-3">
              {ctrlHostnames.map((h) => (
                <CtrlResolutionBlock
                  key={h}
                  hostname={h}
                  showHostname={multiHost}
                  ctrlEntries={ctrl.entries.get(h) ?? []}
                  probeIPs={probeIPsByHost.get(h) ?? new Set()}
                />
              ))}
            </div>
          )}
        </aside>
      </div>
    </DetailsBox>
  )
}

const HttpCell = ({ o }: { o: WebObservation }) => {
  const fmt = useNumberFormat()
  if (!hasHTTP(o)) return <NoData />
  return (
    <div>
      {o.http_failure ? (
        <StatusMark tone="fail">{o.http_failure}</StatusMark>
      ) : (
        <StatusMark tone="ok">
          <FormattedMessage
            id="Measurement.Observations.HttpStatus"
            values={{ status: o.http_response_status_code ?? '?' }}
          />
        </StatusMark>
      )}
      {o.http_request_url && (
        <div
          className="text-xs text-gray-600 font-mono truncate max-w-[220px]"
          title={o.http_request_url}
        >
          {o.http_request_method ? `${o.http_request_method} ` : ''}
          {o.http_request_url}
        </div>
      )}
      {o.http_response_body_length != null && !o.http_failure && (
        <div className="text-xs text-gray-600">
          <FormattedMessage
            id="Measurement.Observations.Bytes"
            values={{ bytes: fmt(o.http_response_body_length) }}
          />
        </div>
      )}
    </div>
  )
}

const EndpointsSection = ({ group }: { group: TargetGroup }) => {
  const multiHost = group.hostnames.length > 1
  if (group.endpoints.length === 0) return null

  return (
    <DetailsBox
      title={<FormattedMessage id="Measurement.Observations.Endpoints" />}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className={thClass}>
                <FormattedMessage id="Measurement.Observations.Table.Endpoint" />
              </th>
              <th className={thClass}>
                <FormattedMessage id="Measurement.Observations.Table.TcpConnect" />
              </th>
              <th className={thClass}>
                <FormattedMessage id="Measurement.Observations.Table.TlsHandshake" />
              </th>
              <th className={thClass}>
                <FormattedMessage id="Measurement.Observations.Table.HttpRequest" />
              </th>
            </tr>
          </thead>
          <tbody>
            {group.endpoints.map((o) => {
              const ctrl = ctrlForEndpoint(group, o)
              return (
                <tr key={o.observation_idx} className="even:bg-gray-50">
                  <td className={tdClass}>
                    <div className="font-mono text-xs">
                      {o.ip}
                      {o.port != null ? `:${o.port}` : ''}
                    </div>
                    {multiHost && o.hostname && o.hostname !== o.ip && (
                      <div className="text-xs text-gray-600 font-mono">
                        {o.hostname}
                      </div>
                    )}
                    <AsnLabel asn={o.ip_asn} orgName={o.ip_as_org_name} />
                    <div className="mt-0.5 space-x-1">
                      {o.ip_is_bogon && (
                        <Chip tone="warn">
                          <FormattedMessage id="Measurement.Observations.Chip.Bogon" />
                        </Chip>
                      )}
                      {ctrl?.in_dns_answers && (
                        <Chip tone="ok">
                          <FormattedMessage id="Measurement.Observations.Chip.InControlDns" />
                        </Chip>
                      )}
                      {ctrl && !ctrl.in_dns_answers && (
                        <Chip tone="warn">
                          <FormattedMessage id="Measurement.Observations.Chip.NotInControlDns" />
                        </Chip>
                      )}
                      {ctrl && !ctrl.tls_consistent && (
                        <Chip tone="fail">
                          <FormattedMessage id="Measurement.Observations.Chip.NotTlsConsistent" />
                        </Chip>
                      )}
                      {ctrl?.is_cloud_provider && (
                        <Chip>
                          <FormattedMessage id="Measurement.Observations.Chip.Cloud" />
                        </Chip>
                      )}
                    </div>
                  </td>
                  <td className={tdClass}>
                    {hasTCP(o) ? (
                      o.tcp_failure == null && o.tcp_success !== false ? (
                        <StatusMark tone="ok">
                          <FormattedMessage id="Measurement.Observations.Tcp.Connected" />
                        </StatusMark>
                      ) : (
                        <StatusMark tone="fail">
                          {o.tcp_failure ?? (
                            <FormattedMessage id="Measurement.Observations.Tcp.Failed" />
                          )}
                        </StatusMark>
                      )
                    ) : (
                      <NoData />
                    )}
                    <CtrlCounts
                      missing={!ctrl}
                      success={ctrl?.tcp_success_count}
                      failure={ctrl?.tcp_failure_count}
                    />
                  </td>
                  <td className={tdClass}>
                    {hasTLS(o) ? (
                      <div>
                        {o.tls_failure == null ? (
                          <StatusMark tone="ok">
                            {o.tls_is_certificate_valid === false ? (
                              <FormattedMessage id="Measurement.Observations.Tls.OkBadCert" />
                            ) : (
                              <FormattedMessage id="Measurement.Observations.Tls.Ok" />
                            )}
                          </StatusMark>
                        ) : (
                          <StatusMark tone="fail">{o.tls_failure}</StatusMark>
                        )}
                        {o.tls_version && (
                          <div className="text-xs text-gray-600">
                            {o.tls_version}
                            {o.tls_server_name
                              ? ` · SNI ${o.tls_server_name}`
                              : ''}
                          </div>
                        )}
                      </div>
                    ) : (
                      <NoData />
                    )}
                    <CtrlCounts
                      missing={!ctrl}
                      success={ctrl?.tls_success_count}
                      failure={ctrl?.tls_failure_count}
                    />
                    {ctrl?.tls_consistent && hasTLS(o) && (
                      <div className="text-xs text-gray-600">
                        <FormattedMessage id="Measurement.Observations.Tls.ConsistentInControl" />
                      </div>
                    )}
                  </td>
                  <td className={tdClass}>
                    <HttpCell o={o} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </DetailsBox>
  )
}

const StandaloneHttpSection = ({ group }: { group: TargetGroup }) => {
  const fmt = useNumberFormat()
  if (group.standaloneHTTP.length === 0) return null

  return (
    <DetailsBox
      title={<FormattedMessage id="Measurement.Observations.StandaloneHttp" />}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className={thClass}>
                <FormattedMessage id="Measurement.Observations.Table.Url" />
              </th>
              <th className={thClass}>
                <FormattedMessage id="Measurement.Observations.Table.Result" />
              </th>
              <th className={`${thClass} text-end`}>
                <FormattedMessage id="Measurement.Observations.Table.Runtime" />
              </th>
            </tr>
          </thead>
          <tbody>
            {group.standaloneHTTP.map((o) => (
              <tr key={o.observation_idx} className="even:bg-gray-50">
                <td className={`${tdClass} font-mono text-xs break-all`}>
                  {o.http_request_method ? `${o.http_request_method} ` : ''}
                  {o.http_request_url}
                </td>
                <td className={tdClass}>
                  {o.http_failure ? (
                    <StatusMark tone="fail">{o.http_failure}</StatusMark>
                  ) : (
                    <StatusMark tone="ok">
                      <FormattedMessage
                        id="Measurement.Observations.HttpStatus"
                        values={{ status: o.http_response_status_code ?? '?' }}
                      />
                      {o.http_response_body_length != null && (
                        <>
                          {' · '}
                          <FormattedMessage
                            id="Measurement.Observations.Bytes"
                            values={{
                              bytes: fmt(o.http_response_body_length),
                            }}
                          />
                        </>
                      )}
                    </StatusMark>
                  )}
                </td>
                <td
                  className={`${tdClass} text-end text-xs text-gray-600 tabular-nums`}
                >
                  {o.http_runtime != null
                    ? `${(o.http_runtime * 1000).toFixed(0)}ms`
                    : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DetailsBox>
  )
}

const aggregationFetcher = async ([
  ,
  hostKey,
  probeASN,
  resolverASN,
  since,
  until,
]: [string, string, number, number, string, string]) => {
  const hostnames = hostKey.split(',')
  const common = { hostnames, probeASN, since, until }
  const [isp, all] = await Promise.all([
    fetchAggregatedObservations({ ...common, resolverASN }),
    fetchAggregatedObservations(common),
  ])
  return {
    isp: bucketByDay(isp, since, until),
    all: bucketByDay(all, since, until),
  }
}

const FailurePanel = ({
  hostnames,
  probeASN,
  resolverASN,
  since,
  until,
}: {
  hostnames: string[]
  probeASN: number
  resolverASN: number | null
  since: string
  until: string
}) => {
  const chartResolverASN = resolverASN ?? probeASN
  const [hasOpened, setHasOpened] = useState(false)
  const { data, error, isLoading } = useSWR(
    hasOpened && hostnames.length > 0
      ? [
          'observations-aggregation',
          hostnames.join(','),
          probeASN,
          chartResolverASN,
          since,
          until,
        ]
      : null,
    aggregationFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  )

  const presentSeries = useMemo<Series[]>(() => {
    if (!data) return []
    const buckets: DayBucket[] = [...data.isp, ...data.all]
    const series: Series[] = []
    if (buckets.some((b) => b.none > 0)) series.push(NONE_SERIES)
    for (const f of FAILURE_FAMILIES) {
      if (buckets.some((b) => b.byFamily[f.key] > 0)) series.push(f)
    }
    return series
  }, [data])

  if (hostnames.length === 0) return null

  const yMax = data ? Math.max(maxStack(data.isp), maxStack(data.all)) : 0

  return (
    <DetailsBox
      collapsed
      onOpen={() => setHasOpened(true)}
      title={<FormattedMessage id="Measurement.Observations.OverTime" />}
    >
      <p className="text-gray-600 mb-3">
        <FormattedMessage
          id="Measurement.Observations.OverTime.Description"
          values={{ asn: probeASN, hostnames: hostnames.length }}
        />
      </p>
      {error && (
        <StatusMark tone="fail">
          <FormattedMessage
            id="Measurement.Observations.Chart.Error"
            values={{ error: error.message }}
          />
        </StatusMark>
      )}
      {isLoading && (
        <div className="flex justify-center py-4">
          <SpinLoader />
        </div>
      )}
      {data && (
        <>
          {presentSeries.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
              {presentSeries.map((f) => (
                <span key={f.key} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ background: f.color }}
                  />
                  <FormattedMessage id={f.labelId} />
                </span>
              ))}
            </div>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            <FailureChart
              title={
                <FormattedMessage
                  id="Measurement.Observations.Chart.ProbeResolver"
                  values={{ asn: chartResolverASN }}
                />
              }
              buckets={data.isp}
              yMax={yMax}
            />
            <FailureChart
              title={
                <FormattedMessage id="Measurement.Observations.Chart.AllResolvers" />
              }
              buckets={data.all}
              yMax={yMax}
            />
          </div>
        </>
      )}
    </DetailsBox>
  )
}

const TargetSection = ({
  group,
  probeASN,
  chartSince,
  chartUntil,
}: {
  group: TargetGroup
  probeASN: number
  chartSince: string
  chartUntil: string
}) => {
  // The resolver the probe actually used, as annotated on the observations
  const resolverASN =
    group.observations.find((o) => o.resolver_asn != null)?.resolver_asn ?? null

  const title = group.targetId ?? group.key
  // Hostname list is redundant when it just repeats the section title
  const hostnamesLabel =
    group.hostnames.length > 0 &&
    !(group.hostnames.length === 1 && group.hostnames[0] === title)
      ? group.hostnames.join(', ')
      : null

  return (
    <div>
      <h2 className="text-lg font-semibold mt-8">
        <span className="font-mono break-all">
          {title || <UnknownHostname />}
        </span>{' '}
        <span className="text-sm font-normal text-gray-600">
          {hostnamesLabel && (
            <>
              <span className="font-mono">{hostnamesLabel}</span> ·{' '}
            </>
          )}
          <FormattedMessage
            id="Measurement.Observations.ObservationCount"
            values={{ count: group.observations.length }}
          />
        </span>
      </h2>
      <DnsSection group={group} />
      <EndpointsSection group={group} />
      <StandaloneHttpSection group={group} />
      <FailurePanel
        hostnames={group.hostnames}
        probeASN={probeASN}
        resolverASN={resolverASN}
        since={chartSince}
        until={chartUntil}
      />
    </div>
  )
}

export default TargetSection
