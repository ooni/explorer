import PropTypes from 'prop-types'
import { useIntl, defineMessages } from 'react-intl'


const messages = defineMessages({
  metaReachable: {
    id: 'Measurement.Metadata.RiseupVPN.Reachable',
    defaultMessage: 'Riseup VPN was reachable in {country}'
  },
  metaBlocked: {
    id: 'Measurement.Metadata.RiseupVPN.Blocked',
    defaultMessage: 'Riseup VPN was NOT reachable in {country}'
  }
})

const RiseupVPNDetails = ({ measurement, render }) => {
  const intl = useIntl()
  // TODO(bassosimone,cyberta): possibly refine the algorithm
  const testKeys = measurement.test_keys
  const caCertStatus = testKeys.ca_cert_status || false
  const apiStatus = testKeys.api_status || 'blocked'
  const failingGateways = testKeys.failing_gateways || []
  const good = (
    caCertStatus == true && apiStatus == 'ok' &&
    failingGateways.length <= 0
  )
  let status, statusInfo, summaryText, metaText

  if (good) {
    status = 'reachable'
    statusInfo = intl.formatMessage({ id: 'Measurement.Status.Hint.RiseupVPN.Reachable' })
    summaryText = 'Measurement.Details.SummaryText.RiseupVPN.OK'
    metaText = messages.metaReachable
  } else {
    status = 'anomaly'
    statusInfo = intl.formatMessage({ id: 'Measurement.Status.Hint.RiseupVPN.Blocked' })
    summaryText = 'Measurement.Details.SummaryText.RiseupVPN.Blocked'
    metaText = messages.metaBlocked
  }
  return (
    render({
      status,
      statusInfo,
      summaryText,
      headMetadata: {
        message: metaText,
        formatted: false
      }
    })
  )
}

RiseupVPNDetails.propTypes = {
  render: PropTypes.func
}

export default RiseupVPNDetails
