/* global process */
import React, { useCallback, useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import {
  Container,
  Heading,
  Flex, Box
} from 'ooni-components'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { StickyContainer, Sticky } from 'react-sticky'
import { getLocalisedRegionName } from '../../utils/i18nCountries'
import dayjs from 'services/dayjs'
import { ResponsiveLine } from '@nivo/line'

import Form from 'components/network/Form'
import NavBar from 'components/NavBar'
import Flag from 'components/Flag'
import PageNavMenu from 'components/country/PageNavMenu'
import Overview from 'components/country/Overview'
import WebsitesSection from 'components/country/Websites'
import AppsSection from 'components/country/Apps'
import { CountryContextProvider } from 'components/country/CountryContext'
import CountryHead from 'components/country/CountryHead'

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


  let client = axios.create({baseURL: process.env.NEXT_PUBLIC_OONI_API}) // eslint-disable-line
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
    }
  }
}

const Country = ({ countryCode, overviewStats, reports, ...coverageDataSSR }) => {
  const intl = useIntl()
  const countryName = getLocalisedRegionName(countryCode, intl.locale)
  const [newData, setNewData] = useState(false)
  const router = useRouter()
  const query = router.query

  useEffect(() => {
    if (Object.keys(query).length === 1) {
      const today = dayjs.utc().add(1, 'day')
      const monthAgo = dayjs.utc(today).subtract(1, 'month')
      const href = {
        pathname: router.pathname,
        query: {
          since: monthAgo.format('YYYY-MM-DD'),
          until: today.format('YYYY-MM-DD'),
          countryCode
        },
      }
      router.replace(href, undefined, { shallow: true })
    }
  }, [])

  const fetchTestCoverageData = useCallback((testGroupList) => {
    const fetcher = async (testGroupList) => {
      let client = axios.create({baseURL: process.env.NEXT_PUBLIC_OONI_API}) // eslint-disable-line
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

  // Sync page URL params with changes from form values
  const onSubmit = ({ since, until }) => {
    const params = {
      since,
      until,
    }

    const href = {
      pathname: router.pathname.replace('[countryCode]', countryCode),
      query: params,
    }

    if (query.since !== since
      || query.until !== until
    ) {
      router.push(href, href, { shallow: true })
    }
  }

  const { testCoverage, networkCoverage } = newData !== false ? newData : coverageDataSSR

  const [graphData, setGraphData] = useState([])

  const cloudflareData = useEffect(() => {
    if (query.until && query.until) {
      const to = dayjs.utc(query.until)
      const from = dayjs.utc(query.since)

      axios({
        method: 'get',
        url: `/api/cloudflare?from=${from.toISOString().split('.')[0]+'Z'}&to=${to.toISOString().split('.')[0]+'Z'}&country=${countryCode}`,
        baseURL: 'http://localhost:3100',
      }).then(({data}) => {
        const ruData = data.result.all.timestamps.map((st, i) => {
          return {
            'x': st,
            'y': Number(data.result.all.values[i])
          }
        })
        setGraphData((oldVal) => {
          return [...oldVal, {
            'id': 'Cloudflare',
            // 'color': 'hsl(0, 100%, 50%)',
            'data': ruData,
          }]
        })
      }).catch(() => {})
  
      axios({
          method: 'get',
          url: `https://api.ioda.inetintel.cc.gatech.edu/v2/signals/raw/country/${countryCode}?from=${Math.round(from.valueOf()/1000)}&until=${Math.round(to.valueOf()/1000)}&sourceParams=WEB_SEARCH`,
      }).then(({data}) => {
        const graphData2 = data.data[0].map((item) => {
          const max = Math.max(...item.values)
          const values = item.values.map((val, i) => {
            const time = dayjs(item.from * 1000).add(item.step * i, 'second').utc().toISOString().split('.')[0]+'Z'
            return {x: time, y: val ? val / max : null}
          })
          return {
            'id': item.datasource,
            // 'color': 'hsl(100, 70%, 50%)',
            'data': values
          }
        })
  
        setGraphData((oldVal) => {
          return [...oldVal, ...graphData2]
        })
      })
    }
  }, [])

  console.log('graphData', graphData)

  return (
    <>
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
                <Form onSubmit={onSubmit} query={query} />
                <WebsitesSection countryCode={countryCode} />
                <AppsSection />
              </CountryContextProvider>
            </Box>
            <Box style={{width: '100%',height: '500px'}}>
              {!!graphData.length && 
                  <ResponsiveLine
                  data={graphData}
                  margin={{ top: 50, right: 20, bottom: 70, left: 30 }}
                  enablePoints={false}
                  lineWidth={1}
                  xScale={{
                    type: 'time',
                    format: '%Y-%m-%dT%H:%M:%SZ',
                    precision: 'minute',
                    useUTC: true,
                  }}
                  yScale={{
                    type: 'linear',
                    stacked: false,
                    min: 0,
                    max: 1
                  }}
                  // xFormat="time:%Hh"
                  axisBottom={{
                    format: '%Y-%m-%d',
                  }}
                  



                  // data={graphData}
                  // curve="monotoneX"
                  // enableSlices='x'
                  // animate={true}
                  // margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                  // xScale={{ 
                  //   type: 'time',
                  //   format: '%Y-%m-%d',
                  //   useUTC: true,
                  //   precision: 'day',
                  // }}
                  // yScale={{
                  //     type: 'linear',
                  //     min: 'auto',
                  //     max: 'auto',
                  //     stacked: false,
                  //     reverse: false
                  // }}
                  // // yFormat=" >-.2f"
                  // // axisTop={null}
                  // // axisRight={null}
                  // axisBottom={{
                  //   format: '%Y-%m-%d',
                  //   orient: 'bottom',
                  //   tickSize: 5,
                  //   tickPadding: 5,
                  //   tickRotation: 0,
                  //   legend: 'date',
                  //   legendOffset: 36,
                  //   legendPosition: 'middle',
                  //   tickValues: 6
                  // }}
                  // axisLeft={{
                  //     orient: 'left',
                  //     tickSize: 5,
                  //     tickPadding: 5,
                  //     tickRotation: 0,
                  //     legend: 'count',
                  //     legendOffset: -40,
                  //     legendPosition: 'middle'
                  // }}
                  // pointSize={10}
                  // pointColor={{ theme: 'background' }}
                  // pointBorderWidth={2}
                  // pointBorderColor={{ from: 'serieColor' }}
                  // pointLabelYOffset={-12}
                  useMesh={true}
                  legends={[
                    {
                      anchor: 'bottom-left',
                      direction: 'row',
                      // justify: false,
                      // translateX: 100,
                      translateY: 70,
                      itemsSpacing: 0,
                      itemDirection: 'left-to-right',
                      itemWidth: 90,
                      itemHeight: 20,
                      // itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: 'circle',
                      symbolBorderColor: 'rgba(0, 0, 0, .5)',
                      // effects: [{
                      //   on: 'hover',
                      //   style: {
                      //     itemBackground: 'rgba(0, 0, 0, .03)',
                      //     itemOpacity: 1
                      //   }
                      // }]
                    }
                  ]}
                />
              }
            </Box>
          </Flex>
        </Container>
      </StickyContainer>
    </>
  )
}

export default Country
