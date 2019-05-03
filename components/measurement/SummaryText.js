import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link, Text } from 'ooni-components'

import { getTestMetadata } from '../utils'
import FormattedMarkdown from '../formatted-markdown'

const SummaryText = ({
  testName,
  network,
  country,
  date,
  content,
  testUrl
}) => {
  const metadata = getTestMetadata(testName)
  const formattedDate = moment(date).format('LL')
  const formattedDateTime = moment(date).format('lll')

  let textToRender = null
  if (typeof content === 'function') {
    textToRender = content()
  } else {
    textToRender =
      <FormattedMarkdown id='Measurement.Details.SummaryTextTemplate'
        values={{
          testName: <Link color='blue7' href={metadata.info}>{metadata.name}</Link>,
          network: network,
          country: country,
          date: <abbr title={formattedDateTime}>{formattedDate}</abbr>,
          content: content
        }}
      />
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
    PropTypes.elem,
    PropTypes.func
  ]),
  testUrl: PropTypes.string
}

export default SummaryText
