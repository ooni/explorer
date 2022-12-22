/* global process */
import React, { useState } from 'react'
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
  return (<Box fontSize={1}><FormattedMessage id='General.Loading' /></Box>)
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

const JsonViewer = ({ src, collapsed }) => (
  <StyledReactJsonContainer>
    <ReactJson collapsed={collapsed} src={src} name={null} indentWidth={2} />
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
    resolver_asn,
    resolver_ip,
    resolver_network_name,
  } = measurement ?? {}

  const { query } = useRouter()
  const queryString = new URLSearchParams(query)
  const rawMsmtDownloadURL = `${process.env.NEXT_PUBLIC_OONI_API}/api/v1/raw_measurement?${queryString}`
  const [collapsed, setCollapsed] = useState(1)

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
      value: engine
    }
  ]

  const showResolverItems = resolver_asn || resolver_ip || resolver_network_name
  const resolverItems = [
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Label.ResolverASN' }),
      value: resolver_asn ?? unavailable
    },
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Label.ResolverIP' }),
      value: resolver_ip ?? unavailable
    },
    {
      label: intl.formatMessage({ id: 'Measurement.CommonDetails.Label.ResolverNetworkName' }),
      value: resolver_network_name ?? unavailable
    },
  ]

  const expandAllBtn = (e) => {
    e.stopPropagation()
    setCollapsed(50)
  }

  return (
    <>
      {showResolverItems && 
        <Flex my={4}>
          {/* Resolver data */}
          <DetailsBoxTable
            title={<FormattedMessage id='Measurement.CommonDetails.Label.Resolver' />}
            items={resolverItems}
          />
        </Flex>
      }
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
            <Flex px={3} flexDirection={['column', 'row']} alignItems='center' bg={theme.colors.gray2}>
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
              <Box>
                <Button
                  onClick={(e) => {expandAllBtn(e)}}
                  fontSize={13}
                  mx={3}
                  px={4}
                >
                  {intl.formatMessage({ id: 'Measurement.CommonDetails.RawMeasurement.Expand' })}
                </Button>
              </Box>
            </Flex>
          }
          content={
            measurement && typeof measurement === 'object' ? (
              <Flex bg='WHITE' p={3} style={{direction: 'ltr'}}>
                <JsonViewer src={measurement} collapsed={collapsed} />
              </Flex>
            ) : (
              <FormattedMessage id='Measurement.CommonDetails.RawMeasurement.Unavailable' />
            )
          }
        />
      </Flex>
    </>
  )
}

CommonDetails.propTypes = {
  measurement: PropTypes.object,
  reportId: PropTypes.string
}

export default CommonDetails
