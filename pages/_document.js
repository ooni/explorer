// updated based on documentation: https://github.com/vercel/next.js/blob/canary/examples/with-styled-components/pages/_document.tsx
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { getDirection } from 'components/withIntl'
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      }
    } finally {
      sheet.seal()
    }
  }

  render = () => (
    <Html dir={getDirection(this.props.locale)} lang={this.props.locale}>
      <Head>
        <script 
          defer
          src="https://eu.umami.is/script.js"
          data-website-id="6c9769aa-4b46-4d8d-82a9-a5a6d77206c4"
          data-domains="explorer.ooni.org"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
