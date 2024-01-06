import axios from 'axios'
import Flag from 'components/Flag'
import { useRouter } from 'next/router'
import { Box, Container, Flex, Heading, Text } from 'ooni-components'
import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import TestGroupBadge, { CategoryBadge } from 'components/Badge'
import Chart from 'components/DomainChart'
import NavBar from 'components/NavBar'
import { StyledSticky } from 'components/SharedStyledComponents'
import { GridBox } from 'components/VirtualizedGrid'
import Form from 'components/domain/Form'
import Head from 'next/head'
import NLink from 'next/link'
import { RecentMeasurements } from 'pages/as/[probe_asn]'
import { simpleFetcher } from 'services/fetchers'
import useSWR from 'swr'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import BlockText from '../../components/BlockText'
import { sortByKey } from '../../utils'

const CountryList = ({ countries, itemsPerRow = 6, gridGap = 3 }) => {
  const intl = useIntl()
  const gridTemplateColumns = [
    '1fr 1fr',
    '1fr 1fr',
    '1fr 1fr 1fr 1fr',
    [...Array(itemsPerRow)].map((i) => '1fr').join(' '),
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gridGap,
        gridTemplateColumns,
      }}
    >
      {countries.map(([key, value]) => {
        return (
          <GridBox
            key={key}
            href={`/country/${key}`}
            title={
              <Flex mb={2} alignItems='center'>
                <Box alignSelf='start'>
                  <Flag countryCode={key} size={22} border />
                </Box>
                <Text fontSize={1} fontWeight='bold' ml={2} lineHeight='24px'>
                  {getLocalisedRegionName(key, intl.locale)}
                </Text>
              </Flex>
            }
            multiCount={value}
          />
        )
      })}
    </Box>
  )
}

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const ChartContainer = ({ domain, ...props }) => {
  const intl = useIntl()
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
      time_grain: 'day',
    }),
    [domain, since, until]
  )

  return (
    <>
      <TestGroupBadge mb={3} testName='web_connectivity' />
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
      <Heading h={4} mt={4}>
        {intl.formatMessage({ id: 'Domain.CountriesBlocking.Title' }, { domain })}
      </Heading>
      <Heading h={5} mb={3}>
        {intl.formatMessage({ id: 'Domain.CountriesBlocking.FromTo' }, { since, until })}
      </Heading>
      {!!blockedCountries?.length ? (
        <>
          <BlockText mb={3}>{intl.formatMessage({ id: 'Domain.CountriesBlocking.Subtitle' })}</BlockText>
          <CountryList countries={blockedCountries} />
        </>
      ) : (
        <Text>{intl.formatMessage({ id: 'Domain.CountriesBlocking.NoCountries' }, { domain })}</Text>
      )}
    </>
  )
}

const Canonical = ({ canonicalDomain }) => {
  const intl = useIntl()
  return (
    <BlockText mb={4}>
      {intl.formatMessage(
        { id: 'Domain.Canonical' },
        {
          canonicalDomain: (
            <NLink href={`/domain/${canonicalDomain}`}>
              {canonicalDomain}
            </NLink>
          ),
        }
      )}
    </BlockText>
  )
}

const DomainDashboard = ({ domain, categoryCode, canonicalDomain, countries }) => {
  const router = useRouter()
  const { query } = router
  const [testedCountries, setTestedCountries] = useState(null)
  const intl = useIntl()

  const hasCanonical = domain !== canonicalDomain

  const blockedCountries = useMemo(() => {
    if (testedCountries) {
      const countriesMap = testedCountries.reduce((accum, current) => {
        if (accum.get(current.probe_cc)) {
          const countryData = accum.get(current.probe_cc)

          accum.set(current.probe_cc, {
            confirmed_count: countryData.confirmed_count + current.confirmed_count,
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
    swrOptions
  )

  const onSubmit = (data) => {
    let params = {}
    for (const p of Object.keys(data)) {
      if (data[p]) {
        params[p] = data[p]
      }
    }
    params.domain = domain

    const { since, until, probe_cc } = params

    if (query.since !== since || query.until !== until || query.probe_cc !== probe_cc) {
      router.push({ query: params }, undefined, { shallow: true })
    }
  }

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({ id: 'General.OoniExplorer' })} | {domain}
        </title>
      </Head>
      <NavBar />
      <Container mt={5}>
        <Heading h={1} mb={0}>
          {domain}
        </Heading>
        <Box mb={4}>
          <CategoryBadge categoryCode={categoryCode} />
        </Box>
        {hasCanonical && <Canonical canonicalDomain={canonicalDomain} />}
        <Box>
          {/* we want sticky header only while scrolling over the charts */}
          <StyledSticky>
            <Box pb={3} pt={2}>
              <Form onSubmit={onSubmit} availableCountries={countries.map((c) => c.alpha_2)} />
            </Box>
          </StyledSticky>
          <Box mt={4}>
            <ChartContainer domain={domain} setState={setTestedCountries} />
          </Box>
        </Box>
        {blockedCountries && <BlockingCountries blockedCountries={blockedCountries} />}
        {!!recentMeasurements?.length && <RecentMeasurements recentMeasurements={recentMeasurements} query={query} />}
      </Container>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { domain } = context.query

  if (/^((xn--)?[a-z0-9\-]*\.)+((xn--)?[a-z0-9]*)$/.test(domain)) {
    const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
    const path = '/api/_/domain_metadata'

    const { canonical_domain: canonicalDomain, category_code: categoryCode } = await client
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
