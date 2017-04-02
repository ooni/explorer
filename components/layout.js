import React from 'react'

import Link from 'next/link'
import Head from 'next/head'

export default class extends React.Component {

  static propTypes = {
    children: React.PropTypes.object.isRequired
  }

  render () {
    return (
      <div>
        <Head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        </Head>
        <header>
          <nav>
            <Link href='/world'><a>World</a></Link> |
            <Link href='/explorer'><a>Explorer</a></Link> |
            <Link href='/highlights'><a>Highlights</a></Link>
            <Link href='/about'><a>About</a></Link>
          </nav>
        </header>
        <div>
          { this.props.children }
        </div>
        <footer>
          Foo
        </footer>
      </div>
    )
  }
}
