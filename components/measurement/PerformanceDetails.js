import React from 'react'
import PropTypes from 'prop-types'
import DetailsBox from './DetailsBox'

const PerformanceDetails = ({
  averagePing,
  maxPing,
  mss,
  packetLoss,
  outOfOrder,
  timeouts
}) => {
  const items = [
    {
      label: 'Average Ping',
      value: averagePing.toString() + ' ms'
    },
    {
      label: 'Max Ping',
      value: maxPing.toString() + ' ms'
    },
    {
      label: 'MSS',
      value: mss.toString()
    },
    {
      label: 'Packet Loss',
      value: packetLoss.toString() + '%'
    },
    {
      label: 'Out of Order',
      value: outOfOrder.toString() + '%'
    },
    {
      label: 'Timeouts',
      value: timeouts.toString()
    }
  ]
  return (
    <DetailsBox
      title='Performance Details'
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
  timeouts: PropTypes.number.isRequired
}

export default PerformanceDetails
