import React from 'react'
import PropTypes from 'prop-types'
import bufferFrom from 'buffer-from'
import {
  Heading,
  Flex,
  Pre,
  Box
} from 'ooni-components'

import { Text } from 'rebass'
import moment from 'moment'
import { Tick, Cross } from 'ooni-components/dist/icons'

import styled from 'styled-components'

import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'

import { DetailsBox } from '../DetailsBox'

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

export const checkAnomaly = ( testKeys ) => {
  const {
    accessible,
    blocking,
  } = testKeys

  let anomaly = null
  let hint = <FormattedMessage id='Measurement.Status.Hint.Websites.NoCensorship' />

  if ((accessible === true || accessible === null) && blocking === null) {
    hint = <FormattedMessage id='Measurement.Status.Hint.Websites.Error' />
    if (accessible === true) {
      anomaly = 'SITEUP'
    } else if (accessible === null) {
      anomaly = 'UNKNOWN'
    }
  } else if (accessible === false && (blocking === false || blocking === null)) {
    anomaly = 'SITEDOWN'
    hint = <FormattedMessage id='Measurement.Status.Hint.Websites.Unavailable' />
  } else if (blocking !== null && blocking !== false) {
    anomaly = 'CENSORSHIP'
    hint = <FormattedMessage id='Measurement.Status.Hint.Websites.Censorship' />
    // Further identify type of censorship
    if (blocking === 'dns') {
      anomaly = 'DNS'
      hint = <FormattedMessage id='Measurement.Status.Hint.Websites.DNS' />
    } else if (blocking === 'http-diff') {
      anomaly = 'HTTPDIFF'
      hint = <FormattedMessage id='Measurement.Status.Hint.Websites.HTTPdiff' />
    } else if (blocking === 'http-failure') {
      anomaly = 'HTTPFAILURE'
      hint = <FormattedMessage id='Measurement.Status.Hint.Websites.HTTPfail' />
    } else if (blocking === 'tcp-ip') {
      anomaly = 'TCPIP'
      hint = <FormattedMessage id='Measurement.Status.Hint.Websites.TCPBlock' />
    }
  }

  return {
    status: anomaly,
    hint
  }
}

const StatusInfo = ({ url, message}) => (
  <Flex flexDirection='column'>
    <Box>
      <Text textAlign='center' fontSize={28}> {url} </Text>
    </Box>
    <Box>
      <Text textAlign='center' fontSize={20} fontWeight='bold'> {message} </Text>
    </Box>
  </Flex>
)

// From https://css-tricks.com/snippets/css/make-pre-text-wrap/
const WrappedPre = styled(Pre)`
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
            <Pre fontSize={14}>{request.request.method} {request.request.url}</Pre>
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

const FailureString = ({failure}) => {
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
  children: PropTypes.element
}

const FiveColRow = ({ name = 'Name', netClass = 'Class', ttl = 'TTL', type = 'Type', data = 'DATA', header = false}) => (
  <Text fontWeight={header && 'bold'}>
    <Flex flexWrap='wrap' mb={2}>
      <DnsAnswerCell>{name}</DnsAnswerCell>
      <DnsAnswerCell>{netClass}</DnsAnswerCell>
      <DnsAnswerCell>{ttl}</DnsAnswerCell>
      <DnsAnswerCell>{type}</DnsAnswerCell>
      <DnsAnswerCell>{type === 'A' ? data.ipv4 : type === 'CNAME' ? data.hostname : data}</DnsAnswerCell>
    </Flex>
  </Text>
)

FiveColRow.propTypes = {
  name: PropTypes.string,
  netClass: PropTypes.string,
  ttl: PropTypes.string,
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
    <Flex flexWrap='wrap'>
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
      <Box width={1}>
        <FiveColRow header />
        {answers.map((dnsAnswer, index) => (
          <FiveColRow
            key={index}
            name='@'
            netClass='IN'
            ttl={dnsAnswer.ttl}
            type={dnsAnswer.answer_type}
            data={{ipv4: dnsAnswer.ipv4, hostname: dnsAnswer.hostname}}
          />
        ))}
      </Box>
    </Flex>
  )
}

QueryContainer.propTypes = {
  query: PropTypes.object
}

const WebConnectivityDetails = ({
  isConfirmed,
  isAnomaly,
  isFailure,
  country,
  measurement,
  render,
  intl
}) => {
  const {
    input,
    probe_asn,
    test_start_time,
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
  } = measurement

  const date = moment(test_start_time).format('lll')
  const reasons = {
    'http-diff': 'HTTP-diff',
    'http-failure': 'HTTP-failure',
    'dns': 'DNS',
    'tcp_ip': 'TCP'
  }

  let status = 'default',
    // XXX: `reason` will soon be used in Hero
    reason = null,
    summaryText = ''

  // TODO: Disabled temporarily because `isFailure` is flagged incorrectly in
  // some measurments. When fixed, this should be uncommented and the last
  // section in the chain should be removed

  // if (isFailure) {
  //   status = 'error'
  //   reason = null
  //   summaryText = (
  //     <FormattedMessage
  //       id='Measurement.SummaryText.Websites.Failed'
  //       values={{
  //         date: date,
  //         WebsiteURL: input,
  //         network: probe_asn,
  //         country: country,
  //       }}
  //     />
  //   )
  // } else
  if(isConfirmed) {
    status = 'confirmed'
    reason = reasons[blocking]
    summaryText = (
      <FormattedMessage
        id='Measurement.SummaryText.Websites.ConfirmedBlocked'
        values={{
          date: date,
          WebsiteURL: input,
          network: probe_asn,
          country: country,
        }}
      />
    )
  } else if (isAnomaly) {
    status = 'anomaly'
    reason = reasons[blocking]
    summaryText = (
      <FormattedMessage
        id='Measurement.SummaryText.Websites.Anomaly'
        values={{
          date: date,
          WebsiteURL: input,
          network: probe_asn,
          country: country,
          BlockingReason: <strong>{intl.formatMessage(messages[`blockingReason.${blocking}`])}</strong>
        }}
      />
    )
  } else if (accessible) {
    status = 'reachable'
    reason = null
    summaryText = (
      <FormattedMessage
        id='Measurement.SummaryText.Websites.Accessible'
        values={{
          date: date,
          WebsiteURL: input,
          network: probe_asn,
          country: country
        }}
      />
    )
  } else {
    // TODO: Remove this block when the first block in this chain is enabled.
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
  }

  const tcpConnections = tcp_connect.map((connection) => {
    const status = (connection.status.success) ? 'Success' :
      (connection.status.blocked) ? 'Blocked' : 'Failed'
    return {
      destination: connection.ip + ':' + connection.port,
      status
    }
  })

  return (
    <React.Fragment>
      {render({
        status: status,
        statusInfo: <StatusInfo url={input} />,
        summaryText: summaryText,
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
                }
              />
            </Flex>
            {/* TCP COnnections */}
            <Flex>
              <DetailsBox
                title={<FormattedMessage id='Measurement.Details.Websites.TCP.Heading' />}
                content={
                  <React.Fragment>
                    {tcpConnections.length === 0 && <FormattedMessage id='Measurement.Details.Websites.TCP.NoData' />}
                    {tcpConnections.map((connection, index) => (
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
                    ))}
                  </React.Fragment>
                } />
            </Flex>
            {/* I would like us to enrich the HTTP response body section with
              information about every request and response as this is a very common
            thing we look at when investigating a case. */}
            <Flex>
              <DetailsBox
                title={<FormattedMessage id='Measurement.Details.Websites.HTTP.Heading' />}
                content={
                  <Box width={1}>
                    {requests.map((request, index) => <RequestResponseContainer key={index} request={request} />)}
                  </Box>
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
  isConfirmed: PropTypes.bool.isRequired,
  isAnomaly: PropTypes.bool.isRequired,
  isFailure: PropTypes.bool.isRequired,
  country: PropTypes.string.isRequired,
  measurement: PropTypes.object.isRequired,
  render: PropTypes.func
}

export default injectIntl(WebConnectivityDetails)
