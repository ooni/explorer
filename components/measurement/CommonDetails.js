/* global require */
import React from 'react'
import PropTypes from 'prop-types'

import {
  Container,
  Heading,
  Border,
  Button,
  Flex,
  Box,
  Text,
  theme
} from 'ooni-components'

import MdFileDownload from 'react-icons/lib/md/file-download'
import NoSSR from 'react-no-ssr'

// We wrap the json viewer so that we can render it only in client side rendering
class JsonViewer extends React.Component {
  render() {
    const ReactJson = require('react-json-view').default
    const {
      src
    } = this.props
    return (
      <ReactJson src={src} />
    )
  }
}

JsonViewer.propTypes = {
  src: PropTypes.object.isRequired
}

const softwareNames = {
  'ooniprobe-ios': {
    software: 'OONI Probe',
    platform: 'iOS'
  },
  'ooniprobe-android': {
    software: 'OONI Probe',
    platform: 'Android'
  }
}

const CommonDetails = ({
  measurement
}) => {
  const {
    software_name,
    software_version,
    annotations: {
      engine_version
    }
  } = measurement
  return (
    <Container>
      <Flex my={4}>
        <Box w={1/2} bg='WHITE'>
          <Border border={1} borderColor={theme.colors.gray3}>
            <Box p={3}>
              <Heading h={4}>Probe Metadata</Heading>
              <Flex mb={1}>
                <Box w={1/2}>
                  Software
                </Box>
                <Box w={1/2}>
                  <Text bold>{softwareNames[software_name].software}</Text>
                </Box>
              </Flex>
              <Flex mb={1}>
                <Box w={1/2}>
                  Platform
                </Box>
                <Box w={1/2}>
                  <Text bold>{softwareNames[software_name].platform}</Text>
                </Box>
              </Flex>
              <Flex mb={1}>
                <Box w={1/2}>
                  Software Version
                </Box>
                <Box w={1/2}>
                  <Text bold>{software_version}</Text>
                </Box>
              </Flex>
              {engine_version &&
              <Flex mb={1}>
                <Box w={1/2}>
                  Measurement Kit Version
                </Box>
                <Box w={1/2}>
                  <Text bold>{engine_version}</Text>
                </Box>
              </Flex>}
            </Box>
          </Border>
        </Box>
      </Flex>
      <Box>
        <Flex px={3} align='center' bg='gray1'>
          <Box>
            <Heading h={4}>Raw Measurement Data</Heading>
          </Box>
          <Box >
            <Button fontSize={11} mx={3} px={3}><MdFileDownload />{' '}JSON</Button>
          </Box>
        </Flex>
        <Flex bg='WHITE' p={3}>
          <NoSSR>
            <JsonViewer src={measurement} />
          </NoSSR>
        </Flex>
      </Box>
    </Container>
  )
}

CommonDetails.propTypes = {
  measurement: PropTypes.string.isRequired
}

export default CommonDetails
