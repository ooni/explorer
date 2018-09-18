import React from 'react'
import PropTypes from 'prop-types'
import { createGlobalStyle } from 'styled-components'
import {
  Provider,
  theme
} from 'ooni-components'

import Header from './header'
import Footer from './footer'

theme.maxWidth = 1024

const GlobalStyle = createGlobalStyle`
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
  }
`

export default class Layout extends React.Component {
  render () {
    const { children, disableFooter = false } = this.props
    return (
      <Provider theme={theme}>
        <div className="site">
          <Header />
          <div className="content">
            { children }
          </div>
          {!disableFooter && <Footer />}
        </div>
        <GlobalStyle />
      </Provider>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.array.isRequired,
  disableFooter: PropTypes.bool
}
