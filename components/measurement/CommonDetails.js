/* global require */
import React from 'react'
import PropTypes from 'prop-types'

import {
  Heading,
  Button,
  Flex,
  Box,
  theme
} from 'ooni-components'

import NoSSR from 'react-no-ssr'
import styled from 'styled-components'
import jsFileDownload from 'js-file-download'

import DetailsBox from './DetailsBox'

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

const CommonDetails = ({
  measurement
}) => {
  const {
    report_id,
    software_version,
    annotations: {
      engine_version,
      platform
    }
  } = measurement

  const items = [
    {
      label: 'Measurement ID',
      value: report_id
    },
    {
      label: 'Platform',
      value: platform ? platform : 'unknown'
    },
    {
      label: 'Software Version',
      value: software_version
    }
  ]
  if(engine_version) {
    items.push({
      label: 'Measurement Kit Version',
      value: engine_version
    })
  }
  return (
    <React.Fragment>
      <Flex my={4}>
        <DetailsBox
          title='Other Details'
          items={items}
          bg={theme.colors.gray2}
        />
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
