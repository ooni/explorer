import React from 'react'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import NLink from 'next/link'
import { Flex, Box, Link, theme, Text } from 'ooni-components'
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
  report,
  explore,
  tileColor = 'black'
}) => {
  const intl = useIntl()

  return (
    <Box width={[1, 1/3]}>
      <StyledFlex flexDirection='column' p={4} mx={[0, 3]} my={3} bg={tileColor} color='white'>
        <Flex flexWrap='wrap' alignItems='center' my={3}>
          <Flag countryCode={countryCode} size={40} border />
          <Text fontSize={24} fontWeight='bold' mx={3}>{getLocalisedRegionName(countryCode, intl.locale)}</Text>
        </Flex>
        <FlexGrowBox flexWrap='wrap' my={1}>
          {title && 
            <Box my={2}>
              <Text fontSize={24} fontWeight='bold'>{intl.formatMessage({id: title})}</Text>
            </Box>
          }
          <Box mb={3}>
            <Text fontSize={20}>
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
                {intl.formatMessage({id: text})}
              </Markdown>
            </Text>
          </Box>
        </FlexGrowBox>
        <Flex>
          {explore && 
            <Box my={2} width={1/2}>
              <Text fontSize={20}>
                <NLink href={explore} passHref><Link color='white'>{intl.formatMessage({id: 'Home.Highlights.Explore'})}</Link></NLink>
              </Text>
            </Box>
          }
          {report && 
            <Box my={2} width={1/2}>
              <Text fontSize={20}>
                <Link href={report} color='white'>{intl.formatMessage({id: 'Home.Highlights.ReadReport'})}</Link>
              </Text>
            </Box>
          }
        </Flex>
      </StyledFlex>
    </Box>
  )
}
  


HighlightBox.propTypes = {
  countryCode: PropTypes.string.isRequired,
  countryName: PropTypes.string.isRequired,
  title: PropTypes.string,
  text: PropTypes.string.isRequired,
  report: PropTypes.string,
  explore: PropTypes.string,
  tileColor: PropTypes.string
}

export default HighlightBox
