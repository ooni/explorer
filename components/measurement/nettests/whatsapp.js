import React from 'react'
import PropTypes from 'prop-types'
import {
  Text
} from 'ooni-components'

const WhatsAppDetails = ({ measurement, render }) => {
  const testKeys = measurement.test_keys
  const registrationServerBlocked = testKeys.registration_server_status === 'blocked'
  const webBlocked = testKeys.whatsapp_web_status === 'blocked'
  const endpointsBlocked = testKeys.whatsapp_endpoints_status === 'blocked'

  const possibleCensorship = (
    testKeys.whatsapp_endpoints_status === 'blocked' ||
    testKeys.whatsapp_web_status === 'blocked' ||
    testKeys.facebook_tcp_blocking === true ||
    testKeys.registration_server_status === 'blocked')

  const working = (
    testKeys.registration_server_status === 'ok' &&
    testKeys.whatsapp_web_status === 'ok' &&
    testKeys.registration_server_status === 'ok'
  )

  const isFailed = (working === false && possibleCensorship === false)
  let status = 'reachable', info = 'WhatsApp is reachable'
  if (possibleCensorship || !working) {
    status = 'anomaly'
    info = possibleCensorship
      ? 'WhatsApp presented signs of possible censorship'
      : 'WhatsApp is not working'
  }

  return render({
    status: status,
    statusInfo: info,
    summaryText: info,
    details: (
      <div>
        {/*<Text>possibleCensorship: {possibleCensorship.toString()}</Text>
        <Text>working: {working.toString()}</Text>
        <Text>isFailed: {isFailed.toString()}</Text>
        <Text>
      working: {working.toString()}
        </Text>
        <Text>
      registrationServerBlocked: {registrationServerBlocked.toString()}
        </Text>
        <Text>
      webBlocked: {webBlocked.toString()}
        </Text>
        <Text>
      endpointsBlocked: {endpointsBlocked.toString()}
        </Text>*/}
      </div>
    )
  })
}

WhatsAppDetails.propTypes = {
  testKeys: PropTypes.object.isRequired
}

export default WhatsAppDetails
