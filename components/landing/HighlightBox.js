import React from 'react'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Flex, Box, Text, Heading, Link, theme } from 'ooni-components'
import styled from 'styled-components'
import Markdown from 'markdown-to-jsx'
import { getLocalisedRegionName } from 'utils/i18nCountries'

import Flag from '../Flag'

const StyledFlex = styled(Flex)`
  min-height: 350px;
`

const FlexGrowBox = styled(Box)`
  flex-grow: ${props => props.grow || 1};
`

const HighlightBox = ({
  countryCode,
  title,
  text,
  dates,
  footer
}) => {
  const intl = useIntl()

  return (
    <Flex 
      py={4}
      px={24}
      sx={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: 'gray3',
        borderLeft: '10px solid',
        borderLeftColor: 'blue5',
        minHeight: '328px'
      }}
    >
      <Box>
        {countryCode && (
          <Flex alignItems="center">
            <Flag countryCode={countryCode} size={32} />
            <Heading h={28} ml={2} my={0}>
              {getLocalisedRegionName(countryCode, intl.locale)}
            </Heading>
          </Flex>
        )}
        {dates}
        {/* <Text color="gray6">{startDate && formatLongDate(startDate, intl.locale)} - {endDate ? formatLongDate(endDate, intl.locale) : 'ongoing'}</Text> */}
        <Heading h={4} lineHeight='1.1'>{title}</Heading>
        <Text fontSize={20} as='p'>
          <Markdown
            options={{
              overrides: {
                a: {
                  component: Link,
                  props: {
                    color: theme.colors.blue3
                  }
                },
              }
            }}
          >
            {text}
          </Markdown>
        </Text>
      </Box>
      {footer}
    </Flex>
  )
}
  


HighlightBox.propTypes = {
  countryCode: PropTypes.string.isRequired,
  countryName: PropTypes.string.isRequired,
  title: PropTypes.string,
  text: PropTypes.string.isRequired,
  footer: PropTypes.element,
  dates: PropTypes.element
}

export default HighlightBox
