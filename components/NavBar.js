import React, { useState } from 'react'
import { useRouter } from 'next/router'
import NLink from 'next/link'
import styled, { css, keyframes } from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { HiMenuAlt3, HiOutlineX } from 'react-icons/hi'
import ExplorerLogo from 'ooni-components/components/svgs/logos/Explorer-HorizontalMonochromeInverted.svg'
import {
  Link,
  Flex,
  Box,
  Container
} from 'ooni-components'

const StyledNavItem = styled.a`
  text-decoration: none;
`

const NavItemLabel = styled.span`
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  opacity: ${props => props.active ? '1' : '0.6 '};
  border-bottom-width: ${props => props.active ? '2px' : '0px'};
  border-bottom-style: solid;
  border-bottom-color: ${props => props.theme.colors.white};
  padding-bottom: 4px;

  ${StyledNavItem}:hover & {
    opacity: 1;
    border-bottom-width: 2px;
  }
`

const fadeLeft = keyframes`
  5% {
    opacity: 0;
    transform: translateX(30%);
  }
  40%, 100% {
    opacity: 1;
    transform: translateX(0);
  }
`

const MobileNavItemLabel = styled.p`
  color: ${props => props.theme.colors.black};
  cursor: pointer;
  font-size: 24px;
  padding-left: 10px;
  margin-bottom: 15px;
  opacity: 0;
  animation: ${props =>
    props.open &&
    css`
      ${fadeLeft} 3s ease-in-out forwards
    `};
`

const Divider = styled.hr`
  border: none;
  height: 1px;
  width: 100%;
  background-color: #ccc;
  opacity: 0;
  animation: ${props =>
    props.open &&
    css`
      ${fadeLeft} 3s ease-in-out forwards
    `};
`

const StyledNavBar = styled.div`
  background-color: ${props => props.color || props.theme.colors.blue5};
  padding-top: 16px;
  padding-bottom: 20px;
`

const DesktopContainer = styled(Box)`
  @media screen and (max-width: 512px) {
    display: none;
  }
`

const MobileContainer = styled(Box)`
  @media screen and (min-width: 513px) {
    display: none;
  }
`

const Menu = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background-color: white;
  z-index: 1;
  transition: all 0.4s ease-in-out;
  transform: ${props => props.open ? 'translateX(0%)' : 'translateX(100%)'};
`

const CloseIcon = styled(HiOutlineX)`
  position: absolute;
  right: 30px;
  top: 30px;
`

const NavItem = ({label, href}) => {
  const router = useRouter()
  const active = router.pathname === href

  return (
    <Box ml={[0, 4]} my={[2, 0]}>
      <NLink href={href} passHref>
        <StyledNavItem>
          <NavItemLabel active={active}>{label}</NavItemLabel>
        </StyledNavItem>
      </NLink>
    </Box>
  )
}

const MobileNavItem = ({label, href, open, order}) => {
  const router = useRouter()
  const active = router.pathname === href

  return (
    <Box mt={2} mb={20} pb={10}>
      <NLink href={href} passHref>
        <StyledNavItem>
          <MobileNavItemLabel open={open} active={active} style={{animationDelay: `calc(${order} * 100ms)`}}>{label}</MobileNavItemLabel>
          <Divider open={open} style={{animationDelay: `calc(${order} * 100ms)`}} />
        </StyledNavItem>
      </NLink>
    </Box>
  )
}

const navbarItems = [
  {
    order: 1,
    labelId: 'Navbar.Search',
    href: '/search',
  },
  {
    order: 2,
    labelId: 'Navbar.Charts.MAT',
    href: '/chart/mat',
  },
  {
    order: 3,
    labelId: 'Navbar.Charts.Circumvention',
    href: '/chart/circumvention',
  },
  {
    order: 4,
    labelId: 'Navbar.Countries',
    href: '/countries',
  },
]

export const NavBar = ({color}) => {
  const [open, setOpen] = useState(false)

  const toggleMenu = () => setOpen(p => !p)

  return (
    <StyledNavBar color={color}>
      <Container>
        <Flex
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={['flex-start', 'center']}
        >
          <Box style={{zIndex: 1}}>
            <NLink href='/' passHref>
              <Link><ExplorerLogo height='26px' /></Link>
            </NLink>
          </Box>
          <DesktopContainer mt={[2, 0]}>
            <Flex flexDirection={'row'} alignItems={'center'} >
              {navbarItems.map(item => (
                <NavItem key={item.order} label={<FormattedMessage id={item.labelId} />} href={item.href} />
              ))}
            </Flex>
          </DesktopContainer>
          <MobileContainer>
            <HiMenuAlt3 onClick={toggleMenu} size={24} color='white' />
            <Menu open={open}>
              <CloseIcon onClick={toggleMenu} size={30} />
              <Box mt={100} width={0.9} marginX="auto">
                {navbarItems.map(item => (
                  <MobileNavItem key={item.order} label={<FormattedMessage id={item.labelId} />} href={item.href} order={item.order} open={open} />
                ))}
              </Box>
            </Menu>
          </MobileContainer>
        </Flex>
      </Container>
    </StyledNavBar>
  )
}

export default NavBar
