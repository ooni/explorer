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
import { CountryContextProvider } from '../components/country/country-context'

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
      client.get('/api/_/test_coverage', {params: {'probe_cc': countryCode}})
    ])

    const testCoverage = results[0].data.test_coverage
    const networkCoverage = results[0].data.network_coverage

    return {
      testCoverage,
      networkCoverage,
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
      countryName
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
            <Box width={1/4}>
              <Sidebar />
            </Box>
            <Box width={3/4}>
              <CountryContextProvider countryCode={countryCode} countryName={countryName}>
                <Overview
                  testCoverage={testCoverage}
                  networkCoverage={networkCoverage}
                  fetchTestCoverageData={this.fetchTestCoverageData}
                />
                <WebsitesSection />
                <AppsSection />
                <NetworkPropertiesSection />
              </CountryContextProvider>
            </Box>
          </Flex>
        </Container>
      </Layout>
    )
  }
}
