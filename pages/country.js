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
import styled from 'styled-components'
import { StickyContainer, Sticky } from 'react-sticky'

import NavBar from '../components/NavBar'
import Flag from '../components/Flag'
import Layout from '../components/Layout'
import PageNavMenu from '../components/country/PageNavMenu'
import Overview from '../components/country/Overview'
import WebsitesSection from '../components/country/Websites'
import AppsSection from '../components/country/Apps'
import NetworkPropertiesSection from '../components/country/NetworkProperties'
import { CountryContextProvider } from '../components/country/CountryContext'
import { useIntl } from 'react-intl'

const getCountryReports = (countryCode, data) => {
  const reports = data.filter((article) => (
    article.tags && article.tags.indexOf(`country-${countryCode.toLowerCase()}`) > -1
  )).map((article) => (
    article
  ))
  return reports
}
const RaisedHeader = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.gray3};
  background-color: white;
  z-index: 100;
`

const AnimatedFlex = styled(Flex)`
  transition: all 0.5s ease;
`

const AnimatedHeading = styled(Heading)`
  transition: all 0.5s ease;
`
const IntlHead = ({
  countryName,
  measurementCount,
  measuredSince,
  networkCount
}) => {
  const intl = useIntl()
  return (
    <Head>
      <title>Internet Censorship in {countryName} - OONI Explorer</title>
      <meta
        key="og:title"
        property="og:title"
        content={intl.formatMessage(
          {
            id: 'Country.Overview.MetaTitle',
            defaultMessage: 'Internet Censorship in {countryName} - OONI Explorer'
          },
          {
            countryName
          }
        )}
      />
      <meta
        key="og:description"
        property="og:description"
        content={intl.formatMessage(
          {
            id: 'Country.Overview.MetaDescription',
            defaultMessage:
            'Since {startDate}, OONI Probe users in {countryName} have collected {measurementCount} measurements from {networkCount} local networks. Explore the data on OONI Explorer'
          },
          {
            measurementCount: intl.formatNumber(measurementCount),
            countryName,
            startDate: intl.formatDate(measuredSince),
            networkCount: intl.formatNumber(networkCount)
          }
        )}
      />
    </Head>
  )
}

export default class Country extends React.Component {
  static async getInitialProps ({ req, res, query }) {
    const { countryCode } = query

    if (res && (countryCode !== countryCode.toUpperCase())) {
      res.writeHead(301, {
        Location: `/country/${countryCode.toUpperCase()}`
      })

      res.end()
      return {}
    }


    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    let results = await Promise.all([
      // XXX cc @darkk we should ideally have better dedicated daily dumps for this view
      client.get('/api/_/test_coverage', {params: {'probe_cc': countryCode}}),
      client.get('/api/_/country_overview', { params: {'probe_cc': countryCode}}),
      client.get('https://ooni.org/pageindex.json')
    ])

    const testCoverage = results[0].data.test_coverage
    const networkCoverage = results[0].data.network_coverage
    const overviewStats = results[1].data
    const reports = getCountryReports(countryCode, results[2].data)

    return {
      testCoverage,
      networkCoverage,
      overviewStats,
      reports,
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
      overviewStats,
      reports,
    } = this.props

    const { testCoverage, networkCoverage } = this.state.newData ? this.state.newData : this.props

    return (
      <Layout>
        <IntlHead countryName={countryName} measurementCount={overviewStats.network_count} measuredSince={overviewStats.first_bucket_date} networkCount={overviewStats.network_count} />
        <StickyContainer>
          <Sticky>
            {({ style, distanceFromTop }) => {
              let miniHeader = false
              if (distanceFromTop < -150) {
                miniHeader = true
              }
              return (
                <RaisedHeader style={style}>
                  <NavBar />
                  <Container>
                    <AnimatedFlex alignItems='center' py={ miniHeader ? 0 : 4} flexWrap='wrap'>
                      <Box>
                        <Flag countryCode={countryCode} size={miniHeader ? 32: 60} />
                      </Box>
                      <Box ml={3} mr='auto'>
                        <AnimatedHeading fontSize={miniHeader ? 2 : 4}>
                          {countryName}
                        </AnimatedHeading>
                      </Box>
                      <PageNavMenu />
                    </AnimatedFlex>
                  </Container>
                </RaisedHeader>
              )
            }}
          </Sticky>
          <Container>
            <Flex flexWrap='wrap' mt={4}>
              <Box>
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
                    featuredArticles={reports}
                  />
                  <WebsitesSection />
                  <AppsSection />
                  <NetworkPropertiesSection countryCode={countryCode} />
                </CountryContextProvider>
              </Box>
            </Flex>
          </Container>
        </StickyContainer>
      </Layout>
    )
  }
}

