import React from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { DetailsBoxTable } from './DetailsBox'

const PerformanceDetails = ({
  averagePing,
  maxPing,
  mss,
  packetLoss,
}) => {
  const intl = useIntl()
  const items = [
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Label.AvgPing' }),
      value: averagePing.toString() + ' ms'
    },
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Label.MaxPing' }),
      value: '~' + maxPing.toString() + ' ms'
    },
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Label.MSS' }),
      value: mss.toString()
    },
    {
      label: intl.formatMessage({ id: 'Measurement.Details.Performance.Label.PktLoss' }),
      value: packetLoss.toString() + '%'
    },
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
  averagePing: PropTypes.number.isRequired,
  maxPing: PropTypes.number.isRequired,
  mss: PropTypes.number.isRequired,
  packetLoss: PropTypes.number.isRequired,
}

export default PerformanceDetails
