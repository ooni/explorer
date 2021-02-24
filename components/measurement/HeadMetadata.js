import React from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { getTestMetadata } from '../utils'

const HeadMetadata = ({
  testName,
  // network,
  country,
  date,
  content
}) => {
  const intl = useIntl()
  let description = ''

  const formattedDate = intl.formatDate(date, {
    timeZone: 'UTC',
    timeZoneName: 'short',
    day: 'numeric', month: 'long', year: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric'
  })

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

  const metaDescription = `OONI data suggests ${description} on ${formattedDate}, find more open data on internet censorship on OONI Explorer.`

  return (
    <Head>
      <title>
        {description}
      </title>
      <meta
        key="og:description"
        property="og:description"
        content={metaDescription}
      />
      <meta
        name="description"
        content={metaDescription}
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
