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
import countryUtil from 'country-util'

import NavBar from '../components/nav-bar'
import Flag from '../components/flag'
import Layout from '../components/Layout'
import Sidebar from '../components/country/sidebar'
import Overview from '../components/country/overview'
import WebsitesSection from '../components/country/websites'
import AppsSection from '../components/country/apps'
import NetworkPropertiesSection from '../components/country/network-properties'
import { CountryContextProvider } from '../components/country/country-context'

export default class Country extends React.Component {
  static async getInitialProps ({ query }) {
    const { countryCode } = query
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    let results = await Promise.all([
      // XXX cc @darkk we should ideally have better dedicated daily dumps for this view
      client.get('/api/_/test_coverage', {params: {'probe_cc': countryCode}}),
      client.get('/api/_/country_overview', { params: {'probe_cc': countryCode}})
    ])

    const testCoverage = results[0].data.test_coverage
    const networkCoverage = results[0].data.network_coverage
    const overviewStats = results[1].data

    return {
      testCoverage,
      networkCoverage,
      overviewStats,
      countryCode,
      countryName: countryUtil.territoryNames[countryCode]
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      newData: false
    }
    this.fetchTestCoverageData = this.fetchTestCoverageData.bind(this)
  }

  async fetchTestCoverageData(testGroupList) {
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const result = await client.get('/api/_/test_coverage', {
      params: {
        'probe_cc': this.props.countryCode,
        'test_groups': testGroupList
      }
    })
    // TODO: Use React.createContext to pass along data and methods
    this.setState({
      newData : {
        networkCoverage: result.data.network_coverage,
        testCoverage: result.data.test_coverage
      }
    })
  }

  render () {
    const {
      countryCode,
      countryName,
      overviewStats
    } = this.props

    const { testCoverage, networkCoverage } = this.state.newData ? this.state.newData : this.props

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
            <Box width={[1, 1/4]}>
              <Sidebar />
            </Box>
            <Box width={[1, 3/4]}>
              <CountryContextProvider countryCode={countryCode} countryName={countryName}>
                <Overview
                  countryName={countryName}
                  middleboxCount={overviewStats.middlebox_detected_networks}
                  imCount={overviewStats.im_apps_blocked}
                  circumventionTools={overviewStats.circumvention_tools_blocked}
                  blockedWebsitesCount={overviewStats.websites_confirmed_blocked}
                  networkCount={overviewStats.network_count}
                  measurementCount={overviewStats.measurement_count}
                  measuredSince={overviewStats.first_bucket_date}
                  testCoverage={testCoverage}
                  networkCoverage={networkCoverage}
                  fetchTestCoverageData={this.fetchTestCoverageData}
                  // featuredArticles={[{title: 'Title', link: 'https://ooni.nu'}]}
                />
                <WebsitesSection />
                <AppsSection />
                <NetworkPropertiesSection countryCode={countryCode} />
              </CountryContextProvider>
            </Box>
          </Flex>
        </Container>
      </Layout>
    )
  }
}
