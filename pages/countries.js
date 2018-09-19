import React from 'react'
import Head from 'next/head'
import NLink from 'next/link'

import styled from 'styled-components'

import {
  Flex, Box,
  Container,
  Link,
  Heading,
  Text
} from 'ooni-components'

import Flag from '../components/flag'
import Layout from '../components/layout'
import NavBar from '../components/nav-bar'

import countryUtil from 'country-util'

const CountryLink = styled(Link)`
  color: ${props => props.theme.colors.black};
  text-decoration: none;
  text-align: center;
  &:hover {
    color: ${props => props.theme.colors.blue5};
  }
`

const CountryBlock = ({countryCode}) => {
  const href = `/country/${countryCode}`
  return (
    <Box width={1/6} pb={3}>
      <NLink href={href}>
        <CountryLink href={href}>
          <Flex justifyContent='center'>
            <Flag center border countryCode={countryCode} />
          </Flex>
          <Text pt={2}>{countryUtil.territoryNames[countryCode]}</Text>
        </CountryLink>
      </NLink>
    </Box>
  )
}
const RegionBlock = ({regionCode}) => {
  const regionName = countryUtil.territoryNames[regionCode]
  return <div>
    <Heading h={1} id={regionName} center pb={2}>{regionName}</Heading>

    <Flex flexWrap='wrap' pb={5}>
      {countryUtil.regions[regionCode].countries.map((countryCode) =>
        <CountryBlock key={countryCode} countryCode={countryCode} />
      )}
    </Flex>
  </div>
}

const JumpToContainer = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: white;
`

const JumpToLink = styled.a`
  color: ${props => props.theme.colors.blue5};
  text-decoration: none;
  padding-right: 30px
`

export default class Countries extends React.Component {
  render () {

    return (
      <Layout>
        <Head>
          <title>Internet Censorship around the world - OONI Explorer</title>
        </Head>

        <NavBar />

        <JumpToContainer>
          <Container>
            <Text color='gray6' pb={2}>Jump to continent:</Text>
            <JumpToLink href="#Africa">Africa</JumpToLink>
            <JumpToLink href="#Americas">Americas</JumpToLink>
            <JumpToLink href="#Asia">Asia</JumpToLink>
            <JumpToLink href="#Europe">Europe</JumpToLink>
            <JumpToLink href="#Antartica">Antarctica</JumpToLink>
          </Container>
        </JumpToContainer>

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
