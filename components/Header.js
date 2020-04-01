import React from 'react'

import Head from 'next/head'

const description = 'OONI Explorer is an open data resource on internet censorship around the world. Consisting of millions of network measurements collected from more than 200 countries since 2012, OONI Explorer sheds light on internet censorship and other forms of network interference worldwide.'

export default class Header extends React.Component {
  render() {
    return (
      <header>
        <Head>

          <meta charSet='utf-8'/>
          <meta name='viewport' content='initial-scale=1.0, width=device-width'/>
          <meta name='description' content={description} />
          <link rel="alternate" title="Events Detected by OONI" href="https://explorer.ooni.org/rss/global.xml" type="application/rss+xml" />
          <link rel="apple-touch-icon" sizes="180x180" href="/static/images/favicons/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192"  href="/static/images/favicons/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/images/favicons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/static/images/favicons/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/images/favicons/favicon-16x16.png" />

          <link rel="canonical" href="https://explorer.ooni.org/" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="OONI Explorer" />
          <meta name="twitter:site" content="@openobservatory" />
          <meta name="twitter:creator" content="@openobservatory" />

          <meta key="og:title" name='og:title' property='og:title' content='OONI Explorer - Open Data on Internet Censorship Worldwide' />
          <meta key="og:description" property="og:description" content={description} />
          <meta property='og:type' content='website' />

        </Head>
      </header>
    )
  }
}
