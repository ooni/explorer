import React, { useState } from 'react'
import { useRouter } from 'next/router'
import NLink from 'next/link'
import styled from 'styled-components'
import { FormattedMessage, useIntl } from 'react-intl'
import { MdMenu, MdClose } from 'react-icons/md'
import { getLocalisedLanguageName } from 'utils/i18nCountries'
import ExplorerLogo from 'ooni-components/svgs/logos/Explorer-HorizontalMonochromeInverted.svg'
import { Link, Flex, Box, Container } from 'ooni-components'
import useUser from 'hooks/useUser'
import { getDirection } from './withIntl'

const StyledNavItem = styled.a`
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
  &:hover {
    opacity: 1;
  }
`

const NavItem = ({ label, href }) => {
  const { pathname } = useRouter()
  const active = pathname === href

  return (
    <NLink href={href} passHref>
      <StyledNavItem $active={active}>{label}</StyledNavItem>
    </NLink>
  )
}

const StyledNavBar = styled.div`
  background-color: ${(props) => props.$bgColor || props.theme.colors.blue5};
  padding-top: 16px;
  padding-bottom: 20px;
  z-index: 999;
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
  }

  .closeIcon {
    color: ${(props) => props.theme.colors.black};
    cursor: pointer;
  }

  .menuItemsWrapper {
    display: none;

    &.visible {
      display: block;
      overflow-y: scroll;
      max-height: 100%;
      padding: ${(props) => props.theme.space[4]}px;
      font-Size: 16px;
      position: fixed;
      top: 0;
      right: 0;
      background: ${(props) => props.theme.colors.gray0};
      z-index: 999;
      
      .menuItems {
        padding-top: ${(props) => props.theme.space[2]}px;
        flex-direction: column;
        align-items: start;
        
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
    logout()
  }

  return (
    <StyledNavBar $bgColor={color}>
      <Container>
        <Flex flexDirection='row' justifyContent='space-between' alignItems='end'>
          <Box style={{ zIndex: 1 }}>
            <NLink href='/' passHref>
              <Link>
                <ExplorerLogo height='26px' />
              </Link>
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
                <NavItem label={<FormattedMessage id="Navbar.Search" />} href="/search" />
                <NavItem label={<FormattedMessage id="Navbar.Charts.MAT" />} href="/chart/mat" />
                <NavItem label={<FormattedMessage id="Navbar.Charts.Circumvention" />} href="/chart/circumvention" />
                <NavItem label={<FormattedMessage id="Navbar.Countries" />} href="/countries" />
                <NavItem label={<FormattedMessage id="Navbar.Networks" />} href="/networks" />
                <NavItem label={<FormattedMessage id="Navbar.Domains" />} href="/domains" />
                <NavItem label={<FormattedMessage id="Navbar.Findings" />} href="/findings" />
                {user?.logged_in && (
                  <StyledNavItem onClick={logoutUser}><FormattedMessage id="General.Logout" /></StyledNavItem>
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
