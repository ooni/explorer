import bufferFrom from 'buffer-from'
import deepmerge from 'deepmerge'
import Link from 'next/link'
import { Cross, Tick } from 'ooni-components/icons'
import PropTypes from 'prop-types'
import { Fragment, useContext } from 'react'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import url from 'url'

import { EmbeddedViewContext } from '../../../pages/m/[measurement_uid]'
import ConditionalWrapper from '../../ConditionalWrapper'
import { DetailsBox } from '../DetailsBox'
import StatusInfo from '../StatusInfo'

const messages = defineMessages({
  'blockingReason.http-diff': {
    id: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.HTTP-diff',
    defaultMessage: '',
  },
  'blockingReason.http-failure': {
    id: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.HTTP-failure',
    defaultMessage: '',
  },
  'blockingReason.dns': {
    id: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.DNS',
    defaultMessage: '',
  },
  'blockingReason.tcp_ip': {
    id: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.TCP',
    defaultMessage: '',
  },
})

const HttpResponseBody = ({ request }) => {
  let body

  if (!request || !request.response || !request.response.body) {
    return <p>Empty body</p>
  }
  body = request.response.body
  if (typeof body === 'object' && body.format === 'base64') {
    body = bufferFrom(body.data, 'base64').toString('binary')
  }

  return <div className="whitespace-pre-wrap break-words text-sm">{body}</div>
}

HttpResponseBody.propTypes = {
  request: PropTypes.object.isRequired,
}

const RequestResponseContainer = ({ request }) => {
  return (
    // FIXME: This sometime ends up creating empty sections with just a title
    // when request data contains states like 'generic_timeout_error'
    // e.g ?report_id=20180709T222326Z_AS37594_FFQFSoqLJWYMgU0EnSbIK7PxicwJTFenIz9PupZYZWoXwtpCTy
    request.failure ? (
      <div>
        <FormattedMessage id="General.NoData" />
      </div>
    ) : (
      // !request.failure &&
      <>
        <div className="flex flex-wrap">
          {/* Request URL */}
          <div className="w-full mb-1">
            <h5>
              <FormattedMessage id="Measurement.Details.Websites.HTTP.Request.URL" />
            </h5>
          </div>
          <div className="w-full mb-2 p-4 bg-gray-200 text-sm overflow-auto">
            <pre>
              {request.request.method} {request.request.url}
            </pre>
          </div>
          {/* Response Headers */}
          <div className="w-full mb-1">
            <h5>
              <FormattedMessage id="Measurement.Details.Websites.HTTP.Response.Headers" />
            </h5>
          </div>
          <div className="w-full mb-2 p-4 bg-gray-200 text-sm overflow-auto">
            <pre className="whitespace-pre-wrap break-words text-sm">
              {request.response.headers ? (
                Object.keys(request.response.headers).map((header, index) => (
                  <Fragment key={index}>
                    <div className="flex mb-2">
                      <div className="mr-1 font-bold">{header}:</div>
                      <div>{request.response.headers[header]}</div>
                    </div>
                  </Fragment>
                ))
              ) : (
                <>Empty headers</>
              )}
            </pre>
          </div>
          {/* Response Body (HTML) */}
          <div className="w-full mb-1">
            <h5>
              <FormattedMessage id="Measurement.Details.Websites.HTTP.Response.Body" />
            </h5>
          </div>
          <div className="w-full p-4 bg-gray-200 text-sm">
            <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap break-words">
              <HttpResponseBody request={request} />
            </pre>
          </div>
        </div>
      </>
    )
  )
}

RequestResponseContainer.propTypes = {
  request: PropTypes.object.isRequired,
}

const FailureString = ({ failure }) => {
  if (typeof failure === 'undefined') {
    return <FormattedMessage id="General.NoData" />
  }
  if (!failure) {
    return (
      <div className="flex">
        <Tick size={20} />{' '}
        <FormattedMessage id="Measurement.Details.Websites.Failures.Values.Null" />
      </div>
    )
  }

  return (
    <div className="flex">
      <Cross size={20} /> {failure}
    </div>
  )
}

FailureString.propTypes = {
  failure: PropTypes.string,
}

const dnsAnswerIpInfo = (dnsAnswer) => {
  const asn = dnsAnswer.asn ? `AS${dnsAnswer.asn}` : 'Unknown AS'
  const asOrgName = dnsAnswer.as_org_name ? `(${dnsAnswer.as_org_name})` : ''

  return `${asn} ${asOrgName}`.trim()
}

const QueryContainer = ({ query }) => {
  const { query_type, answers, hostname, engine, failure } = query
  return (
    <div className="flex flex-wrap my-2">
      <div className="w-full mb-2">
        {/* Metadata */}
        <div className="flex">
          <div className="mr-2">
            <strong>Query:</strong>
          </div>
          <div className="mr-2">
            IN {query_type} {hostname}
          </div>
        </div>
        <div className="flex">
          <div className="mr-2">
            <strong>Engine: </strong>
          </div>
          <div className="mr-2">{engine}</div>
        </div>
      </div>
      {failure && (
        <div className="w-full">
          <FailureString failure={failure} />
        </div>
      )}
      {!failure && (
        <table class="w-full flex flex-row flex-no-wrap sm:inline-table table-fixed">
          <thead>
            <tr class="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0">
              <th class="py-1 pe-1 text-left">Name</th>
              <th class="py-1 pe-1 text-left">Class</th>
              <th class="py-1 pe-1 text-left">TTL</th>
              <th class="py-1 pe-1 text-left">Type</th>
              <th class="py-1 pe-1 text-left">DATA</th>
              <th class="py-1 pe-1 text-left">Answer IP Info</th>
            </tr>
          </thead>
          <tbody class="flex-1 sm:flex-none">
            {Array.isArray(answers) &&
              answers.map((dnsAnswer, index) => (
                <tr
                  key={index}
                  class="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0"
                >
                  <td class="py-1 pe-1">@</td>
                  <td class="py-1 pe-1">IN</td>
                  <td class="py-1 pe-1">{dnsAnswer.ttl || <>&nbsp;</>}</td>
                  <td class="py-1 pe-1">
                    {dnsAnswer.answer_type || <>&nbsp;</>}
                  </td>
                  <td class="py-1 pe-1">
                    {
                      dnsAnswer.answer_type === 'A' ? (
                        dnsAnswer.ipv4
                      ) : dnsAnswer.answer_type === 'AAAA' ? (
                        dnsAnswer.ipv6
                      ) : dnsAnswer.answer_type === 'CNAME' ? (
                        dnsAnswer.hostname
                      ) : (
                        <>&nbsp;</>
                      ) // for any other answer_type, DATA column will be empty
                    }
                  </td>
                  <td class="py-1">
                    {dnsAnswerIpInfo(dnsAnswer) || <>&nbsp;</>}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

QueryContainer.propTypes = {
  query: PropTypes.object,
}

/*
 * This validation function can either be evolved into a generic one to run before
 * deciding to render a specific component from `measurement/nettests/*`
 * or similar local methods across all other measurements. Right now it makes sure
 * the component works with an object that has all the expected keys,
 * even if they are absent in API responses.
 */
const validateMeasurement = (measurement) => {
  // assign valid defaults like `undefined` or `null` to each property
  // Useful when parts of the measurement object are absent
  const validDefaults = {
    input: undefined,
    probe_asn: undefined,
    scores: {
      analysis: {
        blocking_type: undefined,
      },
    },
    test_keys: {
      accessible: undefined,
      blocking: undefined,
      queries: undefined,
      tcp_connect: undefined,
      requests: undefined,
      client_resolver: undefined,
      http_experiment_failure: undefined,
      dns_experiment_failure: undefined,
      control_failure: undefined,
    },
  }
  return deepmerge(validDefaults, measurement)
}

const getSearchHref = (input) =>
  `${process.env.NEXT_PUBLIC_EXPLORER_URL}/search?input=${input}`

const StyledLink = ({ children, href }) => (
  <Link href={href} className="inline" style={{ direction: 'ltr' }}>
    {children}
  </Link>
)

const UrlWrapper = ({ href }) => {
  const isEmbeddedView = useContext(EmbeddedViewContext)

  return (
    <ConditionalWrapper
      condition={!isEmbeddedView}
      wrapper={(children) => (
        <StyledLink href={getSearchHref(href)}>{children}</StyledLink>
      )}
    >
      {href}
    </ConditionalWrapper>
  )
}

const WebConnectivityDetails = ({
  isConfirmed,
  isAnomaly,
  isFailure,
  country,
  measurement,
  scores,
  measurement_start_time,
  probe_asn,
  input,
  render,
}) => {
  const {
    test_keys: {
      accessible,
      blocking,
      queries,
      tcp_connect,
      requests,
      client_resolver,
      http_experiment_failure,
      dns_experiment_failure,
      control_failure,
    },
  } = validateMeasurement(measurement ?? {})

  const isEmbeddedView = useContext(EmbeddedViewContext)

  const intl = useIntl()
  const date = new Intl.DateTimeFormat(intl.locale, {
    dateStyle: 'long',
    timeStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(measurement_start_time))

  const p = url.parse(input)
  const hostname = p.host

  let status = 'default'
  let reason = null
  let summaryText = ''
  const headMetadata = { message: '', formatted: true }

  if (isFailure) {
    status = 'error'
    reason = null
    summaryText = (
      <FormattedMessage
        id="Measurement.SummaryText.Websites.Failed"
        values={{
          date,
          WebsiteURL: <UrlWrapper href={input} />,
          network: probe_asn,
          country,
        }}
      />
    )
  } else if (isConfirmed) {
    status = 'confirmed'
    summaryText = (
      <FormattedMessage
        id="Measurement.SummaryText.Websites.ConfirmedBlocked"
        values={{
          date,
          WebsiteURL: <UrlWrapper href={input} />,
          network: probe_asn,
          country,
        }}
      />
    )
    headMetadata.message = intl.formatMessage(
      {
        id: 'Measurement.Metadata.WebConnectivity.ConfirmedBlocked',
        defaultMessage: '{hostname} was blocked in {country}',
      },
      {
        date,
        hostname,
        country,
      },
    )
  } else if (isAnomaly) {
    status = 'anomaly'
    const blockingReason = blocking ?? scores?.analysis?.blocking_type ?? null
    reason =
      messages[`blockingReason.${blockingReason}`] &&
      intl.formatMessage(messages[`blockingReason.${blockingReason}`])
    summaryText = (
      <FormattedMessage
        id="Measurement.SummaryText.Websites.Anomaly"
        values={{
          date,
          WebsiteURL: <UrlWrapper href={input} />,
          'link-to-docs': (string) =>
            isEmbeddedView ? (
              string
            ) : (
              <a href="https://ooni.org/support/faq/#why-do-false-positives-occur">
                {string}
              </a>
            ),
          network: probe_asn,
          country,
          reason,
        }}
      />
    )
    headMetadata.message = intl.formatMessage(
      {
        id: 'Measurement.Metadata.WebConnectivity.Anomaly',
        defaultMessage: '{hostname} showed signs of {reason} in {country}',
      },
      {
        date,
        hostname,
        country,
        reason,
      },
    )
  } else if (accessible) {
    status = 'reachable'
    summaryText = (
      <FormattedMessage
        id="Measurement.SummaryText.Websites.Accessible"
        values={{
          date,
          WebsiteURL: <UrlWrapper href={input} />,
          network: probe_asn,
          country,
        }}
      />
    )
    headMetadata.message = intl.formatMessage(
      {
        id: 'Measurement.Metadata.WebConnectivity.Accessible',
        defaultMessage: '{hostname} was accessible in {country}',
      },
      {
        date,
        hostname,
        country,
      },
    )
  } else if (blocking === false) {
    // When not accessible, but also not blocking, it must be down
    status = 'down'
    summaryText = (
      <FormattedMessage
        id="Measurement.SummaryText.Websites.Down"
        values={{
          date,
          WebsiteURL: <UrlWrapper href={input} />,
          network: probe_asn,
          country,
        }}
      />
    )
    headMetadata.message = intl.formatMessage(
      {
        id: 'Measurement.Metadata.WebConnectivity.Down',
        defaultMessage: '{hostname} was down in {country}',
      },
      {
        date,
        hostname,
        country,
      },
    )
  } else {
    // Fallback condition to handle older measurements not present in fastpath
    // See: https://github.com/ooni/explorer/issues/426#issuecomment-612094244
    status = 'error'
    summaryText = (
      <FormattedMessage
        id="Measurement.SummaryText.Websites.Failed"
        values={{
          date,
          WebsiteURL: <UrlWrapper href={input} />,
          network: probe_asn,
          country,
        }}
      />
    )
    headMetadata.message = intl.formatMessage(
      {
        id: 'Measurement.Metadata.WebConnectivity.Failed',
        defaultMessage: '{hostname} failed to be measured in {country}',
      },
      {
        date,
        hostname,
        country,
      },
    )
  }

  const tcpConnections = Array.isArray(tcp_connect)
    ? tcp_connect.map((connection) => {
        return {
          destination: `${connection.ip}:${connection.port}`,
          failure: connection.status?.failure,
        }
      })
    : []

  return (
    <>
      {render({
        status: status,
        statusInfo: (
          <StatusInfo
            title={
              <ConditionalWrapper
                condition={!isEmbeddedView}
                wrapper={(children) => (
                  <Link
                    className="text-white underline hover:text-white"
                    href={`/domain/${hostname}`}
                  >
                    {children}
                  </Link>
                )}
              >
                {input}
              </ConditionalWrapper>
            }
            message={reason}
          />
        ),
        summaryText: summaryText,
        headMetadata: headMetadata,
        details: (
          <>
            {/* Failures */}

            <DetailsBox
              title={
                <FormattedMessage id="Measurement.Details.Websites.Failures.Heading" />
              }
              content={
                <div className="flex mb-2 flex-wrap">
                  <div className="w-1/2 md:w-1/3">
                    <FormattedMessage id="Measurement.Details.Websites.Failures.Label.HTTP" />
                  </div>
                  <div className="w-1/2 md:w-2/3">
                    <FailureString failure={http_experiment_failure} />
                  </div>
                  <div className="w-1/2 md:w-1/3">
                    <FormattedMessage id="Measurement.Details.Websites.Failures.Label.DNS" />
                  </div>
                  <div className="w-1/2 md:w-2/3">
                    <FailureString failure={dns_experiment_failure} />
                  </div>
                  <div className="w-1/2 md:w-1/3">
                    <FormattedMessage id="Measurement.Details.Websites.Failures.Label.Control" />
                  </div>
                  <div className="w-1/2 md:w-2/3">
                    <FailureString failure={control_failure} />
                  </div>
                </div>
              }
            />

            {/* DNS Queries */}

            <DetailsBox
              title={
                <FormattedMessage id="Measurement.Details.Websites.DNSQueries.Heading" />
              }
              content={
                Array.isArray(queries) ? (
                  <>
                    <div className="flex flex-wrap mb-2">
                      <div className="mr-1">
                        <strong>
                          <FormattedMessage id="Measurement.Details.Websites.DNSQueries.Label.Resolver" />
                          :
                        </strong>
                      </div>
                      <div>{client_resolver || '(unknown)'}</div>
                    </div>
                    <div className="w-full">
                      {queries.map((query, index) => (
                        <QueryContainer key={index} query={query} />
                      ))}
                    </div>
                  </>
                ) : (
                  <FormattedMessage id="General.NoData" />
                )
              }
            />

            {/* TCP COnnections */}

            <DetailsBox
              title={
                <FormattedMessage id="Measurement.Details.Websites.TCP.Heading" />
              }
              content={
                tcpConnections.length > 0 ? (
                  tcpConnections.map((connection, index) => (
                    <div className="flex" key={index}>
                      <div>
                        <strong>{connection.destination}</strong>:{' '}
                        {connection.failure
                          ? `${intl.formatMessage({ id: 'Measurement.Details.Websites.TCP.ConnectionTo.Failed' })} (${connection.failure})`
                          : intl.formatMessage({
                              id: 'Measurement.Details.Websites.TCP.ConnectionTo.Success',
                            })}
                      </div>
                    </div>
                  ))
                ) : (
                  <FormattedMessage id="General.NoData" />
                )
              }
            />

            {/* I would like us to enrich the HTTP response body section with
              information about every request and response as this is a very common
            thing we look at when investigating a case. */}

            <DetailsBox
              title={
                <FormattedMessage id="Measurement.Details.Websites.HTTP.Heading" />
              }
              content={
                Array.isArray(requests) ? (
                  <div className="w-full">
                    {requests.map((request, index) => (
                      <RequestResponseContainer key={index} request={request} />
                    ))}
                  </div>
                ) : (
                  <FormattedMessage id="General.NoData" />
                )
              }
            />
          </>
        ),
      })}
    </>
  )
}

export default WebConnectivityDetails
