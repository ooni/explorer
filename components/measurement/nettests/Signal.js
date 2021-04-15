import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, useIntl } from 'react-intl'

const messages = defineMessages({
  'blockingReason.dns_nxdomain_error': {
    id: 'Measurement.SummaryText.Signal.Anomaly.BlockingReason.dns_nxdomain_error',
    defaultMessage: 'DNS Tampering'
  },
  metaReachable: {
    id: 'Measurement.Metadata.Telegram.Reachable',
    defaultMessage: 'Signal was reachable in {country}'
  },
  metaBlocked: {
    id: 'Measurement.Metadata.Telegram.Blocked',
    defaultMessage: 'Signal was NOT reachable in {country}'
  }
})

const SignalDetails = ({ measurement, render }) => {
  const intl = useIntl()
  const testKeys = measurement.test_keys
  const {
    signal_backend_status,
    signal_backend_failure,
  } = testKeys
  const anomaly = signal_backend_status === 'blocked'
  const blockingReason = signal_backend_failure

  let hint = intl.formatMessage({ id: 'Measurement.Status.Hint.Signal.Reachable' })
  let summaryText = 'Measurement.Details.SummaryText.Signal.Reachable'
  let headMetadata = messages.metaReachable

  if (anomaly) {
    hint = intl.formatMessage({ id: 'Measurement.Status.Hint.Signal.Blocked' })
    summaryText = 'Measurement.Details.SummaryText.Signal.Blocked'
    headMetadata = messages.metaBlocked
  }

  return (
    render({
      status: anomaly ? 'anomaly' : 'reachable',
      statusInfo: hint,
      summaryText: summaryText,
      headMetadata: {
        message: headMetadata,
        formatted: false
      }
    })
  )
}

SignalDetails.propTypes = {
  measurement: PropTypes.object.isRequired,
  render: PropTypes.func
}

export default SignalDetails
