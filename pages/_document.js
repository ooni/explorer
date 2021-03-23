import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  render () {
    return (
      <Html lang='en'>
        <Head>
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <script src='/static/lang/translations.js' />
          <NextScript />
        </body>
      </Html>
    )
  }
}
