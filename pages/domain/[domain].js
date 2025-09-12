import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import useSWR from 'swr'

import TestGroupBadge, { CategoryBadge } from 'components/Badge'
import BlockText from 'components/BlockText'
import Chart from 'components/Chart'
import Form from 'components/domain/Form'
import Flag from 'components/Flag'
import { StyledSticky } from 'components/SharedStyledComponents'
import { GridBox } from 'components/VirtualizedGrid'
import { simpleFetcher } from 'services/fetchers'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import { sortByKey } from '../../utils'
import RecentMeasurements from '../../components/RecentMeasurements'

const CountryList = ({ countries }) => {
  const intl = useIntl()

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {countries.map(([key, value]) => {
        return (
          <GridBox
            key={key}
            href={`/country/${key}`}
            title={
              <div className="flex mb-2 items-center">
                <div className="self-start">
                  <Flag countryCode={key} size={22} border />
                </div>
                <div className="font-bold ml-2">
                  {getLocalisedRegionName(key, intl.locale)}
                </div>
              </div>
            }
            multiCount={value}
          />
        )
      })}
    </div>
  )
}

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const ChartContainer = ({ domain, ...props }) => {
  const {
    query: { since, until, probe_cc },
  } = useRouter()

  const queryParams = useMemo(
    () => ({
      axis_x: 'measurement_start_day',
      axis_y: 'probe_cc',
      test_name: 'web_connectivity',
      domain,
      since,
      until,
      ...(probe_cc && { probe_cc }),
      time_grain: 'day',
    }),
    [domain, since, until, probe_cc],
  )

  return (
    <>
      <div className="mb-4">
        <TestGroupBadge testName="web_connectivity" />
      </div>
      <Chart queryParams={queryParams} {...props} />
    </>
  )
}

const BlockingCountries = ({ blockedCountries }) => {
  const intl = useIntl()
  const {
    query: { since, until, domain },
  } = useRouter()

  return (
    <>
      <h4 className="mt-8">
        {intl.formatMessage(
          { id: 'Domain.CountriesBlocking.Title' },
          { domain },
        )}
      </h4>
      <h5 className="mb-4">
        {intl.formatMessage(
          { id: 'Domain.CountriesBlocking.FromTo' },
          { since, until },
        )}
      </h5>
      {blockedCountries?.length ? (
        <>
          <BlockText className="mb-4">
            {intl.formatMessage({ id: 'Domain.CountriesBlocking.Subtitle' })}
          </BlockText>
          <CountryList countries={blockedCountries} />
        </>
      ) : (
        <>
          {intl.formatMessage(
            { id: 'Domain.CountriesBlocking.NoCountries' },
            { domain },
          )}
        </>
      )}
    </>
  )
}

const Canonical = ({ canonicalDomain }) => {
  const intl = useIntl()
  return (
    <BlockText className="mb-8">
      {intl.formatMessage(
        { id: 'Domain.Canonical' },
        {
          canonicalDomain: (
            <Link href={`/domain/${canonicalDomain}`}>{canonicalDomain}</Link>
          ),
        },
      )}
    </BlockText>
  )
}

const DomainDashboard = ({
  domain,
  categoryCode,
  canonicalDomain,
  countries,
}) => {
  const router = useRouter()
  const { query } = router
  const [testedCountries, setTestedCountries] = useState(null)
  const intl = useIntl()
  const title = `${intl.formatMessage({ id: 'General.OoniExplorer' })} | ${domain}`
  const hasCanonical = domain !== canonicalDomain

  const blockedCountries = useMemo(() => {
    if (testedCountries) {
      const countriesMap = testedCountries.reduce((accum, current) => {
        if (accum.get(current.probe_cc)) {
          const countryData = accum.get(current.probe_cc)

          accum.set(current.probe_cc, {
            confirmed_count:
              countryData.confirmed_count + current.confirmed_count,
            anomaly_count: countryData.anomaly_count + current.anomaly_count,
            ok_count: countryData.ok_count + current.ok_count,
          })
        } else {
          accum.set(current.probe_cc, {
            confirmed_count: current.confirmed_count,
            anomaly_count: current.anomaly_count,
            ok_count: current.ok_count,
          })
        }
        return accum
      }, new Map())
      return [...countriesMap]
        .filter(([key, value]) => value.confirmed_count > 0)
        .sort((a, b) => b[1].confirmed_count - a[1].confirmed_count)
    }
    return null
  }, [testedCountries])

  const { data: recentMeasurements, error: recentMeasurementsError } = useSWR(
    ['/api/v1/measurements', { limit: 5, failure: false, domain }],
    simpleFetcher,
    swrOptions,
  )

  const noIndexCategoryCodes = ['PORN', 'PROV', 'GMB']

  return (
    <>
      <Head>
        <title>{title}</title>
        {noIndexCategoryCodes.includes(categoryCode) && (
          <meta name="robots" content="noindex" />
        )}
      </Head>
      <div className="container mt-16">
        <h1 className="mb-0">{domain}</h1>
        <div className="mb-4">
          <CategoryBadge categoryCode={categoryCode} />
        </div>
        {hasCanonical && <Canonical canonicalDomain={canonicalDomain} />}
        <div>
          {/* we want sticky header only while scrolling over the charts */}
          <StyledSticky>
            <div className="pb-4 pt-2">
              <Form availableCountries={countries.map((c) => c.alpha_2)} />
            </div>
          </StyledSticky>
          <div className="mt-8">
            <ChartContainer domain={domain} setState={setTestedCountries} />
          </div>
        </div>
        {blockedCountries && (
          <BlockingCountries blockedCountries={blockedCountries} />
        )}
        {!!recentMeasurements?.length && (
          <RecentMeasurements
            recentMeasurements={recentMeasurements}
            query={query}
          />
        )}
      </div>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { domain } = context.query

  if (/^((xn--)?[a-z0-9\-]*\.)+((xn--)?[a-z0-9]*)$/.test(domain)) {
    const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
    const path = '/api/_/domain_metadata'

    const { canonical_domain: canonicalDomain, category_code: categoryCode } =
      await client
        .get(path, { params: { domain } })
        .then((response) => response.data)

    const countriesR = await client.get('/api/_/countries')
    const countries = countriesR.data.countries
    countries.sort(sortByKey('name'))

    return {
      props: {
        domain,
        canonicalDomain,
        categoryCode,
        countries,
      },
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  }
}

export default DomainDashboard
