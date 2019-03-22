import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Container } from 'ooni-components'
import { Text } from 'rebass'

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
  <StyledBox my={4}>
    <Container>
      <Text my={3} fontSize={2} fontWeight={600}>{title}</Text>
      {children}
    </Container>
  </StyledBox>
)

BoxWithTitle.propTypes = {
  title: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  children: PropTypes.node
}
