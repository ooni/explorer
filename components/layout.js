import React from 'react'

import Header from './header'
import { config } from 'rebass'

const colors = {
  'ooniBlue': '#0588CB',
  'offBlack': '#1c1c1c',
  'white': '#fff',
  'offWhite': '#f2f2f2',
  'footerBg': '#26292c',
  'footerFg': '#b4b4b4',
  'blocked': '#B83564',
  'unblocked': '#4FD156',

  'red': '#cc0000',
  'green': '#4fd156',
  'orange': '#ffa500',

  'grayLight': '#d9d9d9',
  'gray': '#c1c1c1'
}

const rebassConfig = {
  name: 'Ooni',
  fontFamily: '"Fira Sans", Helvetica, sans-serif',
  color: colors.offBlack,
  backgroundColor: colors.offWhite,
  borderRadius: 3,
  borderColor: colors.ooniBlue,

  colors: {
    ...config.colors,
    blue: colors.ooniBlue,
    info: colors.ooniBlue,

    green: colors.green,
    success: colors.green,

    orange: colors.orange,
    warning: colors.orange,

    red: colors.red,
    error: colors.red,

    // primary: ,
    // midgray: '#778',
    gray: colors.gray,
    // secondary: '#333339',
  },
  inverted: colors.offWhite,
  Toolbar: {
    minHeight: 64,
    color: colors.offWhite,
    backgroundColor: colors.ooniBlue
  },
}

export default class extends React.Component {

  static propTypes = {
    children: React.PropTypes.array.isRequired
  }

  static childContextTypes = {
    rebass: React.PropTypes.object
  }

  getChildContext () {
    return {
      rebass: rebassConfig
    }
  }

  render () {
    return (
      <div>
        <Header/>
        <div>
          { this.props.children }
        </div>

        <footer></footer>
      </div>
    )
  }
}
