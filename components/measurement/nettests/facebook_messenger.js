import React from 'react'
import PropTypes from 'prop-types'
import {
  Text
} from 'ooni-components'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

export const FacebookMessengerDetails = ({ measurement, render, intl }) => {
  const testKeys = measurement.test_keys
  const isWorking = (
    testKeys.facebook_dns_blocking === false &&
    testKeys.facebook_tcp_blocking === false
  )
  const dnsBlocking = testKeys.facebook_dns_blocking === true
  const tcpBlocking = testKeys.facebook_tcp_blocking === true
  const isFailed = (
    testKeys.facebook_dns_blocking === null &&
    testKeys.facebook_tcp_blocking === null
  )
  // XXX consider extracting these keys too:
  /*
  "facebook_b_api_dns_consistent": true,
  "facebook_b_api_reachable": true,
  "facebook_b_graph_dns_consistent": true,
  "facebook_b_graph_reachable": true,
  "facebook_edge_dns_consistent": true,
  "facebook_edge_reachable": true,
  "facebook_external_cdn_dns_consistent": true,
  "facebook_external_cdn_reachable": true,
  "facebook_scontent_cdn_dns_consistent": true,
  "facebook_scontent_cdn_reachable": true,
  "facebook_star_dns_consistent": true,
  "facebook_star_reachable": true,
  "facebook_stun_dns_consistent": true,
  "facebook_stun_reachable": null,
  */

  let summaryText = '|'
  if (!isWorking) {
    if (tcpBlocking) {
      summaryText += intl.formatMessage({id: 'Measurement.Details.SummaryText.FacebookMessenger.TCPFailure'})
    } else {
      summaryText += intl.formatMessage({id: 'Measurement.Details.SummaryText.FacebookMessenger.TCPSuccess'})
    }

    if (dnsBlocking) {
      summaryText += intl.formatMessage({id: 'Measurement.Details.SummaryText.FacebookMessenger.DNSFailure'})
    } else {
      summaryText += intl.formatMessage({id: 'Measurement.Details.SummaryText.FacebookMessenger.DNSSuccess'})
    }
  } else {
    summaryText = 'Measurement.Details.SummaryText.FacebookMessenger.Reachable'
  }

  return (
    render({
      status: isWorking ? 'reachable' : 'anomaly',
      statusInfo: isWorking
        ? <FormattedMessage id='Measurement.Status.Hint.FacebookMessenger.Reachable' />
        : <FormattedMessage id='Measurement.Status.Hint.FacebookMessenger.Blocked' />,
      summaryText: summaryText,
      details: (
        <div>
          {/*<Text>dnsBlocking: {dnsBlocking.toString()}</Text>
            <Text>tcpBlocking: {tcpBlocking.toString()}</Text>
            <Text>isWorking: {isWorking.toString()}</Text>
          <Text>isFailed: {isFailed.toString()}</Text>*/}
        </div>
      )
    })
  )
}
FacebookMessengerDetails.propTypes = {
  measurement: PropTypes.object,
  render: PropTypes.func,
  intl: intlShape.isRequired
}

export default injectIntl(FacebookMessengerDetails)
