import { useCallback, useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import {
  Container,
  Heading,
  Flex, Box
} from 'ooni-components'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { getLocalisedRegionName } from '/utils/i18nCountries'
import dayjs from 'services/dayjs'

import Form from 'components/as/Form'
import NavBar from 'components/NavBar'
import Flag from 'components/Flag'
import PageNavMenu from 'components/country/PageNavMenu'
import Overview from 'components/country/Overview'
import WebsitesSection from 'components/country/Websites'
import AppsSection from 'components/country/Apps'
import { CountryContextProvider } from 'components/country/CountryContext'
import CountryHead from 'components/country/CountryHead'
import ThirdPartyDataChart from 'components/ThirdPartyDataChart'
import useScrollPosition from '/hooks/useScrollPosition'
import { StyledStickyNavBar, StyledStickySubMenu } from 'components/SharedStyledComponents'

const getCountryReports = (countryCode, data) => {
  const reports = data.filter((article) => (
    article.tags && article.tags.indexOf(`country-${countryCode.toLowerCase()}`) > -1
  )).map((article) => (
    article
  ))
  return reports
}

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
  const { query } = router

  const scrollPosition = useScrollPosition()
  const miniHeader = scrollPosition >= 150 ? true : false

  const { since, until } = useMemo(() => {
    const today = dayjs.utc().add(1, 'day')
    const monthAgo = dayjs.utc(today).subtract(1, 'month')

    return { 
      since: dayjs(query.since, 'YYYY-MM-DD', true).isValid() ? query.since : monthAgo.format('YYYY-MM-DD'),
      until: dayjs(query.until, 'YYYY-MM-DD', true).isValid() ? query.until : today.format('YYYY-MM-DD')
    }
  }, [query])

  useEffect(() => {
    if (query.since !== since || query.until !== until) {
      const href = {
        pathname: router.pathname,
        query: {
          since,
          until,
          countryCode,
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

    if (query.since !== since || query.until !== until) {
      router.push(href, href, { shallow: true })
    }
  }

  const { testCoverage, networkCoverage } = newData !== false ? newData : coverageDataSSR

  return (
    <>
      <CountryHead countryName={countryName} measurementCount={overviewStats.measurement_count} measuredSince={overviewStats.first_bucket_date} networkCount={overviewStats.network_count} />

      <StyledStickyNavBar>
        <NavBar />
      </StyledStickyNavBar>
      <StyledStickySubMenu>
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
      </StyledStickySubMenu>

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
              <Form onSubmit={onSubmit} since={since} until={until} />
              <WebsitesSection countryCode={countryCode} />
              <AppsSection />
            </CountryContextProvider>
            <ThirdPartyDataChart
              country={countryCode}
              since={since}
              until={until}
            />
          </Box>
        </Flex>
      </Container>
    </>
  )
}

export default Country
