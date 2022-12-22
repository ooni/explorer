import React from 'react'
import Head from 'next/head'
import { useIntl } from 'react-intl'

const CountryHead = ({
  countryName,
  measurementCount,
  networkCount
}) => {
  const intl = useIntl()
  return (
    <Head>
      <title>{intl.formatMessage({ id: 'Country.Meta.Title'}, { countryName })}</title>
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

    </Head>
  )
}

export default CountryHead
