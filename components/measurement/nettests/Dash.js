import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'ooni-components'
import { Text } from 'rebass'
import { useIntl } from 'react-intl'
import MdFlashOn from 'react-icons/lib/md/flash-on'

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

/*
 * This table is derived from:
 * https://support.google.com/youtube/answer/1722171?hl=en-GB
 */
const minimumBitrateForVideo = [
  {
    'sfr_min_bitrate': 600,
    'hfr_min_bitrate': 1000,
    'type': '240p'
  },
  {
    'sfr_min_bitrate': 1000,
    'hfr_min_bitrate': 1500,
    'type': '360p'
  },
  {
    'sfr_min_bitrate': 2500,
    'hfr_min_bitrate': 4000,
    'type': '480p'
  },
  {
    'sfr_min_bitrate': 5000,
    'hfr_min_bitrate': 7500,
    'type': '720p (HD)'
  },
  {
    'sfr_min_bitrate': 8000,
    'hfr_min_bitrate': 12000,
    'type': '1080p (full HD)'
  },
  {
    'sfr_min_bitrate': 16000,
    'hfr_min_bitrate': 24000,
    'type': '1440p (2k)'
  },
  {
    'sfr_min_bitrate': 35000,
    'hfr_min_bitrate': 53000,
    'type': '2160p (4k)'
  }
]

const getOptimalQualityForBitrate = (testKeys) => {
  let optimalQuality = minimumBitrateForVideo[0]
  minimumBitrateForVideo.forEach((rate) => {
    // Note: we use SFR rather than HFR because SFR is more common
    if (testKeys.simple.median_bitrate >= rate['sfr_min_bitrate']) {
      optimalQuality = rate
    }
  })
  return optimalQuality
}

const DashDetails = ({ measurement, render }) => {
  const intl = useIntl()
  const testKeys = measurement.test_keys
  const failure = testKeys.failure

  if (failure === true || typeof testKeys.simple === 'undefined' || typeof testKeys.receiver_data === 'undefined') {
    return render({
      status: 'error'
    })
  }

  const optimalVideoRate = getOptimalQualityForBitrate(testKeys).type
  const medianBitrate = (testKeys.simple.median_bitrate / 1000).toFixed(2)
  const playoutDelay = (testKeys.simple.min_playout_delay).toFixed(2)

  return (
    render({
      statusIcon: <MdFlashOn />,
      statusLabel: intl.formatMessage({ id: 'Measurement.Hero.Status.Dash.Title' }),
      statusInfo: (
        <Box width={1}>
          <Flex justifyContent='space-around'>
            <InfoBoxItem
              label={intl.formatMessage({ id: 'Measurement.Status.Info.Label.VideoQuality' })}
              content={optimalVideoRate}
            />
            <InfoBoxItem
              label={intl.formatMessage({ id: 'Measurement.Status.Info.Label.Bitrate' })}
              content={medianBitrate} unit='Mbit/s'
            />
            <InfoBoxItem
              label={intl.formatMessage({ id: 'Measurement.Status.Info.Label.Delay' })}
              content={playoutDelay} unit='s'
            />
          </Flex>
        </Box>
      ),
      details: null
    })
  )
}

DashDetails.propTypes = {
  testKeys: PropTypes.object.isRequired
}

export default DashDetails
