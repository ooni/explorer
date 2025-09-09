import axios from 'axios'
import ErrorPage from 'pages/_error'
import { getReports } from '../../lib/api'
import Flag from 'components/Flag'
import { StickySubMenu } from 'components/SharedStyledComponents'
import ThirdPartyDataChart, {
  SectionText,
} from 'components/ThirdPartyDataChart'
import Form from 'components/as/Form'
import AppsSection from 'components/country/Apps'
import { CountryContextProvider } from 'components/country/CountryContext'
import CountryHead from 'components/country/CountryHead'
import Overview from 'components/country/Overview'
import WebsitesSection from 'components/country/Websites'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import { getLocalisedRegionName } from '/utils/i18nCountries'
import { RegionLink } from '../../pages/countries'
import { StyledStickySubMenu } from '../../components/SharedStyledComponents'
import RecentMeasurements from '../../components/RecentMeasurements'
import useFindings from '../../hooks/useFindings'

export async function getServerSideProps({ res, query }) {
  const { countryCode } = query
  if (countryCode.length > 2) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    }
  }

  if (res && countryCode !== countryCode.toUpperCase()) {
    res.writeHead(301, {
      Location: `/country/${countryCode.toUpperCase()}`,
    })

    res.end()
  }

  try {
    const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
    const results = await Promise.all([
      client.get('/api/_/country_overview', {
        params: { probe_cc: countryCode },
      }),
    ])

    const overviewStats = results[0].data
    const reports = await getReports(`country-${countryCode.toLowerCase()}`)

    return {
      props: {
        overviewStats,
        reports,
        countryCode,
      },
    }
  } catch (error) {
    return {
      props: {
        error: JSON.stringify(error?.message),
      },
    }
  }
}

const Country = ({ countryCode, overviewStats, reports, error }) => {
  const intl = useIntl()
  const countryName = getLocalisedRegionName(countryCode, intl.locale)
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

  return (
    <>
      {error ? (
        <ErrorPage statusCode={501} error={error} />
      ) : (
        <>
          <CountryHead
            countryName={countryName}
            measurementCount={overviewStats.measurement_count}
            measuredSince={overviewStats.first_bucket_date}
            networkCount={overviewStats.network_count}
          />
          <div className="container">
            <StickySubMenu
              title={
                <div className="flex flex-row items-center gap-3">
                  <Flag countryCode={countryCode} size={38} />
                  <h1>{countryName}</h1>
                </div>
              }
            >
              <div className="flex flex-col md:flex-row justify-center py-1">
                <RegionLink
                  href="#overview"
                  label={intl.formatMessage({ id: 'Country.Heading.Overview' })}
                />

                <RegionLink
                  href="#findings"
                  label={intl.formatMessage({ id: 'Navbar.Findings' })}
                />

                <RegionLink
                  href="#reports"
                  label={intl.formatMessage({
                    id: 'ThematicPage.NavBar.Reports',
                  })}
                />

                <RegionLink
                  href="#websites"
                  label={intl.formatMessage({ id: 'Country.Heading.Websites' })}
                />

                <RegionLink
                  href="#apps"
                  label={intl.formatMessage({ id: 'Country.Heading.Apps' })}
                />

                <RegionLink
                  href="#outages"
                  label={intl.formatMessage({ id: 'Country.Heading.Outages' })}
                />
              </div>
            </StickySubMenu>

            <div>
              <CountryContextProvider
                countryCode={countryCode}
                countryName={countryName}
              >
                <Overview
                  countryName={countryName}
                  networkCount={overviewStats.network_count}
                  measurementCount={overviewStats.measurement_count}
                  measuredSince={overviewStats.first_bucket_date}
                  featuredArticles={reports}
                />
                <div>
                  {/* we want sticky header only while scrolling over the charts */}
                  <StyledStickySubMenu className="top-[139px] max-sm:static z-10">
                    <div className="py-2">
                      <Form onSubmit={onSubmit} since={since} until={until} />
                    </div>
                  </StyledStickySubMenu>
                  <WebsitesSection countryCode={countryCode} />
                  <AppsSection />
                  <div
                    id="outages"
                    className="h-[200px] mt-[-200px] md:h-[200px] md:mt-[-200px]"
                  />
                  <h2 className="mt-12">
                    {intl.formatMessage({ id: 'Country.Outages' })}
                  </h2>
                  <div className="mt-2 bg-gray-50 px-4 py-2 text-sm">
                    <SectionText
                      country={countryCode}
                      from={since}
                      until={until}
                    />
                  </div>
                  <ThirdPartyDataChart
                    country={countryCode}
                    since={since}
                    until={until}
                  />
                </div>
              </CountryContextProvider>

              <RecentMeasurements query={{ probe_cc: countryCode }} />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Country
