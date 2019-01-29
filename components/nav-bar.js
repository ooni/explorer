import React from 'react'

import { withRouter } from 'next/router'
import NLink from 'next/link'

import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import ExplorerLogo from 'ooni-components/components/svgs/logos/Explorer-HorizontalMonochromeInverted.svg'

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
  left: 16px;
  bottom: -6px;

  width: ${props => props.active ? 'calc(100% - 15px)' : '0px'};
  ${StyledNavItem}:hover & {
    width: calc(100% - 15px);
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
`

export const NavBar = ({color}) => (
  <StyledNavBar color={color}>
    <Container>
      <Flex alignItems='center'>
        <Box style={{zIndex: 1}}>
          <NLink href='/'>
            <ExplorerLogo height='26px' />
          </NLink>
        </Box>
        <Box ml='auto'>
          <NavItem label={<FormattedMessage id='Navbar.Search' />} href='/search' />
          <NavItem label={<FormattedMessage id='Navbar.Results' />} href='/results' />
          <NavItem label={<FormattedMessage id='Navbar.Countries' />} href='/countries' />
          <NavItem label={<FormattedMessage id='Navbar.About' />} href='/about' />
        </Box>
      </Flex>
    </Container>
  </StyledNavBar>
)

export default NavBar
