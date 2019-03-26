import React from 'react'
import Head from 'next/head'
import NLink from 'next/link'
import axios from 'axios'
import styled from 'styled-components'
import { FormattedMessage, FormattedNumber } from 'react-intl'

import {
  Flex, Box,
  Container,
  Link,
  Heading,
} from 'ooni-components'
import { Text } from 'rebass'

import Flag from '../components/flag'
import Layout from '../components/Layout'
import NavBar from '../components/nav-bar'

import countryUtil from 'country-util'

const CountryLink = styled(Link)`
  color: ${props => props.theme.colors.black};
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.colors.blue5};
  }
`

const CountryBlock = ({countryCode, msmtCount}) => {
  const href = `/country/${countryCode}`
  return (
    <Box width={[1/2, 1/4]} my={5}>
      <NLink href={href}>
        <CountryLink href={href}>
          <Flex flexDirection='column'>
            <Flag center border countryCode={countryCode} size={48} />
            <Text py={2} fontSize={24} style={{height: '80px'}}>{countryUtil.territoryNames[countryCode]}</Text>
            <Flex alignItems='center'>
              <Text mr={2} fontSize={20} fontWeight={600} color='blue9'><FormattedNumber value={msmtCount} /></Text>
              <Text>Measurments</Text>
            </Flex>
          </Flex>
        </CountryLink>
      </NLink>
    </Box>
  )
}

const RegionBlock = ({regionCode, countries}) => {
  const regionName = countryUtil.territoryNames[regionCode]
  // Select countries in the region where we have measuremennts from
  const measuredCountriesInRegion = countryUtil.regions[regionCode].countries.filter((countryCode) => (
    countries.find((item) => item.alpha_2 === countryCode)
  ))

  // When there are no measurements from the region
  if (measuredCountriesInRegion.length === 0) {
    return null
  }

  return (
    <Box my={3}>
      <Heading h={1} id={regionName} center py={2}>{regionName}</Heading>

      <Flex flexWrap='wrap' py={4}>
        {countries
          .filter((c => ( measuredCountriesInRegion.indexOf(c.alpha_2) > 0 )))
          .map((country, index) => (
            <CountryBlock key={index} countryCode={country.alpha_2} msmtCount={country.count} />
          ))
        }
      </Flex>
    </Box>
  )
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
  static async getInitialProps () {
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const result = await client.get('/api/_/countries')
    return {
      countries: result.data.countries
    }
  }

  render () {
    const { countries } = this.props
    // Africa Americas Asia Europe Oceania Antarctica
    const regions = ['002', '019', '142', '150', '009', 'AQ']

    return (
      <Layout>
        <Head>
          <title>Internet Censorship around the world - OONI Explorer</title>
        </Head>

        <NavBar />

        <JumpToContainer>
          <Container>
            <Text fontWeight='bold' pb={2}><FormattedMessage id='Countries.Heading.JumpToContinent' />:</Text>
            <JumpToLink href="#Africa">Africa</JumpToLink>
            <JumpToLink href="#Americas">Americas</JumpToLink>
            <JumpToLink href="#Asia">Asia</JumpToLink>
            <JumpToLink href="#Europe">Europe</JumpToLink>
            <JumpToLink href="#Antartica">Antarctica</JumpToLink>
          </Container>
        </JumpToContainer>

        <Container>
          {
            regions.map((regionCode, index) => (
              <RegionBlock key={index} regionCode={regionCode} countries={countries} />
            ))
          }
        </Container>
      </Layout>
    )
  }

}
