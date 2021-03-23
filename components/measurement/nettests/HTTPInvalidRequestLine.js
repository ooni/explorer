import React from 'react'
import PropTypes from 'prop-types'
import {
  Text
} from 'ooni-components'
import { FormattedMessage, defineMessages } from 'react-intl'

const HttpInvalidRequestLineDetails = ({ measurement, render }) => {
  const testKeys = measurement.test_keys
  const isAnomaly = testKeys.tampering === true
  const isOK = testKeys.tampering === false
  const isFailed = testKeys.tampering === null

  const sentMessages = testKeys.sent
  const receivedMessages = testKeys.received

  const messages = defineMessages({
    middleboxes: {
      id: 'Measurement.Metadata.HTTPInvalidReqLine.Middleboxes',
      defaultMessage: 'Network traffic manipulation was detected in {country}'
    },
    noMiddleboxes: {
      id: 'Measurement.Metadata.HTTPInvalidReqLine.NoMiddleboxes',
      defaultMessage: 'Network traffic manipulation was not detected in {country}'
    }
  })

  return (
    render({
      status: isAnomaly ? 'anomaly' : 'reachable',
      statusLabel: isAnomaly
        ? <FormattedMessage id='Measurement.Hero.Status.HTTPInvalidReqLine.MiddleboxesDetected' />
        : <FormattedMessage id='Measurement.Hero.Status.HTTPInvalidReqLine.NoMiddleBoxes' />,
      summaryText: isAnomaly
        ? 'Measurement.HTTPInvalidReqLine.MiddleboxesDetected.SummaryText'
        : 'Measurement.HTTPInvalidReqLine.NoMiddleBoxes.SummaryText',
      headMetadata: {
        message: isAnomaly ? messages.middleboxes : messages.noMiddleboxes,
        formatted: false
      },
      details: (
        <div>
          {/*<Text>isAnomaly: {isAnomaly.toString()}</Text>
            <Text>isOK: {isOK.toString()}</Text>
          <Text>isFailed: {isFailed.toString()}</Text>
          <Text>sentMessages: {sentMessages.toString()}</Text>
          <Text>receivedMessages: {receivedMessages.toString()}</Text>*/}
        </div>
      )}
    )
  )
}

HttpInvalidRequestLineDetails.propTypes = {
  testKeys: PropTypes.object
}

export default HttpInvalidRequestLineDetails
