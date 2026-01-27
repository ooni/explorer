import { defineMessages, useIntl } from 'react-intl'

export const HttpHeaderFieldManipulationDetails = ({ measurement, render }) => {
  const intl = useIntl()
  const testKeys = measurement.test_keys
  let isAnomaly = false
  let isFailed = true
  const tampering = testKeys?.tampering || {}
  for (const key of Object.keys(tampering)) {
    if (tampering[key] === true) {
      isAnomaly = true
    }
    if (tampering[key] !== null) {
      isFailed = false
    }
  }

  const messages = defineMessages({
    middleboxes: {
      id: 'Measurement.Metadata.HTTPHeaderManipulation.MiddleboxesDetected',
      defaultMessage: 'HTTP header manipulation was detected in {country}',
    },
    noMiddleboxes: {
      id: 'Measurement.Metadata.HTTPHeaderManipulation.NoMiddleboxesDetected',
      defaultMessage: 'HTTP header manipulation was not detected in {country}',
    },
  })

  return render({
    status: isAnomaly ? 'anomaly' : 'reachable',
    statusLabel: isAnomaly
      ? intl.formatMessage({
          id: 'Measurement.Hero.Status.HTTPHeaderManipulation.MiddleboxesDetected',
        })
      : intl.formatMessage({
          id: 'Measurement.Hero.Status.HTTPHeaderManipulation.NoMiddleBoxes',
        }),
    summaryText: isAnomaly
      ? 'Measurement.HTTPHeaderManipulation.MiddleBoxesDetected.SummaryText'
      : 'Measurement.HTTPHeaderManipulation.NoMiddleBoxes.SummaryText',
    headMetadata: {
      message: isAnomaly ? messages.middleboxes : messages.noMiddleboxes,
      formatted: false,
    },
  })
}

export default HttpHeaderFieldManipulationDetails
