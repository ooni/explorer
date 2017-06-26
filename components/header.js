import React from 'react'
import Package from '../package'

import { Flex, Box } from 'reflexbox'
import { NavItem, Toolbar } from 'rebass'

import { colors } from './layout'

import NavMenu from './navmenu'

import Link from 'next/link'
import Head from 'next/head'

export default class extends React.Component {
  render() {
    const {
      hideHeader
    } = this.props

    return (
      <header>
        <Head>
          <meta charset='utf-8'/>
          <meta name='viewport' content='initial-scale=1.0, width=device-width'/>
        </Head>
        {!hideHeader && <div className='headerNav'>
          <Flex align="center" justify='space-around' w={1}>
          <Box p={2} w={1/2} mr='auto'>
            <div className="explorer-logo">
              <Link href="/">
              <a><img src="/_/static/ooni-explorer-logo.svg" /></a>
              </Link>
            </div>
          </Box>
          <Box p={2} w={1/2} ml='auto'>
            <NavMenu />
          </Box>
        </Flex>
        </div>}
        <style jsx>{`
          .headerNav {
            background-color: ${ colors.offBlack };
          }
        `}</style>
      </header>
    )
  }
}
