import React from 'react'
import Package from '../package'

import { Flex } from 'reflexbox'
import { NavItem, Toolbar } from 'rebass'

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
        <Toolbar className='main-nav'>
          <NavItem>
            <Link href='/world'><span>World</span></Link>
          </NavItem>
          <NavItem>
            <Link href='/explore'><span>Explore</span></Link>
          </NavItem>
          <NavItem>
            <Link href='/highlights'><span>Highlights</span></Link>
          </NavItem>
          <NavItem>
            <Link href='/about'><span>About</span></Link>
          </NavItem>
        </Toolbar>
      </header>
    )
  }
}
