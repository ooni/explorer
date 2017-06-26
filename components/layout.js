import React from 'react'

import Header from './header'
import { config } from 'rebass'

export const colors = {
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
    children: React.PropTypes.array.isRequired,
    hideHeader: React.PropTypes.bool
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
    const {
      hideHeader
    } = this.props

    return (
      <div>
        <style global jsx>{`
          * {
            margin: 0;
            padding: 0;
            text-rendering: geometricPrecision;
            box-sizing: border-box;
          }
          body, html {
            background: ${ colors.offWhite };
            color: ${ colors.offBlack };
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
            height: 100%;
          }
        `}</style>
        <Header hideHeader={hideHeader} />
        <div className="content">
          { this.props.children }
        </div>
        <footer>
          <div className="footer-content">
            <h2>Proudly made by the Open Observatory of Network Interference</h2>
            <p>© OONI - Open Observatory of Network Interference • <a href="#">Privacy</a></p>
          </div>
        </footer>
        <style jsx>{`
          header {
            width: 100%;
            margin-bottom: 20px;
            padding: 0;
          }
          footer {
            background: ${ colors.footerBg } linear-gradient(rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 10%);
            min-width: 900px;
            width: 100%;
          }
          .footer-content {
            margin: 0 auto;
            width: 900px;
            color: ${ colors.footerFg };
            text-align: center;
            padding: 25px 0 10px 0;
          }
          .footer-content h2 {
            padding-bottom: 20px;
          }
          .footer-content p {
            color: white;
          }
          .footer-content a {
            color: white;
            text-decoration: none;
          }
        `}
        </style>
      </div>
    )
  }
}
