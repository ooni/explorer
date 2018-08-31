import React from 'react'
import PropTypes from 'prop-types'
import { injectGlobal } from 'styled-components'
import {
  Provider,
  theme
} from 'ooni-components'

import Header from './header'
import Footer from './footer'
import withIntl from './withIntl'

theme.maxWidth = 1024

injectGlobal`
  * {
    text-rendering: geometricPrecision;
    box-sizing: border-box;
  }
  body, html {
    margin: 0;
    padding: 0;
    font-family: "Fira Sans";
    height: 100%;
    background-color: ${theme.colors.white};
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
  }`

const Layout = ({ children, disableFooter = false }) => (
  <Provider theme={theme}>
    <div className="site">
      <Header />
      <div className="content">
        { children }
      </div>
      {!disableFooter && <Footer />}
    </div>
  </Provider>
)

Layout.propTypes = {
  children: PropTypes.array.isRequired,
  disableFooter: PropTypes.bool
}

export default withIntl(Layout)
