import React from 'react'

import { withRouter } from 'next/router'
import NLink from 'next/link'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import ExplorerLogo from '../static/images/ExplorerBeta-HorizontalMonochromeInverted.svg'

import {
  Link,
  Flex,
  Box,
  Container
} from 'ooni-components'

const StyledNavItem = styled.a`
  text-decoration: none;
  position: relative;
  display: inline;
  margin-left: 16px;
`

const NavItemLabel = styled.span`
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  opacity: ${props => props.active ? '1' : '0.6 '};

  ${StyledNavItem}:hover & {
    opacity: 1;
  }
`

const Underline = styled.span`
  display: block;
  height: 2px;
  background: ${props => props.theme.colors.white};
  position: absolute;
  left: 0;
  bottom: -6px;

  width: ${props => props.active ? '100%' : '0px'};
  ${StyledNavItem}:hover & {
    width: calc(100%);
  }
`

const NavItemComponent = ({router, label, href}) => {
  const active = router.pathname === href
  return (
    <NLink href={href} passHref>
      <StyledNavItem>
        <NavItemLabel active={active} >{label}</NavItemLabel>
        <Underline active={active} />
      </StyledNavItem>
    </NLink>
  )
}
const NavItem = withRouter(NavItemComponent)

const StyledNavBar = styled.div`
  background-color: ${props => props.color || props.theme.colors.blue5};
  padding-top: 16px;
  padding-bottom: 20px;
  z-index: 999;
`

export const NavBar = ({color}) => (
  <StyledNavBar color={color}>
    <Container>
      <Flex alignItems='center'>
        <Box style={{zIndex: 1}}>
          <NLink href='/' passHref>
            <Link><ExplorerLogo height='26px' /></Link>
          </NLink>
        </Box>
        <Box ml='auto'>
          <NavItem label={<FormattedMessage id='Navbar.Search' />} href='/search' />
          <NavItem label={<FormattedMessage id='Navbar.Countries' />} href='/countries' />
        </Box>
      </Flex>
    </Container>
  </StyledNavBar>
)

export default NavBar
