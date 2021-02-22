import React from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { getTestMetadata } from '../utils'

const HeadMetadata = ({
  testName,
  network,
  country,
  date,
  content
}) => {
  const intl = useIntl()
  let description = ''

  const formattedDate = moment.utc(date).format('LL')
  if (content.formatted) {
    description = content.message
  } else {
    const metadata = getTestMetadata(testName)
    description = intl.formatMessage(
      content.message,
      {
        testName: metadata.name,
        country: country,
        date: formattedDate
      }
    )
  }

  return (
    <Head>
      <title>
        {description}
      </title>
      <meta
        key="og:description"
        property="og:description"
        content={`OONI data suggests ${description} on ${formattedDate}, find more open data on internet censorship on OONI Explorer`}
      />
      <meta
        name="description"
        content={`OONI data suggests ${description} on ${formattedDate}, find more open data on internet censorship on OONI Explorer`}
      />
    </Head>
  )
}

HeadMetadata.propTypes = {
  content: PropTypes.shape({
    message: PropTypes.string.isRequired,
    formatted: PropTypes.bool.isRequired
  })
}

export default HeadMetadata
