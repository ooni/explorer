import type { CtrlGroundTruthEntry, WebObservation } from './types'

export const hasDNS = (o: WebObservation): boolean =>
  o.dns_query_type != null || o.dns_failure != null || o.dns_answer != null

export const hasTCP = (o: WebObservation): boolean =>
  o.ip != null && (o.tcp_success != null || o.tcp_failure != null)

export const hasTLS = (o: WebObservation): boolean =>
  o.tls_failure != null ||
  o.tls_version != null ||
  o.tls_cipher_suite != null ||
  o.tls_is_certificate_valid != null ||
  o.tls_handshake_time != null

export const hasHTTP = (o: WebObservation): boolean =>
  o.http_request_url != null || o.http_failure != null

export function observationHostname(o: WebObservation): string {
  if (o.hostname) return o.hostname
  if (o.http_request_url) {
    try {
      return new URL(o.http_request_url).hostname
    } catch {
      /* fall through */
    }
  }
  return ''
}

export interface ResolverGroup {
  engine: string
  resolverAddress: string
  queries: WebObservation[]
}

// Observations disaggregated by target_id (what the experiment was testing,
// e.g. "signal/chat"). Not every test sets one — web_connectivity does not —
// so rows without a target_id fall back to grouping by hostname. Control
// measurements have no target_id at all and are always matched by hostname.
export interface TargetGroup {
  key: string // target_id when present, hostname otherwise
  targetId: string | null
  hostnames: string[] // distinct hostnames observed in this group
  observations: WebObservation[]
  // DNS queries disaggregated by the resolver that served them
  dnsByResolver: ResolverGroup[]
  // One row per observation carrying an endpoint (ip:port): TCP connect and
  // TLS handshake stay on the same row when the probe reported them on the
  // same observation, and so does the HTTP request when present.
  endpoints: WebObservation[]
  // HTTP(S) requests that could not be tied to an endpoint observation
  standaloneHTTP: WebObservation[]
  ctrl: CtrlGroundTruthEntry[]
}

export function groupByTarget(
  observations: WebObservation[],
  ctrl: CtrlGroundTruthEntry[],
): TargetGroup[] {
  const byKey = new Map<string, WebObservation[]>()
  for (const o of observations) {
    const key = o.target_id || observationHostname(o)
    const list = byKey.get(key) ?? []
    list.push(o)
    byKey.set(key, list)
  }

  const groups: TargetGroup[] = []
  for (const [key, rows] of byKey) {
    const resolvers = new Map<string, ResolverGroup>()
    const endpoints: WebObservation[] = []
    const standaloneHTTP: WebObservation[] = []
    const hostnames = [
      ...new Set(rows.map((o) => o.hostname).filter((h): h is string => !!h)),
    ].sort()

    for (const o of rows) {
      if (hasDNS(o)) {
        const engine = o.dns_engine || 'unknown'
        const resolverAddress = o.dns_engine_resolver_address || ''
        const rkey = `${engine} ${resolverAddress}`
        const g = resolvers.get(rkey) ?? {
          engine,
          resolverAddress,
          queries: [],
        }
        g.queries.push(o)
        resolvers.set(rkey, g)
      }
      if (o.ip != null && (hasTCP(o) || hasTLS(o) || hasHTTP(o))) {
        endpoints.push(o)
      } else if (hasHTTP(o)) {
        standaloneHTTP.push(o)
      }
    }

    groups.push({
      key,
      targetId: rows[0].target_id ?? null,
      hostnames,
      observations: rows,
      dnsByResolver: [...resolvers.values()],
      endpoints,
      standaloneHTTP,
      ctrl: ctrl.filter((c) => hostnames.includes(c.hostname)),
    })
  }
  return groups.sort((a, b) => a.key.localeCompare(b.key))
}

// Control entry for an endpoint observation: scope to the observation's
// hostname first (the control is keyed by hostname, not target_id), then
// match ip:port, relaxing to ip-only
export function ctrlForEndpoint(
  group: TargetGroup,
  o: WebObservation,
): CtrlGroundTruthEntry | undefined {
  const pool = o.hostname
    ? group.ctrl.filter((c) => c.hostname === o.hostname)
    : group.ctrl
  const exact = pool.find((c) => c.ip === o.ip && c.port === o.port)
  return exact ?? pool.find((c) => c.ip === o.ip)
}

const parseUidTimestamp = (uid: string): Date | null => {
  const m = uid.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/)
  if (!m) return null
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]))
}

const isoNoZ = (d: Date): string => d.toISOString().replace(/\.\d+Z$/, '')

// Window used to pull the control ground truth: one hour on each side of the
// measurement. The uid timestamp and measurement_start_time can disagree
// (probe clock skew), so the window spans both.
export function ctrlWindow(
  measurementUid: string,
  measurementStartTime: string,
): { since: string; until: string } {
  const times: number[] = []
  const fromUid = parseUidTimestamp(measurementUid)
  if (fromUid) times.push(fromUid.getTime())
  const fromMeta = new Date(measurementStartTime).getTime()
  if (!Number.isNaN(fromMeta)) times.push(fromMeta)
  if (times.length === 0) times.push(Date.now())
  const hour = 3600 * 1000
  return {
    since: isoNoZ(new Date(Math.min(...times) - hour)),
    until: isoNoZ(new Date(Math.max(...times) + hour)),
  }
}

// 30 days leading up to the measurement (plus the following day, so the
// measurement's own bucket is included whichever clock is right).
export function chartWindow(
  measurementUid: string,
  measurementStartTime: string,
): { since: string; until: string } {
  const day = 24 * 3600 * 1000
  const fromUid = parseUidTimestamp(measurementUid)
  const fromMeta = new Date(measurementStartTime).getTime()
  const t = Math.max(
    fromUid ? fromUid.getTime() : 0,
    Number.isNaN(fromMeta) ? 0 : fromMeta,
  )
  const ref = t > 0 ? t : Date.now()
  return {
    since: isoNoZ(new Date(ref - 30 * day)),
    until: isoNoZ(new Date(ref + day)),
  }
}
