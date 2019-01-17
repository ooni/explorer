import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import DetailsBox from './DetailsBox'

const PerformanceDetails = ({
  averagePing,
  maxPing,
  mss,
  packetLoss,
  outOfOrder,
  timeouts,
  intl
}) => {
  const items = [
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Labels.AvgPing' }),
      value: averagePing.toString() + ' ms'
    },
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Labels.MaxPing' }),
      value: maxPing.toString() + ' ms'
    },
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Labels.MSS' }),
      value: mss.toString()
    },
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Labels.PktLoss' }),
      value: packetLoss.toString() + '%'
    },
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Labels.OutOfOrder' }),
      value: outOfOrder.toString() + '%'
    },
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Labels.Timeouts' }),
      value: timeouts.toString()
    }
  ]
  return (
    <DetailsBox
      title={intl.formatMessage({ id: 'Measurement.Details.Performance.Heading' })}
      items={items}
      bg='WHITE'
    />
  )
}

PerformanceDetails.propTypes = {
  averagePing: PropTypes.number.isRequired,
  maxPing: PropTypes.number.isRequired,
  mss: PropTypes.number.isRequired,
  packetLoss: PropTypes.number.isRequired,
  outOfOrder: PropTypes.number.isRequired,
  timeouts: PropTypes.number.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(PerformanceDetails)
