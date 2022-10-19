import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Text } from 'ooni-components'
import dayjs from 'services/dayjs'

import { getTestMetadata } from '../utils'
import FormattedMarkdown from '../FormattedMarkdown'
import { useIntl } from 'react-intl'

const SummaryText = ({
  testName,
  network,
  country,
  date,
  content,
}) => {
  const { locale } = useIntl()
  const metadata = getTestMetadata(testName)
  const formattedDateTime = dayjs(date).locale(locale).utc().format('MMMM DD, YYYY, hh:mm A [UTC]')

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
          date: formattedDateTime
        }}
      />
  } else {
    textToRender = content
  }
  return (
    <Flex>
      <Text py={4} fontSize={20}>
        {textToRender}
      </Text>
    </Flex>
  )
}

SummaryText.propTypes = {
  testName: PropTypes.string.isRequired,
  network: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  country: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.func
  ])
}

export default SummaryText
