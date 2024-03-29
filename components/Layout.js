import { theme } from 'ooni-components'
import PropTypes from 'prop-types'
import React from 'react'
import { ThemeProvider, createGlobalStyle } from 'styled-components'

import { getDirection } from 'components/withIntl'
import { UserProvider } from 'hooks/useUser'
import { useIntl } from 'react-intl'
import Footer from './Footer'
import Header from './Header'

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

const Layout = ({ children, disableFooter = false }) => {
  const { locale } = useIntl()

  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <GlobalStyle direction={getDirection(locale)} />
        <div className="site">
          <Header />
          <div className="content">
            { children }
          </div>
          {!disableFooter && <Footer />}
        </div>
      </UserProvider>
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  disableFooter: PropTypes.bool
}

export default Layout
