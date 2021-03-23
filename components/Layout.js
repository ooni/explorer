import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { theme } from 'ooni-components'
import { useScreenshot } from './ScreenshotContext'

import Header from './Header'
import Footer from './Footer'
import withIntl from './withIntl'
import FeedbackButton from '../components/FeedbackFloat'

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

const matomoInstance = createInstance({
  urlBase: 'https://matomo.ooni.org/',
  siteId: 2,
  trackerUrl: 'https://matomo.ooni.org/matomo.php',
  srcUrl: 'https://matomo.ooni.org/matomo.js',
  configurations: {
    disableCookies: true
  }
})

const Layout = ({ children, disableFooter = false }) => {
  const { isScreenshot } = useScreenshot()

  useEffect(() => {
    matomoInstance.trackPageView()
  }, [])

  return (
    <MatomoProvider value={matomoInstance}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <div className="site">
          <Header />
          <div className="content">
            { children }
          </div>
          {!disableFooter && !isScreenshot && <Footer />}
        </div>
        {!isScreenshot && <FeedbackButton />}
      </ThemeProvider>
    </MatomoProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.array.isRequired,
  disableFooter: PropTypes.bool
}

export default withIntl(Layout)
