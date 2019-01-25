import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

const DefaultTestDetails = ({ measurement, render }) => (
  render({
    statusLabel: <FormattedMessage id='Measurement.Default.Status.Header' />,
  })
)

DefaultTestDetails.propTypes = {
  measurement: PropTypes.object,
  render: PropTypes.func
}

export default DefaultTestDetails
