import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Text } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import { getTestMetadata } from '../utils'

const SummaryText = ({
  testName,
  network,
  country,
  date,
  content,
  testUrl,

}) => {
  const metadata = getTestMetadata(testName)
  const formattedDate = moment(date).format('LL')
  const formattedDateTime = moment(date).format('lll')

  let textToRender = null
  if (typeof content === 'function') {
    textToRender = content()
  } else {
    textToRender =
      <FormattedMessage id='Measurement.Details.SummaryTextTemplate'
        description='This is a multi-sentence paragraph with tokens.'
        values={{
          testName: <a href={metadata.info}>{metadata.name}</a>,
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
