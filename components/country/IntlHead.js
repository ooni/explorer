import React from 'react'
import Head from 'next/head'
import { useIntl } from 'react-intl'

const IntlHead = ({
  countryCode,
  countryName,
  measurementCount,
  measuredSince,
  networkCount
}) => {
  const intl = useIntl()
  const origin =
    typeof window === 'undefined'
    ? 'https://explorer.ooni.com'
    : window.location.origin
  return (
    <Head>
      <title>Internet Censorship in {countryName} - OONI Explorer</title>
      <meta
        key="og:title"
        property="og:title"
        content={intl.formatMessage(
          {
            id: 'Country.Overview.MetaTitle',
            defaultMessage: 'Internet Censorship in {countryName} - OONI Explorer'
          },
          {
            countryName
          }
        )}
      />
      <meta
        key="og:description"
        property="og:description"
        content={intl.formatMessage(
          {
            id: 'Country.Overview.MetaDescription',
            defaultMessage:
            'Since {startDate}, OONI Probe users in {countryName} have collected {measurementCount} measurements from {networkCount} local networks. Explore the data on OONI Explorer'
          },
          {
            measurementCount: intl.formatNumber(measurementCount),
            countryName,
            startDate: intl.formatDate(measuredSince),
            networkCount: intl.formatNumber(networkCount)
          }
        )}
      />
      <meta
        key="og:image"
        property="og:image"
        content={`${origin}/screenshot/country/${countryCode}`}
      />
    </Head>
  )
}

export default IntlHead
