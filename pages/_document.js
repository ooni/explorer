import { getDirection } from 'components/withIntl'
import Document, { Head, Html, Main, NextScript } from 'next/document'
export default class MyDocument extends Document {
  render = () => (
    <Html dir={getDirection(this.props.locale)} lang={this.props.locale}>
      <Head>
        <script
          defer
          src="https://eu.umami.is/script.js"
          data-website-id="6c9769aa-4b46-4d8d-82a9-a5a6d77206c4"
          data-domains="explorer.ooni.org"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
