import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Container, Text } from 'ooni-components'

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
  <StyledBox my={4} py={3}>
    <Container>
      <Text mb={3} fontSize={2} fontWeight={600}>{title}</Text>
      {children}
    </Container>
  </StyledBox>
)

BoxWithTitle.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  children: PropTypes.node
}
