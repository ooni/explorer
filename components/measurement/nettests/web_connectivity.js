import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Heading,
  Text,
  Flex,
  Box
} from 'ooni-components'

import { Tick, Cross } from 'ooni-components/dist/icons'

const StatusLabelOK = () => (
  <Flex align='center'>
    <Tick size={32} /><Text ml={1} f={2}>OK</Text>
  </Flex>
)

const StatusLabelAnomaly = () => (
  <Flex align='center'>
    <Cross size={32} /><Text ml={1} f={2}>Anomaly</Text>
  </Flex>
)


const StatusBar = ({
  anomaly,
  hint
}) => (
  <Box mb={4} p={3} color='white' bg={anomaly ? 'yellow8' : 'green7'}>
    <Container>
      <Flex>
        <Box w={1/2}>
          {anomaly ? <StatusLabelAnomaly /> : <StatusLabelOK />}
        </Box>
        <Box w={1/2}>
          <Text f={2}>Type: <strong>{hint}</strong></Text>
        </Box>
      </Flex>
    </Container>
  </Box>
)

StatusBar.propTypes = {
  anomaly: PropTypes.string.isRequired,
  hint: PropTypes.string.isRequired
}

const DetailsBox = ({ title, content }) => (
  <Box w={1/2}>
    <Heading h={4}>{title}</Heading>
    {content}
  </Box>
)

DetailsBox.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.element
}

const WebConnectivityDetails = ({ testKeys }) => {
  const {
    accessible,
    blocking,
    queries,
    tcp_connect
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

  const resolver = queries[0].resolver_hostname
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
      <StatusBar anomaly={anomaly} hint={hint} />
      <Container>
        <Flex>
          <DetailsBox title='DNS Query Answers' content={
            <React.Fragment>
              <Flex mb={2}>
                <Box w={1/3}>
                  <Text>Resolver:</Text>
                </Box>
                <Box w={2/3}>
                  <Text>{resolver || '(unknown)'}</Text>
                </Box>
              </Flex>
              <Flex mb={2}>
                <Box w={1/3}>
                  <Text>Answers:</Text>
                </Box>
                <Box w={2/3}>
                  {queries[0].answers.map((dnsAnswer, index) => {
                    if (dnsAnswer.answer_type === 'A') {
                      return <Text key={index}>{dnsAnswer.ipv4}</Text>
                    } else if (dnsAnswer.answer_type === 'CNAME') {
                      return <Text key={index}>{dnsAnswer.hostname}</Text>
                    }
                  })}
                </Box>
              </Flex>
            </React.Fragment>
          } />
          <DetailsBox title='TCP Connect Results' content={
            <React.Fragment>
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
      </Container>
    </div>
  )
}

WebConnectivityDetails.propTypes = {
  testKeys: PropTypes.object.isRequired
}

export default WebConnectivityDetails
