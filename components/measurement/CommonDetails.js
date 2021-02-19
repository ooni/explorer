/* global process */
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
import dynamic from 'next/dynamic'
import { FormattedMessage, useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { DetailsBoxTable, DetailsBox } from './DetailsBox'

const LoadingRawData = (props) => {
  console.log(props)
  return (<Box fontSize={1}>Loading</Box>)
}

const ReactJson = dynamic(
  () => import('react-json-view'),
  { ssr: false, loading: LoadingRawData }

)

const StyledReactJsonContainer = styled.div`
  .string-value {
    text-overflow: ellipsis;
    max-width: 800px;
    overflow: hidden;
    display: inline-block;
  }
`

const JsonViewer = ({ src }) => (
  <StyledReactJsonContainer>
    <ReactJson collapsed={1} src={src} />
  </StyledReactJsonContainer>
)

JsonViewer.propTypes = {
  src: PropTypes.object.isRequired
}

const CommonDetails = ({
  measurement,
  reportId
}) => {
  const {
    software_name,
    software_version,
    annotations,
  } = measurement ?? {}

  const { query } = useRouter()
  const queryString = new URLSearchParams(query)
  const rawMsmtDownloadURL = `${process.env.MEASUREMENTS_URL}/api/v1/raw_measurement?${queryString}`

  const intl = useIntl()
  const unavailable = intl.formatMessage({ id: 'Measurement.CommonDetails.Value.Unavailable' })

  let engine = unavailable
  let platform = unavailable

  if (annotations && annotations.engine_name) {
    engine = annotations.engine_name

    if (annotations.engine_version) {
      engine = `${engine} (${annotations.engine_version})`
    }
  }

  if (annotations && annotations.platform) {
    platform = annotations.platform
  }

  let software = software_name ?? unavailable
  software += software_version ? ` (${software_version})` : ''

  const downloadFilename = `ooni-measurement-${reportId}.json`
  const items = [
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Label.MsmtID' }),
      value: reportId ?? unavailable
    },
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Label.Platform' }),
      value: platform
    },
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Label.Software' }),
      value: software
    },
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Label.Engine' }),
      value: engine ?? intl.formatMessage({ id: 'Measurement.CommonDetails.Value.Unavailable' })
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
      <Flex>
        <DetailsBox
          collapsed={false}
          title={
            <Flex px={3} alignItems='center' bg={theme.colors.gray2}>
              <Box>
                <Heading h={4}>{intl.formatMessage({ id: 'Measurement.CommonDetails.RawMeasurement.Heading' })}</Heading>
              </Box>
              <Box >
                <Link color='blue7' href={rawMsmtDownloadURL} download={downloadFilename}>
                  <Button
                    onClick={(e) => e.stopPropagation()}
                    fontSize={13}
                    mx={3}
                    px={3}
                  >
                    {intl.formatMessage({ id: 'Measurement.CommonDetails.RawMeasurement.Download' })}
                  </Button>
                </Link>
              </Box>
            </Flex>
          }
          content={
            measurement && typeof measurement === 'object' ? (
              <Flex bg='WHITE' p={3}>
                <JsonViewer src={measurement} />
              </Flex>
            ) : (
              <FormattedMessage id='Measurement.CommonDetails.RawMeasurement.Unavailable' />
            )
          }
        />
      </Flex>
    </React.Fragment>
  )
}

CommonDetails.propTypes = {
  measurement: PropTypes.object,
  reportId: PropTypes.string
}

export default CommonDetails
