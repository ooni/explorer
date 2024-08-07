import axios from 'axios'
import Flag from 'components/Flag'
import { StyledStickySubMenu } from 'components/SharedStyledComponents'
import ThirdPartyDataChart from 'components/ThirdPartyDataChart'
import Form from 'components/as/Form'
import AppsSection from 'components/country/Apps'
import { CountryContextProvider } from 'components/country/CountryContext'
import CountryHead from 'components/country/CountryHead'
import Overview from 'components/country/Overview'
import PageNavMenu from 'components/country/PageNavMenu'
import WebsitesSection from 'components/country/Websites'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import useScrollPosition from '/hooks/useScrollPosition'
import { getLocalisedRegionName } from '/utils/i18nCountries'

const Header = ({ countryCode, countryName }) => {
  const scrollPosition = useScrollPosition()
  const miniHeader = scrollPosition >= 150

  return (
    <div
      className={`flex transition-all duration-500 ease-in-out items-center flex-wrap ${miniHeader ? 'py-0' : 'py-4'}`}
    >
      <Flag countryCode={countryCode} size={miniHeader ? 32 : 60} />
      <div className="ml-4 mr-auto">
        <h1
          className={`flex transition-all duration-500 ease-in-out ${miniHeader ? 'text-2xl' : 'text-4xl'}`}
        >
          {countryName}
        </h1>
      </div>
      <PageNavMenu countryCode={countryCode} />
    </div>
  )
}

const CountryDetails = ({
  countryCode,
  overviewStats,
  reports,
  coverageDataSSR,
}) => {
  const intl = useIntl()
  const countryName = getLocalisedRegionName(countryCode, intl.locale)
  const [newData, setNewData] = useState(false)
  const router = useRouter()
  const { query } = router

  const { since, until } = useMemo(() => {
    const today = dayjs.utc().add(1, 'day')
    const monthAgo = dayjs.utc(today).subtract(1, 'month')

    return {
      since: dayjs(query.since, 'YYYY-MM-DD', true).isValid()
        ? query.since
        : monthAgo.format('YYYY-MM-DD'),
      until: dayjs(query.until, 'YYYY-MM-DD', true).isValid()
        ? query.until
        : today.format('YYYY-MM-DD'),
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

  const fetchTestCoverageData = useCallback(
    (testGroupList) => {
      const fetcher = async (testGroupList) => {
        const client = axios.create({
          baseURL: process.env.NEXT_PUBLIC_OONI_API,
        }) // eslint-disable-line
        const result = await client.get('/api/_/test_coverage', {
          params: {
            probe_cc: countryCode,
            test_groups: testGroupList,
          },
        })
        // TODO: Use React.createContext to pass along data and methods
        setNewData({
          networkCoverage: result.data.network_coverage,
          testCoverage: result.data.test_coverage,
        })
      }
      fetcher(testGroupList)
    },
    [countryCode, setNewData],
  )

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

  const { testCoverage, networkCoverage } =
    newData !== false ? newData : coverageDataSSR

  return (
    <>
      <CountryHead
        countryName={countryName}
        measurementCount={overviewStats.measurement_count}
        measuredSince={overviewStats.first_bucket_date}
        networkCount={overviewStats.network_count}
      />
      <StyledStickySubMenu>
        <div className="container">
          <Header countryCode={countryCode} countryName={countryName} />
        </div>
      </StyledStickySubMenu>
      <div className="container mt-8">
        <div>
          <CountryContextProvider
            countryCode={countryCode}
            countryName={countryName}
          >
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
        </div>
      </div>
    </>
  )
}

export default CountryDetails
