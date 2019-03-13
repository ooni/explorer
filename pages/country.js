/* global process */
import React from 'react'
import Head from 'next/head'

import axios from 'axios'

import {
  Container,
  Heading,
  Text, Hero,
  Flex, Box
} from 'ooni-components'

import { FormattedMessage } from 'react-intl'

import NavBar from '../components/nav-bar'
import Flag from '../components/flag'
import Layout from '../components/Layout'
import { toCompactNumberUnit } from '../utils'
import Sidebar from '../components/country/sidebar'
import Overview from '../components/country/overview'
import WebsitesSection from '../components/country/websites'
import AppsSection from '../components/country/apps'
import NetworkPropertiesSection from '../components/country/network-properties'

import { VictoryPie } from 'victory'

import countryUtil from 'country-util'

const Stat = ({label, valueWithUnit}) => {
  return <div>
    <Heading h={5}>{label}</Heading>
    <Text>{valueWithUnit.value} {valueWithUnit.unit}</Text>
  </div>
}

export default class Country extends React.Component {
  static async getInitialProps ({ query }) {
    const { countryCode } = query
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    let results = await Promise.all([
      // XXX cc @darkk we should ideally have better dedicated daily dumps for this view
      client.get('/api/_/measurement_count_by_country'),
      client.get('/api/_/blockpages', {params: {'probe_cc': countryCode}})
    ])
    let measurementCount = results[0].data.results.filter(d => d.probe_cc === countryCode)
    if (measurementCount.length === 0) {
      measurementCount = 0
    } else {
      measurementCount = measurementCount[0].count
    }
    // XXX this is currently just to show something in the UI
    let asnCount = 42
    const unique = (value, index, self) => self.indexOf(value) === index
    let blockedWebsites = results[1].data.results.map(d => d.input).filter(unique)

    //https://api.ooni.io/api/_/measurement_count_by_country
    //https://api.ooni.io/api/_/blockpages?probe_cc=IT
    return {
      measurementCount,
      asnCount,
      blockedWebsites,
      countryCode,
      countryName: countryUtil.territoryNames[countryCode]
    }
  }

  render () {
    const {
      measurementCount,
      asnCount,
      blockedWebsites,
      countryCode,
      countryName
    } = this.props

    return (
      <Layout>
        <Head>
          <title>Internet Censorship in {countryName} - OONI Explorer</title>
        </Head>
        <NavBar />
        <Hero>
          <Flex alignItems='center' pt={5} pb={4}>
            <Box width={1/4}>
            </Box>
            <Box>
              <Flag countryCode={countryCode} />
            </Box>
            <Box ml={3}>
              <Heading fontSize={4}>{countryName}</Heading>
            </Box>
          </Flex>
        </Hero>
        <Container>
          <Flex flexWrap='flex' mt={4}>
            <Box width={1/4}>
              <Sidebar />
            </Box>
            <Box width={3/4}>
              <Overview />
              <WebsitesSection />
              <AppsSection />
              <NetworkPropertiesSection />
            </Box>
          </Flex>
        </Container>
      </Layout>
    )
  }
}
