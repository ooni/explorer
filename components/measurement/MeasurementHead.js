import React from 'react'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import { testNames } from '../test-info'

// SummaryText contains another more detailed Head component which overwrites
// this
const MeasurementHead = ({
  testName,
  testDateTime,
  country
}) => {
  const intl = useIntl()
  const formattedTestName = intl.formatMessage({ id: `${testNames[testName].id}` })

  return (
    <Head>
      <title>{`OONI ${formattedTestName} Results`}</title>
      <meta
        key="og:title"
        property="og:title"
        content={`OONI ${formattedTestName} Results`}
      />
      <meta
        key="og:description"
        property="og:description"
        content={intl.formatMessage(
          {
            id: 'Measurement.Metadata.Description',
            defaultMessage:
            'View results of {testName} in {countryName} on {date}. Check out OONI Explorer for more details and measurements'
          },
          {
            testName: formattedTestName,
            countryName: country,
            date: intl.formatDate(testDateTime)
          }
        )}
      />
    </Head>
  )
}

export default MeasurementHead
