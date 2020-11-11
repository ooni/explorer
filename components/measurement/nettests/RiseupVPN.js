import PropTypes from 'prop-types'

const RiseupVPNDetails = ({ measurement, render }) => {
  // TODO(bassosimone,cyberta): possibly refine the algorithm
  const testKeys = measurement.test_keys
  const caCertStatus = testKeys.ca_cert_status || false
  const apiStatus = testKeys.api_status || 'blocked'
  const failingGateways = testKeys.failing_gateways || []
  const good = (
    caCertStatus == true && apiStatus == 'ok' &&
    failingGateways.length <= 0
  )
  const status = good ? 'reachable' : 'anomaly'
  return (
    render({
      status
    })
  )
}

RiseupVPNDetails.propTypes = {
  render: PropTypes.func
}

export default RiseupVPNDetails
