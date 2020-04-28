import React from 'react'
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
  timeouts
}) => {
  const intl = useIntl()
  const items = [
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Label.AvgPing' }),
      value: averagePing.toString() + ' ms'
    },
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Label.MaxPing' }),
      value: isNdt7 ? `~${maxPing.toString()} ms` : `${maxPing.toString()}ms`
    },
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Label.MSS' }),
      value: mss.toString()
    },
    {
      label: isNdt7 ? intl.formatMessage({
          id: 'Measurement.Details.Performance.Label.RetransmitRate',
          defaultMessage: 'RetransmitRate'
      }): intl.formatMessage({ id: 'Measurement.Details.Performance.Label.PktLoss' }),
      value: packetLoss.toString() + '%'
    },
    ...(isNdt7 ? [] : //only adds outOfOrder and  timeouts if isNdt7 is false
      [{
          label: intl.formatMessage({ id: 'Measurement.Details.Performance.Label.OutOfOrder' }),
        value: outOfOrder.toString() + '%'
      },
      {
        label: intl.formatMessage({ id: 'Measurement.Details.Performance.Label.Timeouts' }),
        value: timeouts.toString()
      }]
    )
  ]
  return (
    <DetailsBoxTable
      title={intl.formatMessage({ id: 'Measurement.Details.Performance.Heading' })}
      items={items}
      bg='WHITE'
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
  timeouts: PropTypes.number.isRequired
}

export default PerformanceDetails
