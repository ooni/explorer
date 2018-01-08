import React from 'react'

import NLink from 'next/link'

import styled from 'styled-components'

import {
  Flex,
  Box,
  Container
} from 'ooni-components'

const StyledNavItem = styled.div`
  position: relative;
  display: inline;
  padding-left: 16px;
`

const NavItemLabel = styled.span`
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  opacity: 0.6;

  ${StyledNavItem}:hover & {
    opacity: 1;
  }
`

const Underline = styled.span`
  display: block;
  height: 4px;
  background: ${props => props.theme.colors.white};
  position: absolute;
  left: 16px;
  bottom: -10px;

  width: 0px;
  ${StyledNavItem}:hover & {
    width: calc(100% - 20px);
  }
`

const NavItem = ({label, href, active, LinkEl }) => (
  <LinkEl href={href}>
    <StyledNavItem>
      <NavItemLabel active>{label}</NavItemLabel>
      <Underline active/>
    </StyledNavItem>
  </LinkEl>
)

const StyledNavBar = styled.div`
  background-color: ${props => props.theme.colors.blue5};
  padding-top: 16px;
  padding-bottom: 20px;
`

export const NavBar = ({items, LinkEl = NLink}) => (
  <StyledNavBar>
  <Container>
  <Flex>
    <Box>
      <ExplorerLogo height='26px' />
    </Box>
    <Box ml='auto'>
      {items.map(item => (
        <NavItem {...item} LinkEl={LinkEl} />
      ))}
    </Box>
  </Flex>
  </Container>
  </StyledNavBar>
)

export default NavBar
