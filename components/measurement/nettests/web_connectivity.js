import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Heading,
  Flex,
  Pre,
  Box
} from 'ooni-components'

import { Text } from 'rebass'

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

const DetailsBox = ({ title, content, ...props }) => (
  <Box width={1/2} {...props}>
    <Heading h={4}>{title}</Heading>
    {content}
  </Box>
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
    <Flex flexWrap='wrap' bg='gray2' p={2}>
      <Box width={1} pb={2}>
        <Flex justifyContent='space-between' pr={4}>
          <Box>
            <Pre>{hostname}</Pre>
          </Box>
          <Box>
            <Pre>IN</Pre>
          </Box>
          <Box>
            <Pre>{query_type}</Pre>
          </Box>
          <Box>
            engine: {engine}
          </Box>
        </Flex>
      </Box>
      {failure && <Box width={1}><FailureString failure={failure} /></Box>}
      <Box width={1}>
        <Flex flexWrap='wrap'>
          {answers.map((dnsAnswer, index) => {
            if (dnsAnswer.answer_type === 'A') {
              return <Box width={1} pb={2} key={index}><Text>{dnsAnswer.ipv4}</Text></Box>
            } else if (dnsAnswer.answer_type === 'CNAME') {
              return <Box width={1} pb={2} key={index}><Text>{dnsAnswer.hostname}</Text></Box>
            }
          })}
        </Flex>
      </Box>
    </Flex>
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
          <Heading h={5}><FormattedMessage id='Measurement.Details.Websites.HTTP.Labels.Response' /></Heading>
        </Box>
        <Box width={1}>
          <Pre>
            {JSON.stringify(request.response.headers, 0, 2)}
          </Pre>
        </Box>
        <Box width={1}>
          <HttpResponseBodyContainer>
            {request.response.body}
          </HttpResponseBodyContainer>
        </Box>
      </Flex>
    </Box>
  )
}

const WebConnectivityDetails = ({ measurement, render }) => {
  const {
    input,
    test_keys: {
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
        statusInfo: <StatusInfo url={input} message={hint} />,
        summaryText: hint,
        details: (
          <Container>
            <Heading h={4}><FormattedMessage id='Measurement.Details.Websites.Failures.Heading' /></Heading>
            <Flex mb={2} flexWrap='wrap'>
              <Box width={1/3}>
                <FormattedMessage id='Measurement.Details.Websites.Failures.Labels.HTTP' />
              </Box>
              <Box width={2/3}>
                <FailureString failure={http_experiment_failure} />
              </Box>
              <Box width={1/3}>
                <FormattedMessage id='Measurement.Details.Websites.Failures.Labels.DNS' />
              </Box>
              <Box width={2/3}>
                <FailureString failure={dns_experiment_failure} />
              </Box>
              <Box width={1/3}>
                <FormattedMessage id='Measurement.Details.Websites.Failures.Labels.Control' />
              </Box>
              <Box width={2/3}>
                <FailureString failure={control_failure} />
              </Box>
            </Flex>

            <Flex>
              <DetailsBox pr={2} title={<FormattedMessage id='Measurement.Details.Websites.DNSQueries.Heading' />} content={
                <React.Fragment>
                  <Flex mb={2}>
                    <Box width={1/3}>
                      <Text><FormattedMessage id='Measurement.Details.Websites.DNSQueries.Labels.Resolver' />:</Text>
                    </Box>
                    <Box width={2/3}>
                      <Text>{client_resolver || '(unknown)'}</Text>
                    </Box>
                  </Flex>
                  {queries.map((query, index) => <QueryContainer key={index} query={query} />)}
                </React.Fragment>
              } />
              <DetailsBox pl={2} title={<FormattedMessage id='Measurement.Details.Websites.TCP.Heading' />} content={
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
              <Box width={1}>
                <Heading h={4}><FormattedMessage id='Measurement.Details.Websites.HTTP.Heading' /></Heading>
                {requests.map((request, index) => <RequestResponseContainer key={index} request={request} />)}
              </Box>
            </Flex>
          </Container>
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
