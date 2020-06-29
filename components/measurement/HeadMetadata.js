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
  
  if (content.formatted) {
    description = content.message
  } else {
    const formattedDate = moment(date).format('LL')
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
      <meta
        key="og:description"
        property="og:description"
        content={description}
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
