import React from 'react'
import PropTypes from 'prop-types'
import NLink from 'next/link'
import { Flex, Box, Link, theme } from 'ooni-components'
import { Text } from 'rebass'
import styled from 'styled-components'
import Markdown from 'markdown-to-jsx'

import Flag from '../flag'

const LinkButton = styled(Box)`
  border-radius: 6px;
  ${Link} {
    text-decoration: none;
    color: white;
  }
  :hover, :focus {
    background-color: ${props => props.theme.colors[props.hover]};
  }
  :active {
    background-color: ${props => props.theme.colors[props.active]};
  }
`

const StyledFlex = styled(Flex)`
  min-height: 500px;
`

const FlexGrowBox = styled(Box)`
  flex-grow: ${props => props.grow || 1};
`

const HighlightBox = ({
  countryCode,
  countryName,
  title,
  text,
  report,
  explore,
  tileColor = 'black'
}) => (
  <Box width={[1, 1/3]}>
    <StyledFlex flexDirection='column' p={4} mx={[0, 3]} my={3} bg={tileColor} color='white'>
      <Flex flexWrap='wrap' alignItems='center' my={3}>
        <Flag countryCode={countryCode} size={60} />
        <Text fontSize={22} fontWeight='bold' mx={1}>{countryName}</Text>
      </Flex>
      <FlexGrowBox flexWrap='wrap' my={1}>
        {title && <Box my={2}>
          <Text fontSize={36}>{title}</Text>
        </Box>}
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
              {text}
            </Markdown>
          </Text>
        </Box>
      </FlexGrowBox>
      {explore && <Box my={2}>
        <Text fontSize={26}>
          <NLink href={explore} passHref><Link color='white'>Explore</Link></NLink>
        </Text>
      </Box>}
      {report && <Box my={2}>
        <Text fontSize={26}>
          <Link href={report} color='white'> Read Report </Link>
        </Text>
      </Box>}
    </StyledFlex>
  </Box>
)

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
