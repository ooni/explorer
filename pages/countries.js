import React from 'react'
import Head from 'next/head'
import NLink from 'next/link'
import Router from 'next/router'

import styled from 'styled-components'

import {
  Flex, Grid, Box,
  Divider,
  Container,
  Button,
  ButtonOutline,
  Input,
  Select,
  Panel,
  PanelHeader,
  Text,
  InlineForm,
  Label,
  Link,
  Heading
} from 'ooni-components'

import Flag from '../components/flag'
import Layout from '../components/layout'
import NavBar from '../components/NavBar'

import countryUtil from 'country-util'

const CountryBlockContent = styled.div`
  text-align: center;
`

const CountryBlock = ({countryCode}) => {
  return (
    <Box w={1/6} pb={3}>
    <CountryBlockContent>
      <Flag center border countryCode={countryCode} />
      <Heading h={6}>{countryUtil.territoryNames[countryCode]}</Heading>
    </CountryBlockContent>
    </Box>
  )
}
const RegionBlock = ({regionCode}) => {
  return <div>
  <Heading h={1}>{countryUtil.territoryNames[regionCode]}</Heading>

  <Flex wrap>
  {countryUtil.regions[regionCode].countries.map((countryCode) =>
    <CountryBlock countryCode={countryCode} />
  )}
  </Flex>
  </div>
}

export default class extends React.Component {
  render () {
    const navItems = [
      {
        label: 'Search',
        href: '/search',
        active: false
      },
      {
        label: 'Results',
        href: '/results',
        active: false
      },
      {
        label: 'Countries',
        href: '/countries',
        active: true
      },
      {
        label: 'About',
        href: '/about',
        active: false
      },
    ]

    return (
      <Layout>
        <Head>
          <title>Internet Censorship around the world - OONI Explorer</title>
        </Head>

        <NavBar items={navItems} />

        <Container>
          {/* Africa */}
          <RegionBlock regionCode='002' />
          {/* Americas */}
          <RegionBlock regionCode='019' />
          {/* Asia */}
          <RegionBlock regionCode='142' />
          {/* Europe */}
          <RegionBlock regionCode='150' />
          {/* Oceania */}
          <RegionBlock regionCode='009' />
          {/* Antarctica */}
          <RegionBlock regionCode='AQ' />
        </Container>
      </Layout>
    )
  }

}
