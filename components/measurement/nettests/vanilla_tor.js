import React from 'react'
import PropTypes from 'prop-types'
import {
  Text
} from 'ooni-components'

const VanillaTorDetails = ({ measurement, render }) => {
  const testKeys = measurement.test_keys
  const isOK = testKeys.success === true
  const isAnomaly = testKeys.success === false
  const torVersion = testKeys.tor_version
  const torLog = testKeys.tor_log
  const torProgress = testKeys.tor_progress
  const isFailure = testKeys.error !== null
  const failure = testKeys.failure

  return (
    render({
      status: isAnomaly ? 'anomaly' : 'reachable',
      details: (
        <div>
          {/*<Text>isOK: {'' + isOK}</Text>
          <Text>isFailure: {'' + isFailure}</Text>
          <Text>failure: {'' + failure}</Text>
          <Text>isAnomaly: {'' + isAnomaly}</Text>
          <Text>torVersion: {'' + torVersion}</Text>
          <Text>torLog: {'' + torLog}</Text>
          <Text>torProgress: {'' + torProgress}</Text>*/}
        </div>
      )}
    )
  )
}

VanillaTorDetails.propTypes = {
  testKeys: PropTypes.object
}

export default VanillaTorDetails
