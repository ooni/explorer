import React from 'react'

import PropTypes from 'prop-types'

import Header from './header'

import { injectGlobal } from 'styled-components'

import {
  Provider,
  theme
} from 'ooni-components'


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
  }`

export default class extends React.Component {

  static propTypes = {
    children: PropTypes.array.isRequired,
  }

  render () {
    return (
      <div>
        <Provider theme={theme}>
          <Header />
          <div className="content">
            { this.props.children }
          </div>
        </Provider>
      </div>
    )
  }
}
