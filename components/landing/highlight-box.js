import React from 'react'
import PropTypes from 'prop-types'
import NLink from 'next/link'
import { Flex, Box, Text, Link } from 'ooni-components'
import styled from 'styled-components'

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

const HighlightBox = ({
  countryCode,
  countryName,
  title,
  text,
  report,
  explore
}) => (
  <Box p={2} my={3} width={[1, 1]} bg='blue9' color='white'>
    <Flex flexWrap='wrap' alignItems='center' my={3}>
      <Flag countryCode={countryCode} size={24} />
      <Text fontSize={18} fontWeight='bold' mx={1}>{countryName}</Text>
    </Flex>
    <Flex flexWrap='wrap' my={1} alignItems='center'>
      {title && <Box my={2} width={[1, 'unset']} order={[1, 'unset']}>
        <Text fontSize={18}>{title}</Text>
      </Box>}
      <Box width={1} order={[2, 'unset']} mb={3}>
        <Text fontSize={14}>{text}</Text>
      </Box>
      <Box order={[3, 'unset']} my={1}>
        <LinkButton bg='blue5' hover='blue4' active='blue6' color='white' px={2} py={1}>
          <NLink href={explore} passHref><Link>Explore</Link></NLink>
        </LinkButton>
      </Box>
      <Box ml={2} order={[4, 'unset']}>
        <LinkButton bg='green8' hover='green7' active='green9' color='white' px={2} py={1}>
          <Link href={report}> Report </Link>
        </LinkButton>
      </Box>
    </Flex>
  </Box>
)

HighlightBox.propTypes = {
  countryCode: PropTypes.string.isRequired,
  countryName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  report: PropTypes.string.isRequired,
  explore: PropTypes.string.isRequired
}

export default HighlightBox
