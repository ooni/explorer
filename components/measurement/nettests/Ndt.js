import React from 'react'
import PropTypes from 'prop-types'
import {
  Flex,
  Box,
} from 'ooni-components'
import { Text } from 'rebass'
import { MdFlashOn } from 'react-icons/lib/md'
import { injectIntl, intlShape } from 'react-intl'

import { mlabServerDetails } from './mlab_utils'
import PerformanceDetails from '../PerformanceDetails'

const InfoBoxItem = ({
  label,
  content,
  unit
}) => (
  <Box>
    <Text fontSize={24}>
      {content} {unit && <Text is='small'>{unit}</Text>}
    </Text>
    <Text fontWeight='bold' fontSize={16} >
      {label}
    </Text>
  </Box>
)

const ServerLocation = ({ serverAddress }) => {
  const server = mlabServerDetails(serverAddress)

  return (
    <React.Fragment> {
      server
        ? `${server.city}, ${server.countryName}`
        : 'N/A'
    } </React.Fragment>
  )
}


const NdtDetails = ({ measurement, render, intl }) => {
  const testKeys = measurement.test_keys
  const isFailed = testKeys.failure !== null
  const failure = testKeys.failure

  const simple = testKeys.simple || {}
  const advanced = testKeys.advanced || {}

  // XXX we probably want to use a utility function to convert to other units,
  // ex. use kbit/s if the speed is low and gbit/s if it's high
  const downloadMbit = simple.download && (simple.download / 1000).toFixed(2)
  const uploadMbit = simple.upload && (simple.upload / 1000).toFixed(2)
  const ping = simple.ping && (simple.ping).toFixed(1)

  // Advanced
  const packetLoss = advanced.packet_loss && (advanced.packet_loss * 100).toFixed(3)
  const outOfOrder = advanced.out_of_order && (advanced.out_of_order * 100).toFixed(1)
  const minRTT = advanced.min_rtt && (advanced.min_rtt).toFixed(0)
  const maxRTT = advanced.max_rtt && (advanced.max_rtt).toFixed(0)
  const mss = advanced.mss
  const timeouts = advanced.timeouts

  // FIXME we need to style the failed test case properly
  return (
    render({
      statusIcon: <MdFlashOn />,
      statusLabel: intl.formatMessage({id: 'Measurement.Hero.Status.NDT.Title'}),
      statusInfo: (
        <Box width={1}>
          {isFailed ?
            <Flex justifyContent='space-around'>
              <h4>Failed Test</h4>
            </Flex>
            :
            <Flex justifyContent='space-around'>
              <InfoBoxItem label={intl.formatMessage({ id: 'Measurement.Status.Info.Label.Download' })} content={downloadMbit} unit='Mbps' />
              <InfoBoxItem label={intl.formatMessage({ id: 'Measurement.Status.Info.Label.Upload' })} content={uploadMbit} unit='Mbps' />
              <InfoBoxItem label={intl.formatMessage({ id: 'Measurement.Status.Info.Label.Ping' })} content={ping} unit='ms' />
              <InfoBoxItem label={intl.formatMessage({ id: 'Measurement.Status.Info.Label.Server' })} content={<ServerLocation serverAddress={testKeys.server_address} />} />
            </Flex>
          }
        </Box>
      ),
      details: (
        <div> {!isFailed &&
          <PerformanceDetails
            averagePing={ping}
            maxPing={maxRTT}
            mss={mss}
            packetLoss={packetLoss}
            outOfOrder={outOfOrder}
            timeouts={timeouts}
          />}
        </div>
      )
    })
  )
}

NdtDetails.propTypes = {
  testKeys: PropTypes.object,
  intl: intlShape.isRequired
}

export default injectIntl(NdtDetails)
