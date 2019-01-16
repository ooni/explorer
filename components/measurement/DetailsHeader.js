import React from 'react'
import PropTypes from 'prop-types'
import prettyMs from 'pretty-ms'
import { Flex, Box } from 'ooni-components'
// FIXME: Include 'fontWeight' to ooni-components/atoms/Text
// Using Text from rebass directly for now
import { Text } from 'rebass'
import { injectIntl, intlShape } from 'react-intl'

import { getTestMetadata } from '../utils'
import Badge from '../badge'

const TestGroupBadge = ({icon, name, color}) => (
  <Badge bg={color} color='color'>
    {icon} {name}
  </Badge>
)

TestGroupBadge.propTypes = {
  icon: PropTypes.element,
  name: PropTypes.string,
  color: PropTypes.string
}

const DetailsHeader = ({testName, runtime, notice, intl}) => {
  const metadata = getTestMetadata(testName)

  return (
    <Flex py={4} alignItems='center'>
      <Box>
        <TestGroupBadge
          icon={metadata.icon}
          name={intl.formatMessage({ id: `Tests.Groups.${metadata.groupName}.Name` })}

          color={metadata.color}
        />
      </Box>
      <Box ml={1}>
        <Text fontWeight='bold'>{intl.formatMessage({ id: `Tests.${metadata.name}.Name`})}</Text>
      </Box>
      <Box mx='auto'>
        {notice}
      </Box>
      <Box>
        {intl.formatMessage({id: 'Measurement.DetailsHeader.Runtime'})}: <Text is='span' fontWeight='bold'>{prettyMs(runtime * 1000)}</Text>
      </Box>
    </Flex>
  )
}

DetailsHeader.propTypes = {
  testName: PropTypes.string.isRequired,
  runtime: PropTypes.number.isRequired,
  notice: PropTypes.any,
  intl: intlShape.isRequired
}

export default injectIntl(DetailsHeader)
