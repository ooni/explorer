import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { Link, Text } from 'ooni-components'

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
  if (typeof content === 'function') {
    textToRender = content()
  } else if (typeof content === 'string') {
    textToRender =
      <FormattedMarkdown id={content}
        values={{
          testName: `[${metadata.name}](${metadata.info})`,
          network: network,
          country: country,
          date: `<abbr title='${formattedDateTime}'>${formattedDate}</abbr>`
        }}
      />
  } else {
    textToRender = content
  }
  console.log(textToRender)
  return (
    <Text py={4} fontSize={20}>
      {textToRender}
    </Text>
  )
}

SummaryText.propTypes = {
  testName: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.any,
    PropTypes.func
  ])
}

export default SummaryText
