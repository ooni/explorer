import React from 'react'
import PropTypes from 'prop-types'
import {
  Flex,
  Box,
} from 'ooni-components'
import { Text } from 'rebass'
import MdFlashOn from 'react-icons/lib/md/flash-on'

import { mlabServerToCountry, mlabServerToName } from './mlab_utils.js'
import PerformanceDetails from '../PerformanceDetails'

const InfoBoxItem = ({
  label,
  content,
  unit
}) => (
  <Box>
    <Text fontSize={24}>
      {content} <Text is='small'>{unit}</Text>
    </Text>
    <Text fontWeight='bold' fontSize={16} >
      {label}
    </Text>
  </Box>
)


const NdtDetails = ({ measurement, render }) => {
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


  // XXX this doesn't actually work as expected see: #mlab channel
  const serverCountry = testKeys.server_address && mlabServerToCountry(testKeys.server_address)
  const serverName = testKeys.server_address && mlabServerToName(testKeys.server_address)

  // Advanced
  const packetLoss = advanced.packet_loss && (advanced.packet_loss * 100).toFixed(3)
  const outOfOrder = advanced.out_of_order && (advanced.out_of_order * 100).toFixed(1)
  const minRTT = advanced.min_rtt && (advanced.min_rtt).toFixed(0)
  const maxRTT = advanced.max_rtt && (advanced.max_rtt).toFixed(0)
  const mss = advanced.mss
  const timeouts = advanced.timeouts

  return (
    render({
      statusIcon: <MdFlashOn />,
      statusLabel: 'Results',
      statusInfo: (
        <Box width={1}>
          <Flex justifyContent='space-around'>
            <InfoBoxItem label='Download' content={downloadMbit} unit='Mbps' />
            <InfoBoxItem label='Upload' content={uploadMbit} unit='Mbps' />
            <InfoBoxItem label='Ping' content={ping} unit='ms' />
          </Flex>
        </Box>
      ),
      details: (
        <div>
          <PerformanceDetails
            averagePing={ping}
            maxPing={maxRTT}
            mss={mss}
            packetLoss={packetLoss}
            outOfOrder={outOfOrder}
            timeouts={timeouts}
          />
          <Text>isFailed: {'' + isFailed}</Text>
          <Text>failure: {failure}</Text>
          <Text>downloadMbit: {'' + downloadMbit}</Text>
          <Text>uploadMbit: {'' + uploadMbit}</Text>
          <Text>ping: {'' + ping}</Text>

          <Text>serverCountry: {'' + serverCountry}</Text>
          <Text>serverName: {'' + serverName}</Text>
          <Text>packetLoss: {'' + packetLoss}</Text>
          <Text>outOfOrder: {'' + outOfOrder}</Text>
          <Text>minRTT: {'' + minRTT}</Text>
          <Text>maxRTT: {'' + maxRTT}</Text>
          <Text>mss: {'' + mss}</Text>
          <Text>timeouts: {'' + timeouts}</Text>
        </div>
      )
    })
  )
}

NdtDetails.propTypes = {
  testKeys: PropTypes.object
}

export default NdtDetails
