import React from 'react'
import PropTypes from 'prop-types'
import {
  Text
} from 'ooni-components'

const HttpInvalidRequestLineDetails = ({ measurement, render }) => {
  const testKeys = measurement.test_keys
  const isAnomaly = testKeys.tampering === true
  const isOK = testKeys.tampering === false
  const isFailed = testKeys.tampering === null

  const sentMessages = testKeys.sent
  const receivedMessages = testKeys.received

  return (
    render({
      status: isAnomaly ? 'anomaly' : 'reachable',
      details: (
        <div>
          <Text>isAnomaly: {isAnomaly.toString()}</Text>
          <Text>isOK: {isOK.toString()}</Text>
          <Text>isFailed: {isFailed.toString()}</Text>
          <Text>sentMessages: {sentMessages.toString()}</Text>
          <Text>receivedMessages: {receivedMessages.toString()}</Text>
        </div>
      )}
    )
  )
}

HttpInvalidRequestLineDetails.propTypes = {
  testKeys: PropTypes.object
}

export default HttpInvalidRequestLineDetails
