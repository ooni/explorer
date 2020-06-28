import React from 'react'
import PropTypes from 'prop-types'
import {
  Text
} from 'ooni-components'
import { FormattedMessage, defineMessages } from 'react-intl'

export const HttpHeaderFieldManipulationDetails = ({ measurement, render }) => {
  const testKeys = measurement.test_keys
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

  const messages = defineMessages({
    middleboxes: {
      id: 'Measurement.Metadata.HTTPHeaderManipulation.MiddleboxesDetected',
      defaultMessage:  'On {date}, HTTP header manipulation was detected in {country}, explore more details and other measurements on OONI Explorer.'
    },
    noMiddleboxes: {
      id: 'Measurement.Metadata.HTTPHeaderManipulation.NoMiddleboxesDetected',
      defaultMessage:  'On {date}, NO HTTP header manipulation was detected in {country}, explore more details and other measurements on OONI Explorer.'
    }
  })

  return (
    render({
      status: isAnomaly ? 'anomaly' : 'reachable',
      statusLabel: isAnomaly
      ? <FormattedMessage id='Measurement.Hero.Status.HTTPHeaderManipulation.MiddleboxesDetected' />
      : <FormattedMessage id='Measurement.Hero.Status.HTTPHeaderManipulation.NoMiddleBoxes' />,
      summaryText: isAnomaly
      ? 'Measurement.HTTPHeaderManipulation.MiddleBoxesDetected.SummaryText'
      : 'Measurement.HTTPHeaderManipulation.NoMiddleBoxes.SummaryText',
      headMetadata: {
        message: isAnomaly ? messages.middleboxes : messages.noMiddleboxes,
        formatted: false
      },
      details: (
        <div>
          {/*<Text>isAnomaly: {isAnomaly.toString()}</Text>
          <Text>isFailed: {isFailed.toString()}</Text>
          <Text>headerDiff: {headerDiff.toString()}</Text>*/}
        </div>
      )
    })
  )
}

HttpHeaderFieldManipulationDetails.propTypes = {
  testKeys: PropTypes.object
}

export default HttpHeaderFieldManipulationDetails
