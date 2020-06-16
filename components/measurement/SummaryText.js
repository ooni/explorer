import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { Link, Text } from 'ooni-components'
import Head from 'next/head'

import { getTestMetadata } from '../utils'
import FormattedMarkdown from '../FormattedMarkdown'

const SummaryText = ({
  testName,
  network,
  country,
  date,
  content,
}) => {
  const intl = useIntl()
  const metadata = getTestMetadata(testName)
  const formattedDate = moment(date).format('LL')
  const formattedDateTime = intl.formatDate(moment.utc(date).toDate(), {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: 'numeric',
    timeZone: 'UTC',
    timeZoneName: 'short'
  })

  let textToRender = null
  let headDescription = null
  if (content.formatted === true) {
    textToRender = content.message
    headDescription = content.message
  } else {
    textToRender =
      <FormattedMarkdown id={content.message}
        values={{
          testName: `[${metadata.name}](${metadata.info})`,
          network: network,
          country: country,
          date: `<abbr title='${formattedDateTime}'>${formattedDate}</abbr>`
        }}
      />
      headDescription = intl.formatMessage(
        {
          id: content.message
        },
        {
          testName: `[${metadata.name}](${metadata.info})`,
          network: network,
          country: country,
          date: formattedDate
        }
      )
  }
  headDescription = headDescription.substring(0, headDescription.indexOf('\n'))
  headDescription += intl.formatMessage({
    id: 'SummaryText.HeadDescription.MoreDetails',
    defaultMessage: 'Check out OONI Explorer for more details and measurements'
  })

  return (
    <>
      <Head>
        <meta
          key="og:description"
          property="og:description"
          content={headDescription}
        />
      </Head>
      <Text py={4} fontSize={20}>
        {textToRender}
      </Text>
    </>
  )
}

SummaryText.propTypes = {
  testName: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.shape({
    message: PropTypes.string.isRequired,
    formatted: PropTypes.bool.isRequired
  })
}

export default SummaryText
