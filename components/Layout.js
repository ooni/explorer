import React from 'react'
import PropTypes from 'prop-types'
import { injectGlobal } from 'styled-components'
import {
  Provider,
  theme
} from 'ooni-components'

// Moved this from `_document.js` because `next-css` fails to extract
// imported css from `_document.js`. `next-css` should be upgraded along with
// the upgrade to `next@latest`
import 'typeface-fira-sans/index.css'

import Header from './header'
import Footer from './footer'
import withIntl from './withIntl'
import FeedbackButton from '../components/FeedbackFloat'

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
    font-size: 14px;
    height: 100%;
    background-color: #ffffff;
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

const Layout = ({ children, disableFooter = false }) => (
  <Provider theme={theme}>
    <div className="site">
      <Header />
      <div className="content">
        { children }
      </div>
      {!disableFooter && <Footer />}
    </div>
    <FeedbackButton />
  </Provider>
)

Layout.propTypes = {
  children: PropTypes.array.isRequired,
  disableFooter: PropTypes.bool
}

export default withIntl(Layout)
