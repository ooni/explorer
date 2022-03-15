/* global process */
import React, { useCallback, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Heading,
  Flex, Box
} from 'ooni-components'
import countryUtil from 'country-util'
import styled from 'styled-components'
import { StickyContainer, Sticky } from 'react-sticky'

import NavBar from '../../components/NavBar'
import Flag from '../../components/Flag'
import PageNavMenu from '../../components/country/PageNavMenu'
import Overview from '../../components/country/Overview'
import WebsitesSection from '../../components/country/Websites'
import AppsSection from '../../components/country/Apps'
// import NetworkPropertiesSection from '../../components/country/NetworkProperties'
import { CountryContextProvider } from '../../components/country/CountryContext'
import CountryHead from '../../components/country/CountryHead'

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
export async function getServerSideProps ({ res, query }) {
  const { countryCode } = query
  if (res && (countryCode !== countryCode.toUpperCase())) {
    res.writeHead(301, {
      Location: `/country/${countryCode.toUpperCase()}`
    })

    res.end()
  }


  let client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL}) // eslint-disable-line
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
    props: {
      testCoverage,
      networkCoverage,
      overviewStats,
      reports,
      countryCode,
      countryName: countryUtil.territoryNames[countryCode]
    }
  }
}



const Country = ({ countryCode, countryName, overviewStats, reports, ...coverageDataSSR }) => {
  const [newData, setNewData] = useState(false)

  const fetchTestCoverageData = useCallback((testGroupList) => {
    console.log(testGroupList)
    const fetcher = async (testGroupList) => {
      let client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL}) // eslint-disable-line
      const result = await client.get('/api/_/test_coverage', {
        params: {
          'probe_cc': countryCode,
          'test_groups': testGroupList
        }
      })
      // TODO: Use React.createContext to pass along data and methods
      setNewData({
        networkCoverage: result.data.network_coverage,
        testCoverage: result.data.test_coverage
      })
    }
    fetcher(testGroupList)
    
  }, [countryCode, setNewData])

  const { testCoverage, networkCoverage } = newData !== false ? newData : coverageDataSSR

  return (
    <React.Fragment>
      <CountryHead countryName={countryName} measurementCount={overviewStats.measurement_count} measuredSince={overviewStats.first_bucket_date} networkCount={overviewStats.network_count} />
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
                      <AnimatedHeading h={1} fontWeight='heading' fontSize={miniHeader ? 2 : 4}>
                        {countryName}
                      </AnimatedHeading>
                    </Box>
                    <PageNavMenu countryCode={countryCode}/>
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
                  fetchTestCoverageData={fetchTestCoverageData}
                  featuredArticles={reports}
                />
                <WebsitesSection />
                <AppsSection />
              </CountryContextProvider>
            </Box>
          </Flex>
        </Container>
      </StickyContainer>
    </React.Fragment>
  )
}

export default Country