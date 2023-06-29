import { Box, Flex, Text, theme } from 'ooni-components'
import PropTypes from 'prop-types'
import { cloneElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { getTestMetadata } from './utils'

// XXX replace what is inside of search/results-list.StyledResultTag
const Badge = styled(Box)`
  display: inline-block;
  border-radius: 4px;
  padding: 4px 8px;
  line-height: 16px;
  font-size: 12px;
  text-transform: uppercase;
  background-color: ${props => props.bg || props.theme.colors.gray8};
  border: ${props => props.borderColor ? `1px solid ${props.borderColor}` : 'none'}; 
  color: ${props => props.color || props.theme.colors.white};
  letter-spacing: 1.25px;
  font-weight: 600;
`

const TestGroupBadge = ({ testName, ...props }) => {
  const {icon, groupName, color} = getTestMetadata(testName)

  return (
    <Badge bg={color} color='white' {...props}>
      <Flex sx={{gap: 1}} alignItems='center'>
        <Text>
          {groupName}
        </Text>
        {cloneElement(icon, {size: 12})}
      </Flex>
    </Badge>
  )
}

export const CategoryBadge = ({ categoryCode }) => {
  let IconComponent
  try {
    IconComponent = require(`ooni-components/icons/CategoryCode${categoryCode}`).default
  } catch {
    IconComponent = null
  }

  return (
    <Badge bg='#ffffff' borderColor={theme.colors.gray5} color={theme.colors.gray7}>
      <Flex sx={{gap: 1}} alignItems='center'>
        <Box>
          <FormattedMessage id={`CategoryCode.${categoryCode}.Name`} />
        </Box>
        {IconComponent && 
          <Box>
            <IconComponent height={15} width={15} />
          </Box>
        }
      </Flex>
    </Badge>
  )
}

TestGroupBadge.propTypes = {
  testName: PropTypes.string.isRequired,
}

export default TestGroupBadge
