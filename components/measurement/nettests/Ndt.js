import PropTypes from 'prop-types'
import { MdFlashOn } from 'react-icons/md'
import { defineMessages, useIntl } from 'react-intl'
import { InfoBoxItem } from '../InfoBoxItem'
import PerformanceDetails from '../PerformanceDetails'
import { mlabServerDetails } from './mlab_utils'

const ServerLocation = ({ serverAddress = '', isNdt7 }) => {
  const server = mlabServerDetails(serverAddress, isNdt7)

  return <>{server ? `${server.city}, ${server.countryName}` : 'N/A'}</>
}

// NdtDetails is implemented differently for Ndt4/5 and for Ndt7 hence
// the use of isNdt7. See https://github.com/ooni/explorer/issues/452
const NdtDetails = ({ measurement, render }) => {
  const intl = useIntl()
  const testKeys = measurement.test_keys

  const isFailed = testKeys.failure !== null
  const isNdt7 = testKeys.protocol === 7

  let packetLoss
  let minRTT
  let maxRTT
  let mss
  let outOfOrder
  let timeouts

  const simple = (isNdt7 ? testKeys.summary : testKeys.simple) || {}

  // XXX we probably want to use a utility function to convert to other units,
  // ex. use kbit/s if the speed is low and gbit/s if it's high
  const downloadMbit = simple.download && (simple.download / 1000).toFixed(2)
  const uploadMbit = simple.upload && (simple.upload / 1000).toFixed(2)
  const ping = simple.ping?.toFixed(1)

  let performanceDetails = null
  if (!isFailed) {
    try {
      if (isNdt7) {
        const summary = testKeys.summary || {}
        // Summary
        packetLoss =
          summary.retransmit_rate && (summary.retransmit_rate * 100).toFixed(3)
        minRTT = summary.min_rtt?.toFixed(0)
        maxRTT = summary.max_rtt?.toFixed(0)
        mss = summary.mss
        outOfOrder = null
        timeouts = null
      } else {
        const advanced = testKeys.advanced || null
        // Advanced
        advanced.out_of_order = undefined
        packetLoss =
          advanced.packet_loss && (advanced.packet_loss * 100).toFixed(3)
        outOfOrder =
          advanced.out_of_order && (advanced.out_of_order * 100).toFixed(1)
        minRTT = advanced.min_rtt?.toFixed(0)
        maxRTT = advanced.max_rtt?.toFixed(0)
        mss = advanced?.mss
        timeouts = advanced?.timeouts
      }
      performanceDetails = (
        <PerformanceDetails
          isNdt7={isNdt7}
          averagePing={ping}
          maxPing={maxRTT}
          mss={mss}
          packetLoss={packetLoss}
          outOfOrder={outOfOrder}
          timeouts={timeouts}
        />
      )
    } catch (e) {
      console.error(`Error in parsing test_keys for ${measurement.test_name}`)
      console.error(e)
      // Leaves performanceDetails `null` and thus isn't rendered
    }
  }

  const messages = defineMessages({
    Ndt: {
      id: 'Measurement.Metadata.Ndt',
      defaultMessage: 'Speed test result (NDT Test) in {country}',
    },
  })

  return render({
    statusIcon: <MdFlashOn />,
    statusLabel: intl.formatMessage({
      id: 'Measurement.Hero.Status.NDT.Title',
    }),
    headMetadata: {
      message: messages.Ndt,
      formatted: false,
    },
    statusInfo: (
      <div className="w-full">
        {isFailed ? (
          <div className="flex justify-around">
            <h4>Failed Test</h4>
          </div>
        ) : (
          <div className="flex justify-around">
            <InfoBoxItem
              label={intl.formatMessage({
                id: 'Measurement.Status.Info.Label.Download',
              })}
              content={downloadMbit}
              unit="Mbps"
            />
            <InfoBoxItem
              label={intl.formatMessage({
                id: 'Measurement.Status.Info.Label.Upload',
              })}
              content={uploadMbit}
              unit="Mbps"
            />
            <InfoBoxItem
              label={intl.formatMessage({
                id: 'Measurement.Status.Info.Label.Ping',
              })}
              content={ping}
              unit="ms"
            />
            <InfoBoxItem
              label={intl.formatMessage({
                id: 'Measurement.Status.Info.Label.Server',
              })}
              content={
                <ServerLocation
                  serverAddress={
                    isNdt7 ? testKeys.server.hostname : testKeys.server_address
                  }
                  isNdt7={isNdt7}
                />
              }
            />
          </div>
        )}
      </div>
    ),
    details: <>{!isFailed && performanceDetails}</>,
  })
}

NdtDetails.propTypes = {
  testKeys: PropTypes.object,
}

export default NdtDetails
