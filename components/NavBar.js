import useUser from 'hooks/useUser'
import NLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Container, Flex } from 'ooni-components'
import ExplorerLogo from 'ooni-components/svgs/logos/Explorer-HorizontalMonochromeInverted.svg'
import React, { useEffect, useState } from 'react'
import { MdClose, MdMenu } from 'react-icons/md'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'
import { getLocalisedLanguageName } from 'utils/i18nCountries'
import { getDirection } from './withIntl'

const StyledNavItem = styled(NLink)`
  position: relative;
  color: ${(props) => props.theme.colors.white};
  cursor: pointer;
  padding-bottom: ${(props) => (props.$active ? '4px' : '6px')};
  opacity: ${(props) => (props.$active ? '1' : '0.6')};
  border-bottom: ${(props) => (props.$active ? `2px solid ${props.theme.colors.white}` : 'none')};

  &:hover {
    padding-bottom: 4px;
    color: ${(props) => props.theme.colors.white};
    opacity: 1;
    border-bottom: 2px solid ${(props) => props.theme.colors.white};
  }
`

const LanguageSelect = styled.select`
color: ${(props) => props.theme.colors.white};
background: none;
opacity: 0.6;
border: none;
text-transform: capitalize;
cursor: pointer;
font-family: inherit;
font-size: inherit;
padding: 0;
padding-bottom: 6px;
outline: none;
appearance: none;
-webkit-appearance: none;
-moz-appearance: none;
-ms-appearance: none;
-o-appearance: none;
&:hover {
  opacity: 1;
}
// reset option styling for browsers that apply it to its native styling (Brave)
> option {
  color: initial;
  opacity: initial;
}
`

const NavItem = ({ label, href, ...rest }) => {
  const { pathname } = useRouter()
  const [isActive, setIsActive] = useState(false)
 
  useEffect(() => {
    setIsActive(pathname === href)
  }, [pathname, href])

  return (
    <StyledNavItem href={href} $active={isActive} {...rest}>{label}</StyledNavItem>
  )
}

const StyledNavBar = styled.div`
  background-color: ${(props) => props.$bgColor || props.theme.colors.blue5};
  padding-top: 16px;
  padding-bottom: 20px;
  z-index: 9999;
`

const StyledResponsiveMenu = styled(Box)`
.menuIcon,
.closeIcon {
  display: none;
}

@media screen and (max-width: 948px) {
  .menuIcon,
  .closeIcon {
    display: block;
    cursor: pointer;
  }

  .closeIcon {
    color: ${(props) => props.theme.colors.black};
  }

  .menuItemsWrapper {
    display: none;

    &.visible {
      z-index: 999999;
      display: block;
      overflow-y: scroll;
      max-height: 100%;
      padding: ${(props) => props.theme.space[4]}px;
      font-Size: 16px;
      position: fixed;
      top: 0;
      right: 0;
      background: ${(props) => props.theme.colors.gray0};
      
      .menuItems {
        padding-top: ${(props) => props.theme.space[2]}px;
        flex-direction: column;
        align-items: start;
        
        a {
          border-color: ${(props) => props.theme.colors.black};
        }

        a, select {
          opacity: 1;
          color: ${(props) => props.theme.colors.black};
        }
      }
    }
  }
}
`

const languages = process.env.LOCALES

export const NavBar = ({ color }) => {
  const { locale } = useIntl()
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { user, logout } = useUser()

  const [showMenu, setShowMenu] = useState(false)

  const handleLocaleChange = (event) => {
    const htmlEl = document.documentElement
    htmlEl.setAttribute('dir', getDirection(event.target.value))
    router.push({ pathname, query }, asPath, { locale: event.target.value })
  }

  const logoutUser = (e) => {
    e.preventDefault()
    setShowMenu(false)
    logout()
  }

  useEffect(() => {
    setShowMenu(false)
  }, [pathname])

  return (
    <StyledNavBar $bgColor={color}>
      <Container>
        <Flex flexDirection='row' justifyContent='space-between' alignItems='end'>
          <Box style={{ zIndex: 1 }}>
            <NLink href='/'>
              <ExplorerLogo height='26px' />
            </NLink>
          </Box>
          <StyledResponsiveMenu color='white'>
            <MdMenu size="28px" className='menuIcon' onClick={() => setShowMenu(!showMenu)} />
            <Box className={`menuItemsWrapper ${showMenu ? 'visible' : ''}`}>
              {showMenu && (
                <Flex justifyContent='end'>
                  <MdClose size="28px" className='closeIcon' onClick={() => setShowMenu(!showMenu)} />
                </Flex>
              )}
              <Flex className='menuItems' alignItems='center' sx={{gap: [3, 3, 3, 4]}}>
                <NavItem label={<FormattedMessage id="Navbar.Search" />} href="/search" data-umami-event="navigation-search" />
                <NavItem label={<FormattedMessage id="Navbar.Charts.MAT" />} href="/chart/mat" data-umami-event="navigation-mat" />
                <NavItem label={<FormattedMessage id="Navbar.Charts.Circumvention" />} href="/chart/circumvention" data-umami-event="navigation-circumvention" />
                <NavItem label={<FormattedMessage id="Navbar.Countries" />} href="/countries" data-umami-event="navigation-countries" />
                <NavItem label={<FormattedMessage id="Navbar.Networks" />} href="/networks" data-umami-event="navigation-networks" />
                <NavItem label={<FormattedMessage id="Navbar.Domains" />} href="/domains" data-umami-event="navigation-domains" />
                <NavItem label={<FormattedMessage id="Navbar.Findings" />} href="/findings" data-umami-event="navigation-findings" />
                {user?.logged_in && (
                  <StyledNavItem href="" onClick={logoutUser}><FormattedMessage id="General.Logout" /></StyledNavItem>
                )}
                <LanguageSelect onChange={handleLocaleChange} value={locale}>
                  {languages.map((c) => (
                    <option key={c} value={c}>
                      {getLocalisedLanguageName(c, c)}
                    </option>
                  ))}
                </LanguageSelect>
              </Flex>
            </Box>
          </StyledResponsiveMenu>
        </Flex>
      </Container>
    </StyledNavBar>
  )
}

export default NavBar
