import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { DetailsBoxTable } from './DetailsBox'

const PerformanceDetails = ({
  isNdt7,
  averagePing,
  maxPing,
  mss,
  packetLoss,
  outOfOrder,
  timeouts,
}) => {
  const intl = useIntl()
  const items = []
  averagePing &&
    items.push({
      label: intl.formatMessage({
        id: 'Measurement.Details.Performance.Label.AvgPing',
      }),
      value: `${averagePing} ms`,
    })
  maxPing &&
    items.push({
      label: intl.formatMessage({
        id: 'Measurement.Details.Performance.Label.MaxPing',
      }),
      value: `${isNdt7 ? '~' : ''}${maxPing} ms`,
    })
  mss &&
    items.push({
      label: intl.formatMessage({
        id: 'Measurement.Details.Performance.Label.MSS',
      }),
      value: `${mss}`,
    })

  packetLoss !== undefined &&
    items.push({
      label: isNdt7
        ? intl.formatMessage({
            id: 'Measurement.Details.Performance.Label.RetransmitRate',
          })
        : intl.formatMessage({
            id: 'Measurement.Details.Performance.Label.PktLoss',
          }),
      value: `${packetLoss}%`,
    })

  //Only add outOfOrder and timeouts if NDT4/5 measurement
  if (!isNdt7) {
    outOfOrder !== undefined &&
      items.push({
        label: intl.formatMessage({
          id: 'Measurement.Details.Performance.Label.OutOfOrder',
        }),
        value: `${outOfOrder.toString()}%`,
      })
    timeouts !== undefined &&
      items.push({
        label: intl.formatMessage({
          id: 'Measurement.Details.Performance.Label.Timeouts',
        }),
        value: timeouts.toString(),
      })
  }

  return (
    <DetailsBoxTable
      title={intl.formatMessage({
        id: 'Measurement.Details.Performance.Heading',
      })}
      items={items}
      className="bg-white"
    />
  )
}

PerformanceDetails.propTypes = {
  isNdt7: PropTypes.bool.isRequired,
  averagePing: PropTypes.number.isRequired,
  maxPing: PropTypes.number.isRequired,
  mss: PropTypes.number.isRequired,
  packetLoss: PropTypes.number.isRequired,
  outOfOrder: PropTypes.number.isRequired,
  timeouts: PropTypes.number.isRequired,
}

export default PerformanceDetails
