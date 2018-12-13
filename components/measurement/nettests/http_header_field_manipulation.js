import React from 'react'
import PropTypes from 'prop-types'
import {
  Text
} from 'ooni-components'

export const HttpHeaderFieldManipulationDetails = ({ testKeys }) => {
  let isAnomaly = false
  let isFailed = true
  const tampering = testKeys.tampering
  Object.keys(tampering).forEach((key) => {
    if (tampering[key] === true) {
      isAnomaly = true
    }
    if (tampering[key] !== null) {
      isFailed = false
    }
  })
  const headerDiff = testKeys.tampering.header_name_diff

  return <div>
    <Text>isAnomaly: {isAnomaly.toString()}</Text>
    <Text>isFailed: {isFailed.toString()}</Text>
    <Text>headerDiff: {headerDiff.toString()}</Text>
  </div>
}

HttpHeaderFieldManipulationDetails.propTypes = {
  testKeys: PropTypes.object
}

export default HttpHeaderFieldManipulationDetails
