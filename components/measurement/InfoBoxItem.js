import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

export const InfoBoxItem = ({
  label,
  content,
  unit
}) => (
  <Box>
    <Text fontSize={24}>
      {content} {unit && <Text as='small'>{unit}</Text>}
    </Text>
    <Text fontWeight='bold' fontSize={16} >
      {label}
    </Text>
  </Box>
)

InfoBoxItem.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(FormattedMessage)
  ]),
  content: PropTypes.any,
  unit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(FormattedMessage)
  ])
}
