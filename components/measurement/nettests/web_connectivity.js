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

import { FormattedMessage } from 'react-intl'

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

const StyledDetailsBox = styled(Box)`
  border: 2px solid ${props => props.theme.colors.gray2};
`

const DetailsBox = ({ title, content, ...props }) => (
  <StyledDetailsBox width={1} {...props} mb={3}>
    <Flex px={3} bg='gray2'>
      <Heading h={4}>{title}</Heading>
    </Flex>
    <Flex p={3} flexWrap='wrap'>
      {content}
    </Flex>
  </StyledDetailsBox>
)

DetailsBox.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.element
}

const HttpResponseBodyContainer = styled(Pre)`
  background-color: ${props => props.theme.colors.gray2};
  max-height: 500px;
  overflow: auto;
`

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
      <Box width={1} mb={1}>
        <Flex justifyContent='space-between' pr={4}>
          <Box>
            {hostname}
          </Box>
          <Box>
            IN
          </Box>
          <Box>
            {query_type}
          </Box>
          <Box>
            engine: {engine}
          </Box>
        </Flex>
      </Box>
      {failure && <Box width={1}><FailureString failure={failure} /></Box>}
      <Box width={1}>
        {answers.map((dnsAnswer, index) => (
          <Flex key={index} flexWrap='wrap' mb={1}>
            <Box width={1/3}>
              {dnsAnswer.answer_type}
            </Box>
            <Box width={2/3}>
              {dnsAnswer.answer_type === 'A' && dnsAnswer.ipv4}
              {dnsAnswer.answer_type === 'CNAME' && dnsAnswer.hostname}
            </Box>
          </Flex>
        ))}
      </Box>
    </Flex>
  )
}

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
    <HttpResponseBodyContainer>
      {body}
    </HttpResponseBodyContainer>
  )
}
const RequestResponseContainer = ({request}) => {
  return (
    // FIXME: This sometime ends up creating empty sections with just a title
    // when request data contains states like 'generic_timeout_error'
    // e.g ?report_id=20180709T222326Z_AS37594_FFQFSoqLJWYMgU0EnSbIK7PxicwJTFenIz9PupZYZWoXwtpCTy
    !request.failure &&
    <Box>
      <Flex flexWrap='wrap'>
        <Box width={1} pb={2}>
          <Pre>{request.request.method} {request.request.url}</Pre>
        </Box>
        <Box width={1}>
          <Heading h={5}><FormattedMessage id='Measurement.Details.Websites.HTTP.Label.Response' /></Heading>
        </Box>
        <Box width={1} mb={2}>
          <Pre>
            {JSON.stringify(request.response.headers, 0, 2)}
          </Pre>
        </Box>
        <Box width={1}>
          <HttpResponseBody request={request} />
        </Box>
      </Flex>
    </Box>
  )
}

const WebConnectivityDetails = ({ isConfirmed, isAnomaly, isFailure, country, measurement, render }) => {
  const {
    input,
    probe_asn,
    probe_cc,
    test_keys: {
      accessible,
      blocking,
      test_start_time,
      queries,
      tcp_connect,
      requests,
      client_resolver,
      http_experiment_failure,
      dns_experiment_failure,
      control_failure
    }
  } = measurement

  const { status, hint } = checkAnomaly(measurement.test_keys)

  const tcpConnections = tcp_connect.map((connection) => {
    const status = (connection.status.success) ? 'successful' :
      (connection.status.blocked) ? 'blocked' : 'failed'
    return {
      destination: connection.ip + ':' + connection.port,
      status
    }
  })
  return (
    <React.Fragment>
      {render({
        status: status ? 'anomaly' : 'reachable',
        statusInfo: <StatusInfo url={input} />,
        summaryText: () => {
          const date = moment(test_start_time).format('lll')
          if (accessible) {
            return (
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
          }
          if (blocking) {
            const reasons = {
              'http-diff': 'HTTP',
              'http-failure': 'HTTP',
              'dns': 'DNS',
              'tcp_ip': 'TCP'
            }
            return (
              <FormattedMessage
                id='Measurement.SummaryText.Websites.Anomaly'
                values={{
                  date: date,
                  WebsiteURL: input,
                  network: probe_asn,
                  country: country,
                  BlockingReason: <strong><FormattedMessage id={'Measurement.SummaryText.Websites.Anomaly.BlockingReason.' + reasons[blocking]} /></strong>
                }}
              />
            )
          }
          if (isConfirmed) {
            return (
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
          }
        },
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
              >
              </DetailsBox>
            </Flex>
            {/* DNS Queries */}
            <Flex>
              <DetailsBox
                title={<FormattedMessage id='Measurement.Details.Websites.DNSQueries.Heading' />}
                content={
                  <React.Fragment>
                    <Box width={1/3} mb={1}>
                      <FormattedMessage id='Measurement.Details.Websites.DNSQueries.Label.Resolver' />:
                    </Box>
                    <Box width={2/3}>
                      {client_resolver || '(unknown)'}
                    </Box>
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
                    {tcpConnections.length === 0 && <Text><FormattedMessage id='Measurement.Details.Websites.TCP.NoData' /></Text>}
                    {tcpConnections.map((connection, index) => (
                      <Flex key={index}>
                        <Box>
                          <Text>
                            <FormattedMessage
                              id='Measurement.Details.Websites.TCP.ConnectionTo'
                              defaultMessage='Connection to {destination} was {status, select, successful {succcessful} failed {failed} blocked {blocked}}.'
                              values={{
                                destination: <strong> {connection.destination} </strong>,
                                status: connection.status
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
  measurement: PropTypes.object.isRequired,
  render: PropTypes.func
}

export default WebConnectivityDetails
