import React from 'react'

import Link from 'next/link'
import Head from 'next/head'

export default class extends React.Component {
  render() {
    return (
      <header>
        <Head>
          <meta charset='utf-8'/>
          <meta name='viewport' content='initial-scale=1.0, width=device-width'/>
        </Head>
      </header>
    )
  }
}
