import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Text } from 'ooni-components'

import { getTestMetadata } from '../utils'
import FormattedMarkdown from '../formatted-markdown'

const SummaryText = ({
  testName,
  network,
  country,
  date,
  content,
}) => {
  const metadata = getTestMetadata(testName)
  const formattedDate = moment(date).format('LL')
  const formattedDateTime = moment(date).format('lll')

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
  return (
    <Text py={4} fontSize={3}>
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
