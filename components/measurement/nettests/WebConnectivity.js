import React from 'react'
import PropTypes from 'prop-types'
import bufferFrom from 'buffer-from'
import url from 'url'
import {
  Heading,
  Flex,
  Box,
  Text
} from 'ooni-components'

import moment from 'moment'
import { Tick, Cross } from 'ooni-components/dist/icons'
import deepmerge from 'deepmerge'
import styled from 'styled-components'

import { FormattedMessage, defineMessages, useIntl } from 'react-intl'

import { DetailsBox } from '../DetailsBox'
import FormattedMarkdown from '../../FormattedMarkdown'

const messages = defineMessages({
  'blockingReason.http-diff': {
    id: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.HTTP-diff',
    defaultMessage: ''
  },
  'blockingReason.http-failure': {
    id: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.HTTP-failure',
    defaultMessage: ''
  },
  'blockingReason.dns': {
    id: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.DNS',
    defaultMessage: ''
  },
  'blockingReason.tcp_ip': {
    id: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.TCP',
    defaultMessage: ''
  },
  'connection.Success': {
    id: 'Measurement.Details.Websites.TCP.ConnectionTo.Success',
    defaultMessage: ''
  },
  'connection.Failed': {
    id: 'Measurement.Details.Websites.TCP.ConnectionTo.Failed',
    defaultMessage: ''
  },
  'connection.Blocked': {
    id: 'Measurement.Details.Websites.TCP.ConnectionTo.Blocked',
    defaultMessage: ''
  },
})

const StatusInfo = ({ url, message}) => (
  <Flex flexDirection='column'>
    <Box mb={3}>
      <Text textAlign='center' fontSize={28}> {url} </Text>
    </Box>
    <Box>
      <Text textAlign='center' fontSize={20} fontWeight='bold'> {message} </Text>
    </Box>
  </Flex>
)

StatusInfo.propTypes = {
  url: PropTypes.string,
  message: PropTypes.string
}

// From https://css-tricks.com/snippets/css/make-pre-text-wrap/
const WrappedPre = styled.pre`
  white-space: pre-wrap;       /* css-3 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
`

const HttpResponseBodyContainer = styled(WrappedPre)`
  max-height: 500px;
  overflow: auto;
`

const HttpResponseBody = ({request}) => {
  let body

  if (!request || !request.response || !request.response.body) {
    return <p>Empty body</p>
  }
  body = request.response.body
  if (typeof body == 'object' && body.format === 'base64') {
    body = bufferFrom(body.data, 'base64').toString('binary')
  }

  return (
    <HttpResponseBodyContainer fontSize={14}>
      {body}
    </HttpResponseBodyContainer>
  )
}

HttpResponseBody.propTypes = {
  request: PropTypes.object.isRequired
}

const RequestResponseContainer = ({request}) => {
  return (
    // FIXME: This sometime ends up creating empty sections with just a title
    // when request data contains states like 'generic_timeout_error'
    // e.g ?report_id=20180709T222326Z_AS37594_FFQFSoqLJWYMgU0EnSbIK7PxicwJTFenIz9PupZYZWoXwtpCTy
    request.failure ? (
      <Box>
        <FormattedMessage id='Measurement.Details.Websites.HTTP.NoData' />
      </Box>
    ) : (
    // !request.failure &&
      <Box>
        <Flex flexWrap='wrap'>
          {/* Request URL */}
          <Box width={1} mb={1} >
            <Heading h={5}><FormattedMessage id='Measurement.Details.Websites.HTTP.Request.URL' /></Heading>
          </Box>
          <Box width={1} mb={2} p={2} bg='gray2'>
            <pre fontSize={14}>{request.request.method} {request.request.url}</pre>
          </Box>
          {/* Response Headers */}
          <Box width={1} mb={1} >
            <Heading h={5}><FormattedMessage id='Measurement.Details.Websites.HTTP.Response.Headers' /></Heading>
          </Box>
          <Box width={1} mb={2} p={2} bg='gray2'>
            <WrappedPre fontSize={14}>
              {Object.keys(request.response.headers).map((header, index) => (
                <React.Fragment key={index}>
                  <Flex mb={2}>
                    <Box mr={1}>
                      <Text fontWeight='bold'>{header}:</Text>
                    </Box>
                    <Box>
                      {request.response.headers[header]}
                    </Box>
                  </Flex>
                </React.Fragment>
              ))}
            </WrappedPre>
          </Box>
          {/* Response Body (HTML) */}
          <Box width={1} mb={1} >
            <Heading h={5}><FormattedMessage id='Measurement.Details.Websites.HTTP.Response.Body' /></Heading>
          </Box>
          <Box width={1} p={2} bg='gray2'>
            <HttpResponseBody request={request} />
          </Box>
        </Flex>
      </Box>
    )
  )
}

RequestResponseContainer.propTypes = {
  request: PropTypes.object.isRequired
}

const FailureString = ({failure}) => {
  if (typeof failure === 'undefined') {
    return (<FormattedMessage id='Measurement.Details.Websites.Failures.Values.Unknown' />)
  }
  if (!failure) {
    return (
      <div>
        <Tick size={20} /> <FormattedMessage id='Measurement.Details.Websites.Failures.Values.Null' />
      </div>
    )
  }

  return (
    <div>
      <Cross size={20} /> {failure}
    </div>
  )
}

FailureString.propTypes = {
  failure: PropTypes.string
}

const DnsAnswerCell = (props) => (
  <Box width={1/8}>{props.children}</Box>
)

DnsAnswerCell.propTypes = {
  children: PropTypes.any
}

const FiveColRow = ({ name = 'Name', netClass = 'Class', ttl = 'TTL', type = 'Type', data = 'DATA', header = false}) => (
  <Text fontWeight={header ? 'bold' : undefined}>
    <Flex flexWrap='wrap' mb={2}>
      <DnsAnswerCell>{name}</DnsAnswerCell>
      <DnsAnswerCell>{netClass}</DnsAnswerCell>
      <DnsAnswerCell>{ttl}</DnsAnswerCell>
      <DnsAnswerCell>{type}</DnsAnswerCell>
      <DnsAnswerCell>{data}</DnsAnswerCell>
    </Flex>
  </Text>
)

FiveColRow.propTypes = {
  name: PropTypes.string,
  netClass: PropTypes.string,
  ttl: PropTypes.number,
  type: PropTypes.string,
  data: PropTypes.string,
  header: PropTypes.bool
}

const QueryContainer = ({query}) => {
  const {
    query_type,
    answers,
    hostname,
    engine,
    failure
  } = query
  return (
    <Flex flexWrap='wrap' my={2}>
      <Box width={1} mb={2}>
        {/* Metadata */}
        <Flex>
          <Box mr={2}>
            <strong>Query:</strong>
          </Box>
          <Box mr={2}>
            IN {query_type} {hostname}
          </Box>
        </Flex>
        <Flex>
          <Box mr={2}>
            <strong>Engine: </strong>
          </Box>
          <Box mr={2}>
            {engine}
          </Box>
        </Flex>
      </Box>
      {failure && <Box width={1}><FailureString failure={failure} /></Box>}
      {!failure &&
        <Box width={1}>
          <FiveColRow header />
          {Array.isArray(answers) && answers.map((dnsAnswer, index) => (
            <FiveColRow
              key={index}
              name='@'
              netClass='IN'
              ttl={dnsAnswer.ttl}
              type={dnsAnswer.answer_type}
              data={dnsAnswer.answer_type === 'A'
                ? dnsAnswer.ipv4
                : dnsAnswer.answer_type === 'AAAA'
                  ? dnsAnswer.ipv6
                  : dnsAnswer.answer_type === 'CNAME'
                    ? dnsAnswer.hostname
                    : null // for any other answer_type, DATA column will be empty
              }
            />
          ))}
        </Box>
      }
    </Flex>

  )
}

QueryContainer.propTypes = {
  query: PropTypes.object
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
        blocking_type: undefined
      }
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
      control_failure: undefined
    }
  }
  return deepmerge(validDefaults, measurement)
}

const WebConnectivityDetails = ({
  isConfirmed,
  isAnomaly,
  isFailure,
  country,
  measurement,
  scores,
  test_start_time,
  probe_asn,
  input,
  render
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
      control_failure
    }
  } = validateMeasurement(measurement ?? {})

  const intl = useIntl()
  const date = intl.formatDate(moment.utc(test_start_time).toDate(), {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: 'numeric',
    timeZone: 'UTC',
    timeZoneName: 'short'
  })

  const p = url.parse(input)
  const hostname = p.host

  let status = 'default'
  let reason = null
  let summaryText = ''
  let headMetadata = { message: '', formatted: true }

  if (isFailure) {
    status = 'error'
    reason = null
    summaryText = (
      <FormattedMessage
        id='Measurement.SummaryText.Websites.Failed'
        values={{
          date: date,
          WebsiteURL: input,
          network: probe_asn,
          country: country,
        }}
      />
    )
  } else if(isConfirmed) {
    status = 'confirmed'
    summaryText = intl.formatMessage(
      {
        id: 'Measurement.SummaryText.Websites.ConfirmedBlocked'
      },
      {
        date: date,
        WebsiteURL: input,
        network: probe_asn,
        country: country,
      }
    )
    headMetadata.message = intl.formatMessage(
      {
        id: 'Measurement.Metadata.WebConnectivity.ConfirmedBlocked',
        defaultMessage: '{hostname} was blocked in {country}'
      },
      {
        date: date,
        hostname,
        country: country,
      }
    )
  } else if (isAnomaly) {
    status = 'anomaly'
    const blockingReason = blocking ?? scores?.analysis?.blocking_type ?? null
    reason = messages[`blockingReason.${blockingReason}`] && intl.formatMessage(messages[`blockingReason.${blockingReason}`])
    summaryText = (<FormattedMarkdown
      id='Measurement.SummaryText.Websites.Anomaly'
      values={{
        date: date,
        WebsiteURL: input,
        network: probe_asn,
        country: country,
        BlockingReason: reason && `**${reason}**`
      }}
    />)
    headMetadata.message = intl.formatMessage(
      {
        id: 'Measurement.Metadata.WebConnectivity.Anomaly',
        defaultMessage: '{hostname} showed signs of {reason} in {country}'
      },
      {
        date: date,
        hostname,
        country: country,
        reason: reason
      }
    )
  } else if (accessible) {
    status = 'reachable'
    summaryText = intl.formatMessage(
      {
        id: 'Measurement.SummaryText.Websites.Accessible'
      },
      {
        date: date,
        WebsiteURL: input,
        network: probe_asn,
        country: country
      }
    )
    headMetadata.message = intl.formatMessage(
      {
        id: 'Measurement.Metadata.WebConnectivity.Accessible',
        defaultMessage: '{hostname} was accessible in {country}'
      },
      {
        date: date,
        hostname,
        country: country,
      }
    )
  } else if (blocking === false) {
    // When not accessible, but also not blocking, it must be down
    status = 'down'
    summaryText = intl.formatMessage(
      {
        id: 'Measurement.SummaryText.Websites.Down'
      },
      {
        date: date,
        WebsiteURL: input,
        network: probe_asn,
        country: country
      }
    )
    headMetadata.message = intl.formatMessage(
      {
        id: 'Measurement.Metadata.WebConnectivity.Down',
        defaultMessage: '{hostname} was down in {country}'
      },
      {
        date: date,
        hostname,
        country: country,
      }
    )
  } else {
    // Fallback condition to handle older measurements not present in fastpath
    // See: https://github.com/ooni/explorer/issues/426#issuecomment-612094244
    status = 'error'
    summaryText = intl.formatMessage(
      {
        id: 'Measurement.SummaryText.Websites.Failed'
      },
      {
        date: date,
        WebsiteURL: input,
        network: probe_asn,
        country: country
      }
    )
    headMetadata.message = intl.formatMessage(
      {
        id: 'Measurement.Metadata.WebConnectivity.Failed',
        defaultMessage: '{hostname} failed to be measured in {country}'
      },
      {
        date: date,
        hostname,
        country: country,
      }
    )
  }

  const tcpConnections = Array.isArray(tcp_connect) ? tcp_connect.map((connection) => {
    const status = (connection.status.success) ? 'Success' :
      (connection.status.blocked) ? 'Blocked' : 'Failed'
    return {
      destination: connection.ip + ':' + connection.port,
      status
    }
  }) : []

  return (
    <React.Fragment>
      {render({
        status: status,
        statusInfo: <StatusInfo url={input} message={reason} />,
        summaryText: summaryText,
        headMetadata: headMetadata,
        details: (
          <React.Fragment>
            {/* Failures */}
            <Flex>
              <DetailsBox
                title={<FormattedMessage id='Measurement.Details.Websites.Failures.Heading' />}
                content={
                  <Flex mb={2} flexWrap='wrap'>
                    <Box width={1/3}>
                      <FormattedMessage id='Measurement.Details.Websites.Failures.Label.HTTP' />
                    </Box>
                    <Box width={2/3}>
                      <FailureString failure={http_experiment_failure} />
                    </Box>
                    <Box width={1/3}>
                      <FormattedMessage id='Measurement.Details.Websites.Failures.Label.DNS' />
                    </Box>
                    <Box width={2/3}>
                      <FailureString failure={dns_experiment_failure} />
                    </Box>
                    <Box width={1/3}>
                      <FormattedMessage id='Measurement.Details.Websites.Failures.Label.Control' />
                    </Box>
                    <Box width={2/3}>
                      <FailureString failure={control_failure} />
                    </Box>
                  </Flex>
                }
              />
            </Flex>
            {/* DNS Queries */}
            <Flex>
              <DetailsBox
                title={<FormattedMessage id='Measurement.Details.Websites.DNSQueries.Heading' />}
                content={
                  Array.isArray(queries) ? (
                    <React.Fragment>
                      <Flex flexWrap='wrap' mb={2}>
                        <Box mr={1}>
                          <strong><FormattedMessage id='Measurement.Details.Websites.DNSQueries.Label.Resolver' />:</strong>
                        </Box>
                        <Box>
                          {client_resolver || '(unknown)'}
                        </Box>
                      </Flex>
                      <Box width={1}>
                        {queries.map((query, index) => <QueryContainer key={index} query={query} />)}
                      </Box>
                    </React.Fragment>
                  ) : (
                    <FormattedMessage id='Measurement.Details.Websites.DNSQueries.NoData' />
                  )
                }
              />
            </Flex>
            {/* TCP COnnections */}
            <Flex>
              <DetailsBox
                title={<FormattedMessage id='Measurement.Details.Websites.TCP.Heading' />}
                content={
                  tcpConnections.length > 0 ? (
                    tcpConnections.map((connection, index) => (
                      <Flex key={index}>
                        <Box>
                          <Text>
                            <FormattedMessage
                              id='Measurement.Details.Websites.TCP.ConnectionTo'
                              values={{
                                destination: <strong> {connection.destination} </strong>,
                                connectionStatus: intl.formatMessage(messages[`connection.${connection.status}`])
                              }}
                            />
                          </Text>
                        </Box>
                      </Flex>
                    ))
                  ) : (
                    <FormattedMessage id='Measurement.Details.Websites.TCP.NoData' />
                  )
                }
              />
            </Flex>
            {/* I would like us to enrich the HTTP response body section with
              information about every request and response as this is a very common
            thing we look at when investigating a case. */}
            <Flex>
              <DetailsBox
                title={<FormattedMessage id='Measurement.Details.Websites.HTTP.Heading' />}
                content={
                  Array.isArray(requests) ? (
                    <Box width={1}>
                      {requests.map((request, index) => <RequestResponseContainer key={index} request={request} />)}
                    </Box>
                  ) : (
                    <FormattedMessage id='Measurement.Details.Websites.HTTP.NoData' />
                  )
                }
              />
            </Flex>
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

WebConnectivityDetails.propTypes = {
  country: PropTypes.string.isRequired,
  input: PropTypes.any,
  isAnomaly: PropTypes.bool.isRequired,
  isConfirmed: PropTypes.bool.isRequired,
  isFailure: PropTypes.bool.isRequired,
  measurement: PropTypes.object.isRequired,
  probe_asn: PropTypes.any,
  render: PropTypes.func,
  scores: PropTypes.shape({
    analysis: PropTypes.shape({
      blocking_type: PropTypes.any
    })
  }),
  test_start_time: PropTypes.any
}

export default WebConnectivityDetails
