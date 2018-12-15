/* global require */
import React from 'react'
import PropTypes from 'prop-types'

import {
  Heading,
  Button,
  Flex,
  Box,
  Text,
  theme
} from 'ooni-components'

import NoSSR from 'react-no-ssr'
import styled from 'styled-components'
import jsFileDownload from 'js-file-download'

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

const DetailBoxLabel = styled(Text)`
  font-weight: 600;
`

const CommonDetails = ({
  measurement
}) => {
  const {
    report_id,
    software_name,
    software_version,
    annotations: {
      engine_version,
      platform
    }
  } = measurement
  return (
    <React.Fragment>
      <Flex my={4}>
        <Box width={1} bg={theme.colors.gray2}>
          <Box p={3}>
            <Heading h={4}>Other Details</Heading>
            <Flex mb={1}>
              <Box width={1/4}>
                <DetailBoxLabel>Measurement ID</DetailBoxLabel>
              </Box>
              <Box>
                <Text>{report_id}</Text>
              </Box>
            </Flex>
            <Flex mb={1}>
              <Box width={1/4}>
                <DetailBoxLabel>Platform</DetailBoxLabel>
              </Box>
              <Box width={3/4}>
                <Text bold>{platform ? platform : 'unknown'}</Text>
              </Box>
            </Flex>
            <Flex mb={1}>
              <Box width={1/4}>
                <DetailBoxLabel>Software Version</DetailBoxLabel>
              </Box>
              <Box>
                <Text bold>{software_version}</Text>
              </Box>
            </Flex>
            {engine_version &&
            <Flex mb={1}>
              <Box width={1/4}>
                <DetailBoxLabel>Measurement Kit Version</DetailBoxLabel>
              </Box>
              <Box>
                <Text bold>{engine_version}</Text>
              </Box>
            </Flex>}
          </Box>
        </Box>
      </Flex>
      <Box>
        <Flex px={3} alignItems='center' bg={theme.colors.gray2}>
          <Box>
            <Heading h={4}>Raw Measurement Data</Heading>
          </Box>
          <Box >
            <Button
              onClick={() => (
                jsFileDownload(
                  JSON.stringify(measurement, null, 2),
                  'ooni-measurement-' + report_id + '.json')
              )}
              fontSize={11}
              mx={3}
              px={3}>Download JSON</Button>
          </Box>
        </Flex>
        <Flex bg='WHITE' p={3}>
          <NoSSR>
            <JsonViewer src={measurement} />
          </NoSSR>
        </Flex>
      </Box>
    </React.Fragment>
  )
}

CommonDetails.propTypes = {
  measurement: PropTypes.object.isRequired
}

export default CommonDetails
