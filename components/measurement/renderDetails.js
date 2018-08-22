import React from 'react'
import {
  Container,
  Heading,
  Text,
  Flex,
  Box
} from 'ooni-components'

import styled from 'styled-components'

const Web = ({testKeys}) => (<div> Web - {testKeys.toString()}</div>)
const Other = () => (<div> Other </div>)

const mapTestDetails = {
  web_connectivity: Web,
  other: Other
}

const StatusBar = ({
  normal,
  message
}) => (
  <Box p={3} color='white' bg={normal ? 'green7' : 'yellow8'}>
    <Container>
      <Flex>
        <Box w={1/2}>
          {normal ? 'OK' : 'Anomaly'}
        </Box>
        <Box w={1/2}>
          {message}
        </Box>

      </Flex>
    </Container>
  </Box>
)

const renderDetails = (testName = 'other', testKeys) => {
  const TestDetails = mapTestDetails[testName]
  const {
    accessible,
    blocking,
    queries
  } = testKeys

  let anomaly = null

  if ((accessible === true || accessible === null) && blocking === null) {
    if (accessible === true) {
      anomaly = 'SITEUP'
    } else if (accessible === null) {
      anomaly = 'UNKNOWN'
    }
  } else if (accessible === false && (blocking === false || blocking === null)) {
    anomaly = 'SITEDOWN'
  } else if (blocking !== null && blocking !== false) {
    anomaly = 'CENSORSHIP'
    // Further identify type of censorship
    if (blocking === 'dns') {
      anomaly = 'DNS'
    } else if (blocking === 'http-diff') {
      anomaly = 'HTTPDIFF'
    } else if (blocking === 'http-failure') {
      anomaly = 'HTTPFAILURE'
    } else if (blocking === 'tcp-ip') {
      anomaly = 'TCPIP'
    }
  }

  return (
    <div>
      <StatusBar normal={true} message='DNS based blocking' />
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
