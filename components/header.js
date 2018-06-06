import React from 'react'

import Head from 'next/head'

export default class Header extends React.Component {
  render() {
    return (
      <header>
        <Head>
          <meta charSet='utf-8'/>
          <meta name='viewport' content='initial-scale=1.0, width=device-width'/>
        </Head>
      </header>
    )
  }
}
