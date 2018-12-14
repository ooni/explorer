import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Heading,
  Text,
  Flex,
  Pre,
  Box
} from 'ooni-components'

import { Tick, Cross } from 'ooni-components/dist/icons'

import styled from 'styled-components'

export const checkAnomaly = ( testKeys ) => {
  const {
    accessible,
    blocking,
  } = testKeys

  let anomaly = null
  let hint = 'No Censorship Detected'

  if ((accessible === true || accessible === null) && blocking === null) {
    hint = 'Error In Measurement'
    if (accessible === true) {
      anomaly = 'SITEUP'
    } else if (accessible === null) {
      anomaly = 'UNKNOWN'
    }
  } else if (accessible === false && (blocking === false || blocking === null)) {
    anomaly = 'SITEDOWN'
    hint = 'Site Unavailable'
  } else if (blocking !== null && blocking !== false) {
    anomaly = 'CENSORSHIP'
    hint = 'Evidence of Possible Censorship'
    // Further identify type of censorship
    if (blocking === 'dns') {
      anomaly = 'DNS'
      hint = 'DNS Based Blocking'
    } else if (blocking === 'http-diff') {
      anomaly = 'HTTPDIFF'
      hint = 'Different HTTP Response'
    } else if (blocking === 'http-failure') {
      anomaly = 'HTTPFAILURE'
      hint = 'HTTP Reqeust Failed'
    } else if (blocking === 'tcp-ip') {
      anomaly = 'TCPIP'
      hint = 'TCP/IP Based Blocking'
    }
  }

  return anomaly
}

const DetailsBox = ({ title, content }) => (
  <Box width={1/2}>
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
        <Tick size={20} /> null
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
        <Flex justify='space-between' pr={4}>
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
    <Box>
      <Flex flexWrap='wrap'>
        <Box width={1} pb={2}>
          <Pre>{request.request.method} {request.request.url}</Pre>
        </Box>
        <Box width={1}>
          <Heading h={5}>Response</Heading>
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
const WebConnectivityDetails = ({ testKeys }) => {
  const {
    queries,
    tcp_connect,
    requests,
    client_resolver,
    http_experiment_failure,
    dns_experiment_failure,
    control_failure
  } = testKeys

  const tcpConnections = tcp_connect.map((connection) => {
    const status = (connection.status.success) ? 'successful' :
      (connection.status.blocked) ? 'blocked' : 'failed'
    return {
      destination: connection.ip + ':' + connection.port,
      status
    }
  })
  return (
    <div>
      <Container>
        <Heading h={4}>Failures</Heading>
        <Flex mb={2} flexWrap='wrap'>
          <Box width={1/3}>
          HTTP Experiment
          </Box>
          <Box width={2/3}>
            <FailureString failure={http_experiment_failure} />
          </Box>
          <Box width={1/3}>
          DNS Experiment
          </Box>
          <Box width={2/3}>
            <FailureString failure={dns_experiment_failure} />
          </Box>
          <Box width={1/3}>
          Control
          </Box>
          <Box width={2/3}>
            <FailureString failure={control_failure} />
          </Box>
        </Flex>

        <Flex>
          <DetailsBox title='DNS Queries' content={
            <React.Fragment>
              <Flex mb={2}>
                <Box width={1/3}>
                  <Text>Resolver:</Text>
                </Box>
                <Box width={2/3}>
                  <Text>{client_resolver || '(unknown)'}</Text>
                </Box>
              </Flex>
              {queries.map((query, index) => <QueryContainer key={index} query={query} />)}
            </React.Fragment>
          } />
          <DetailsBox title='TCP Connections' content={
            <React.Fragment>
              {tcpConnections.length === 0 && <Text>No results</Text>}
              {tcpConnections.map((connection, index) => (
                <Flex key={index}>
                  <Box>
                    <Text>Connection to <strong>{connection.destination}</strong> was {connection.status}.</Text>
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
            <Heading h={4}>HTTP Requests</Heading>
            {requests.map((request, index) => <RequestResponseContainer key={index} request={request} />)}
          </Box>
        </Flex>
      </Container>
    </div>
  )
}

WebConnectivityDetails.propTypes = {
  testKeys: PropTypes.object.isRequired
}

export default WebConnectivityDetails
