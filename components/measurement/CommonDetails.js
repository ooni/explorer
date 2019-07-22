/* global require */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Heading,
  Button,
  Flex,
  Box,
  Link,
  theme
} from 'ooni-components'

import NoSSR from 'react-no-ssr'
import { injectIntl, intlShape } from 'react-intl'

import { DetailsBoxTable, DetailsBox } from './DetailsBox'

// We wrap the json viewer so that we can render it only in client side rendering
class JsonViewer extends React.Component {
  render() {
    const ReactJson = require('react-json-view').default
    const {
      src
    } = this.props
    const StyledReactJsonContainer = styled.div`
      .string-value {
        text-overflow: ellipsis;
        max-width: 800px;
        overflow: hidden;
        display: inline-block;
      }
    `
    return (
      <StyledReactJsonContainer>
        <ReactJson collapsed={1} src={src} />
      </StyledReactJsonContainer>
    )
  }
}

JsonViewer.propTypes = {
  src: PropTypes.object.isRequired
}

const CommonDetails = ({
  measurement,
  measurementURL,
  intl
}) => {
  const {
    report_id,
    software_version,
    annotations,
  } = measurement

  let engine_version = 'none',
    platform = 'unknown'

  if (annotations && annotations.engine_version) {
    engine_version = annotations.engine_version
  }
  if (annotations && annotations.platform) {
    platform = annotations.platform
  }

  const downloadFilename = `ooni-measurement-${report_id}.json`
  const items = [
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Label.MsmtID' }),
      value: report_id
    },
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Label.Platform' }),
      value: platform ? platform : 'unknown'
    },
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Label.SoftwareVersion' }),
      value: software_version
    },
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Label.MKVersion' }),
      value: engine_version
    }
  ]
  return (
    <React.Fragment>
      <Flex my={4}>
        {/* Metadata: platform, probe, MK version etc. */}
        <DetailsBoxTable
          items={items}
          bg={theme.colors.gray2}
        />
      </Flex>
      {/* Raw Measurement */}
      <Box>
        <DetailsBox
          collapsed={true}
          title={
            <Flex px={3} alignItems='center' bg={theme.colors.gray2}>
              <Box>
                <Heading h={4}>{intl.formatMessage({ id: 'Measurement.CommonDetails.RawMeasurement.Heading' })}</Heading>
              </Box>
              <Box >
                <Link color='blue7' href={measurementURL} download={downloadFilename}>
                  <Button
                    fontSize={13}
                    mx={3}
                    px={3}>{intl.formatMessage({ id: 'Measurement.CommonDetails.RawMeasurement.Download' })}</Button>
                </Link>
              </Box>
            </Flex>
          }
          content={
            <Flex bg='WHITE' p={3}>
              <NoSSR>
                <JsonViewer src={measurement} />
              </NoSSR>
            </Flex>
          }
        />
      </Box>
    </React.Fragment>
  )
}

CommonDetails.propTypes = {
  measurement: PropTypes.object.isRequired,
  measurementURL: PropTypes.string.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(CommonDetails)
