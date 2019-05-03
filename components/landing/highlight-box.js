import React from 'react'
import PropTypes from 'prop-types'
import NLink from 'next/link'
import { Flex, Box, Text } from 'ooni-components'
import styled from 'styled-components'

import Flag from '../flag'

const LinkButton = styled(Box)`
  border-radius: 6px;
  a {
    text-decoration: none;
    color: white;
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
  <Box p={2} my={3} width={[1, 1/2]}>
    <Flex flexWrap='wrap' alignItems='center' my={1}>
      <Flag countryCode={countryCode} size={24} />
      <Text fontSize={18} fontWeight='bold' mx={1}>{countryName}</Text>
    </Flex>
    <Flex flexWrap='wrap' my={1} alignItems='center'>
      {title && <Box mr={2} width={[1, 'unset']} order={[1, 'unset']}>
        <Text fontSize={18}>{title}</Text>
      </Box>}
      <Box order={[3, 'unset']} my={1}>
        <LinkButton bg='blue5' color='white' px={2} py={1}>
          <NLink href={explore}><a>Explore</a></NLink>
        </LinkButton>
      </Box>
      <Box ml={2} order={[4, 'unset']}>
        <LinkButton bg='green8' color='white' px={2} py={1}>
          <a href={report}> Report </a>
        </LinkButton>
      </Box>
      <Box width={1} order={[2, 'unset']} mt={1}>
        <Text fontSize={16} color='gray6'>{text}</Text>
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
