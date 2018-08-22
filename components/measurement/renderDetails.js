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

import styled from 'styled-components'

const Web = ({testKeys}) => (<div> Web - {testKeys.toString()}</div>)
const Other = () => (<div> Other </div>)

const mapTestDetails = {
  web_connectivity: Web,
  other: Other
}

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

const renderDetails = (testName = 'other', testKeys) => {
  const TestDetails = mapTestDetails[testName]
  const {
    accessible,
    blocking,
    queries
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

  return (
    <div>
      <StatusBar anomaly={anomaly} hint={hint} />
      <Container>
        <Flex>
          <Box w={1/2}>
            <Heading h={4}>DNS Query Answers</Heading>
            <Flex>
              <Box w={1/4}>
                <Text>Resolver:</Text>
              </Box>
              <Box w={1/4}>
                <Text>8.8.8.8</Text>
              </Box>
            </Flex>
            <Flex align='center'>
              <Box w={1/4}>
                <Text>Answers:</Text>
              </Box>
              <Box w={1/4}>
                <Text>{queries.length}</Text>
              </Box>
            </Flex>
          </Box>
          <Box w={1/2} ml='auto'>
            <Heading h={4}>TCP Connect Results</Heading>

            <Flex>
              <Box>
                <Text>Connection to <strong>31.32.33.34:80</strong> was successful.</Text>
              </Box>
            </Flex>
            <Flex>
              <Box>
                <Text>Connection to <strong>star-mini.c10r.facebook.com:80</strong> was successful.</Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </div>
  )
}

export default renderDetails
