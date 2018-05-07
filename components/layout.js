import React from 'react'

import PropTypes from 'prop-types'

import Header from './header'

import { injectGlobal } from 'styled-components'

import {
  Provider,
  theme
} from 'ooni-components'

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
    background-color: ${theme.colors.gray1};
  }`

export default class Layout extends React.Component {
  render () {
    const { children } = this.props
    return (
      <div>
        <Provider theme={theme}>
          <Header />
          <div className="content">
            { children }
          </div>
        </Provider>
      </div>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.array.isRequired
}
