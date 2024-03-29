import { Box, theme } from 'ooni-components'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { ThemeProvider, createGlobalStyle } from 'styled-components'

import { StyledStickyNavBar, StyledStickySubMenu } from 'components/SharedStyledComponents'
import { getDirection } from 'components/withIntl'
import { UserProvider } from 'hooks/useUser'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Footer from './Footer'
import Header from './Header'
import NavBar from './NavBar'

theme.maxWidth = 1024

const GlobalStyle = createGlobalStyle`
  * {
    text-rendering: geometricPrecision;
    box-sizing: border-box;
  }
  body, html {
    // direction: ${props => props.direction};
    margin: 0;
    padding: 0;
    font-size: 14px;
    height: 100%;
    background-color: #ffffff;
  }
  a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.blue6};
    &:hover {
      color: ${(props) => props.theme.colors.blue9};
    }
  }
  /*
    Sticky Footer fix
    Based on: https://philipwalton.github.io/solved-by-flexbox/demos/sticky-footer/
  */
  .site {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
  }
  .content {
    flex: 1 0 auto;
  }
`

const Layout = ({ children }) => {
  const { locale } = useIntl()
  const { pathname } = useRouter()

  const navbarColor = useMemo(() => {
    return pathname === '/' || pathname.match(/^\/m\/\S+/) || pathname.match(/^\/measurement\/\S+/) ? 
    'transparent'
    : null
  }, [pathname])
  const navbarSticky = useMemo(() => {
    return pathname === '/countries' ||
    pathname === '/domains' ||
    pathname === '/networks' ||
    pathname === '/findings' ||
    pathname.match(/^\/country\/\S+/)
  }, [pathname])

  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <GlobalStyle direction={getDirection(locale)} />
        <div className="site">
          <Header />
          {navbarSticky ?
            <StyledStickyNavBar>
              <NavBar color={navbarColor} />
            </StyledStickyNavBar> :
            <NavBar color={navbarColor} />
          }
          <Box className="content" mt={navbarColor ? '-66px': 0}>
            { children }
          </Box>
          <Footer />
        </div>
      </UserProvider>
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.object.isRequired
}

export default Layout
