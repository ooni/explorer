import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

const DefaultTestDetails = ({
  isConfirmed,
  isAnomaly,
  isFailure,
  render
}) => {
  const status = isConfirmed ? (
    'confirmed'
  ) : (
    isAnomaly ? (
      'anomaly'
    ) : (
      isFailure ? (
        'error'
      ) : 'reachable'
    )
  )
  return (
    render({
      status
    })
  )
}

DefaultTestDetails.propTypes = {
  render: PropTypes.func
}

export default DefaultTestDetails
