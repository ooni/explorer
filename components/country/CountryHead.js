import React from 'react'
import Head from 'next/head'
import { useIntl } from 'react-intl'

const CountryHead = ({
  countryCode,
  countryName,
  measurementCount,
  networkCount
}) => {
  const intl = useIntl()
  const origin = typeof window === 'undefined'
    ? 'https://explorer.ooni.org'
    : window.location.origin

  return (
    <Head>
      <title>Internet Censorship in {countryName} | OONI Explorer</title>
      <meta
        key="og:title"
        property="og:title"
        content={intl.formatMessage({
          id: 'Country.Meta.Title',
        },{
          countryName
        })}
      />
      <meta
        key="og:description"
        property="og:description"
        content={intl.formatMessage({
          id: 'Country.Meta.Description',
        },{
          measurementCount: intl.formatNumber(measurementCount),
          countryName,
          networkCount: intl.formatNumber(networkCount)
        })}
      />
      <meta
        name="description"
        content={intl.formatMessage({
          id: 'Country.Meta.Description',
        },{
          measurementCount: intl.formatNumber(measurementCount),
          countryName,
          networkCount: intl.formatNumber(networkCount)
        })}
      />
      <meta
        key="og:image"
        property="og:image"
        content={`${origin}/screenshot/country/${countryCode}`}
      />
    </Head>
  )
}

export default CountryHead
