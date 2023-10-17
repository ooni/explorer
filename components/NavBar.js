import React from 'react'
import { useRouter, withRouter } from 'next/router'
import NLink from 'next/link'
import styled from 'styled-components'
import { FormattedMessage, useIntl } from 'react-intl'
import { getLocalisedLanguageName } from 'utils/i18nCountries'
import ExplorerLogo from 'ooni-components/svgs/logos/Explorer-HorizontalMonochromeInverted.svg'
import { Link, Flex, Box, Container } from 'ooni-components'
import useUser from 'hooks/useUser'
import { getDirection } from './withIntl'

const StyledNavItem = styled.a`
  text-decoration: none;
  position: relative;
  display: inline;
  padding-top: 4px;
`

const NavItemLabel = styled.span`
  color: ${(props) => props.theme.colors.white};
  cursor: pointer;
  opacity: ${(props) => (props.$active ? '1' : '0.6 ')};

  ${StyledNavItem}:hover & {
    opacity: 1;
  }
`

const Underline = styled.span`
  display: block;
  height: 2px;
  background: ${(props) => props.theme.colors.white};
  position: absolute;
  left: 0;
  bottom: -6px;

  width: ${(props) => (props.$active ? '100%' : '0px')};
  ${StyledNavItem}:hover & {
    width: calc(100%);
  }
`

const LanguageSelect = styled.select`
  color: ${(props) => props.theme.colors.white};
  background: none;
  opacity: 0.6;
  border: none;
  text-transform: capitalize;
  cursor: pointer;
`

const NavItemComponent = ({ router, label, href }) => {
  const active = router.pathname === href
  return (
    <Box ml={[0, 4]} my={[2, 0]}>
      <NLink href={href} passHref>
        <StyledNavItem>
          <NavItemLabel $active={active}>{label}</NavItemLabel>
          <Underline $active={active} />
        </StyledNavItem>
      </NLink>
    </Box>
  )
}
const NavItem = withRouter(NavItemComponent)

const StyledNavBar = styled.div`
  background-color: ${(props) => props.color || props.theme.colors.blue5};
  padding-top: 16px;
  padding-bottom: 20px;
  z-index: 999;
`
const languages = process.env.LOCALES

export const NavBar = ({ color }) => {
  const { locale } = useIntl()
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { user, logout } = useUser()

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
    <StyledNavBar color={color}>
      <Container>
        <Flex
          flexDirection={['column', 'row']}
          justifyContent={['flex-start', 'space-between']}
          alignItems={['flex-start', 'center']}
        >
          <Box style={{ zIndex: 1 }}>
            <NLink href='/' passHref>
              <Link>
                <ExplorerLogo height='26px' />
              </Link>
            </NLink>
          </Box>
          <Box mt={[2, 0]}>
            <Flex flexDirection={['column', 'row']} alignItems={'center'}>
              <NavItem label={<FormattedMessage id='Navbar.Search' />} href='/search' />
              <NavItem label={<FormattedMessage id='Navbar.Charts.MAT' />} href='/chart/mat' />
              <NavItem label={<FormattedMessage id='Navbar.Charts.Circumvention' />} href='/chart/circumvention' />
              <NavItem label={<FormattedMessage id='Navbar.Countries' />} href='/countries' />
              <NavItem label={<FormattedMessage id='Navbar.Networks' />} href='/networks' />
              <NavItem label={<FormattedMessage id='Navbar.Domains' />} href='/domains' />
              {user?.logged_in && (
                <Box ml={[0, 4]} my={[2, 0]}>
                  <StyledNavItem>
                    <NavItemLabel onClick={logoutUser}>
                      <FormattedMessage id='General.Logout' />
                    </NavItemLabel>
                    <Underline />
                  </StyledNavItem>
                </Box>
              )}
              <Box ml={[0, 4]} my={[2, 0]}>
                <LanguageSelect ml={[0, 4]} onChange={handleLocaleChange} value={locale}>
                  {languages.map((c) => (
                    <option key={c} value={c}>
                      {getLocalisedLanguageName(c, c)}
                    </option>
                  ))}
                </LanguageSelect>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </StyledNavBar>
  )
}

export default NavBar
