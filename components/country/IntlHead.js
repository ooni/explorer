import React from 'react'
import Head from 'next/head'
import { useIntl } from 'react-intl'

const IntlHead = ({
  countryName,
  measurementCount,
  networkCount
}) => {
  const intl = useIntl()
  return (
    <Head>
      <title>Internet Censorship in {countryName} - OONI Explorer</title>
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
    </Head>
  )
}

export default IntlHead
