import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Text } from 'ooni-components'

const StyledBox = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray4};
`

export const SimpleBox = ({ children }) => (
  <StyledBox px={3} py={2}>
    {children}
  </StyledBox>
)

SimpleBox.propTypes = {
  children: PropTypes.node
}

export const BoxWithTitle = ({ title, children }) => (
  <StyledBox px={3} py={2}>
    <Text mb={2} fontSize={2}>{title}</Text>
    {children}
  </StyledBox>
)

BoxWithTitle.propTypes = {
  title: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  children: PropTypes.node
}
