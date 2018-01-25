import React from 'react'

import { withRouter } from 'next/router'
import NLink from 'next/link'

import styled from 'styled-components'

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
    <NLink href={href}>
      <StyledNavItem>
        <NavItemLabel active={active} >{label}</NavItemLabel>
        <Underline active={active} />
      </StyledNavItem>
    </NLink>
  )
}
const NavItem = withRouter(NavItemComponent)

const StyledNavBar = styled.div`
  background-color: ${props => props.theme.colors.blue5};
  padding-top: 16px;
  padding-bottom: 20px;
`

const PrototypeBannerContainer = styled.div`
position: relative;
`

const PrototypeBanner = styled.div`
  color: ${props => props.theme.colors.black};
  font-size: 30px;
  position: absolute;
  top: -10px;
  left: 0px;
  padding: 20px;
  opacity: 0.8;
  background-color: ${props => props.theme.colors.red8};
  z-index: 0;
`

export const NavBar = () => (
  <StyledNavBar>
  <Container>
  <PrototypeBannerContainer>
    <PrototypeBanner>PROTOTYPE</PrototypeBanner>
  </PrototypeBannerContainer>
  <Flex>
    <Box style={{zIndex: 1}}>
      <NLink href='/'>
        <ExplorerLogo height='26px' />
      </NLink>
    </Box>
    <Box ml='auto'>
      <NavItem label='Search' href='/search' />
      <NavItem label='Results' href='/results' />
      <NavItem label='Countries' href='/countries' />
      <NavItem label='About' href='/about' />
    </Box>
  </Flex>
  </Container>
  </StyledNavBar>
)

export default NavBar
