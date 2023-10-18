import axios from 'axios'
import Calendar from 'components/as/Calendar'
import Loader from 'components/as/Loader'
import CallToActionBox from 'components/CallToActionBox'
import Chart from 'components/Chart'
import CountryList from 'components/CountryBox'
import Form from 'components/domain/Form'
import NavBar from 'components/NavBar'
import ResultsList from 'components/search/ResultsList'
import { StyledHollowButton, StyledSticky } from 'components/SharedStyledComponents'
import ThirdPartyDataChart from 'components/ThirdPartyDataChart'
import Head from 'next/head'
import NLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Container, Flex, Heading, Text } from 'ooni-components'
import React, { useMemo } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { FormattedMessage, useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import { fetcherWithPreprocessing, simpleFetcher } from 'services/fetchers'
import styled from 'styled-components'
import useSWR from 'swr'
import { toCompactNumberUnit } from '../../utils'
import TestGroupBadge from '/components/Badge'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const prepareDataForCalendar = (data) => {
  return data.map((r) => ({
    value: r.measurement_count,
    day: r.measurement_start_day,
  }))
}

const StyledSection = styled(Box)``
StyledSection.defaultProps = {
  as: 'section',
  my: 4,
}

const messagingTestNames = ['signal', 'telegram', 'whatsapp', 'facebook_messenger']
const circumventionTestNames = ['psiphon', 'tor', 'torsf']

const ChartsContainer = () => {
  const intl = useIntl()
  const router = useRouter()
  const {
    query: { since, until, probe_asn, probe_cc },
  } = router

  const queryWebsites = useMemo(
    () => ({
      axis_y: 'domain',
      axis_x: 'measurement_start_day',
      probe_asn,
      since,
      until,
      ...(probe_cc && { probe_cc }),
      test_name: 'web_connectivity',
      time_grain: 'day',
    }),
    [probe_asn, since, until, probe_cc]
  )

  const queryMessagingApps = useMemo(
    () => ({
      axis_y: 'test_name',
      axis_x: 'measurement_start_day',
      probe_asn,
      since,
      until,
      test_name: messagingTestNames,
      ...(probe_cc && { probe_cc }),
      time_grain: 'day',
    }),
    [probe_asn, since, until, probe_cc]
  )

  const queryCircumventionTools = useMemo(
    () => ({
      axis_y: 'test_name',
      axis_x: 'measurement_start_day',
      probe_asn,
      since,
      until,
      test_name: circumventionTestNames,
      ...(probe_cc && { probe_cc }),
      time_grain: 'day',
    }),
    [probe_asn, since, until, probe_cc]
  )

  return (
    <>
      <StyledSection>
        <TestGroupBadge mb={3} testName='web_connectivity' />
        <Chart queryParams={queryWebsites} />
      </StyledSection>
      <StyledSection>
        <TestGroupBadge mb={3} testName='signal' />
        <Chart queryParams={queryMessagingApps} />
      </StyledSection>
      <StyledSection>
        <TestGroupBadge mb={3} testName='tor' />
        <Chart queryParams={queryCircumventionTools} />
      </StyledSection>
    </>
  )
}

export const RecentMeasurements = ({ recentMeasurements, query }) => {
  const intl = useIntl()

  return (
    <>
      <Heading h={3} mb={3} mt={4}>
        {intl.formatMessage({ id: 'Domain.RecentMeasurements.Title' })}
      </Heading>
      <ResultsList results={recentMeasurements} />
      <NLink href={`/search?${new URLSearchParams(query)}`} passHref>
        <a>
          <StyledHollowButton hollow mt={3} mb={5}>
            {intl.formatMessage({ id: 'Domain.Button.SearchResults' })}{' '}
            <MdOutlineSearch size={20} style={{ verticalAlign: 'bottom' }} />
          </StyledHollowButton>
        </a>
      </NLink>
    </>
  )
}

const StatsItem = ({ label, unit = null, value }) => (
  <Box>
    <Text fontWeight={600}>{label}</Text>
    <Text fontSize={36} fontWeight={300}>
      {value}
      {unit && (
        <Text as='span' fontSize={32}>
          {unit}
        </Text>
      )}
    </Text>
  </Box>
)

const Summary = ({ measurementsTotal, firstMeasurement, lastMeasurement }) => {
  const intl = useIntl()
  const formattedFirstMeasurement = new Intl.DateTimeFormat(intl.locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(firstMeasurement))
  measurementsTotal = measurementsTotal < 10000 ? { value: measurementsTotal } : toCompactNumberUnit(measurementsTotal)
  const formattedLastMeasurement = new Intl.DateTimeFormat(intl.locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(lastMeasurement))

  return (
    <>
      <Heading h={3} mt={4} mb={3}>
        <FormattedMessage id='Network.Summary.Coverage' />
      </Heading>
      <Flex sx={{ gap: 4 }} mb={3}>
        <StatsItem
          label={intl.formatMessage({
            id: 'Network.Summary.TotalMeasurements',
          })}
          unit={measurementsTotal.unit}
          value={measurementsTotal.value}
        />
        <StatsItem
          label={intl.formatMessage({ id: 'Network.Summary.FirstMeasurement' })}
          value={formattedFirstMeasurement}
        />
        <StatsItem
          label={intl.formatMessage({ id: 'Network.Summary.LastMeasurement' })}
          value={formattedLastMeasurement}
        />
      </Flex>
    </>
  )
}

const CountriesList = ({ countriesData }) => {
  const sortedCountries = countriesData.sort((a, b) => b.measurements - a.measurements)
  const numberOfCountries = countriesData.length

  return (
    <>
      <Heading h={3}>
        <FormattedMessage id='Network.Summary.Countries' values={{ numberOfCountries }} />
      </Heading>
      <CountryList countries={sortedCountries} />
    </>
  )
}

const NetworkDashboard = ({ probe_asn, networkName, countriesData }) => {
  const intl = useIntl()
  const router = useRouter()
  const { query } = router
  const displayASN = probe_asn.replace('AS', '')

  const { since, until } = useMemo(() => {
    const today = dayjs.utc().add(1, 'day')
    const monthAgo = dayjs.utc(today).subtract(1, 'month')

    return {
      since: query.since ?? monthAgo.format('YYYY-MM-DD'),
      until: query.until ?? today.format('YYYY-MM-DD'),
    }
  }, [query])

  const { data: calendarData, error: calendarDataError } = useSWR(
    [
      '/api/v1/aggregation',
      {
        probe_asn,
        since: dayjs.utc().subtract(12, 'year').format('YYYY-MM-DD'),
        until: dayjs.utc().add(1, 'day').format('YYYY-MM-DD'),
        axis_x: 'measurement_start_day',
      },
      {
        resultKey: 'result',
        preprocessFn: prepareDataForCalendar,
      },
    ],
    fetcherWithPreprocessing,
    swrOptions
  )

  const measurementsTotal = useMemo(() => {
    return calendarData?.length ? calendarData.reduce((a, b) => a + b.value, 0) : null
  }, [calendarData])

  const { data: recentMeasurements, error: recentMeasurementsError } = useSWR(
    ['/api/v1/measurements', { limit: 5, failure: false, probe_asn }],
    simpleFetcher,
    swrOptions
  )

  // Sync page URL params with changes from form values
  const onSubmit = (data) => {
    let params = {}
    for (const p of Object.keys(data)) {
      if (data[p]) {
        params[p] = data[p]
      }
    }
    params.probe_asn = probe_asn
    // since: "2022-01-02",
    // until: "2022-02-01",

    const { since, until, probe_cc } = params

    if (query.since !== since || query.until !== until || query.probe_cc !== probe_cc) {
      router.push({ query: params }, undefined, { shallow: true })
    }
  }

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({ id: 'General.OoniExplorer' })} | {probe_asn} {networkName}
        </title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1} mt={5} mb={4}>
          {probe_asn} {networkName}
        </Heading>
        {router.isReady && (
          <>
            {calendarData === undefined && <Loader />}
            {calendarData?.length > 0 && (
              <>
                <CountriesList countriesData={countriesData} />
                <Summary
                  measurementsTotal={measurementsTotal}
                  firstMeasurement={calendarData[0].day}
                  lastMeasurement={calendarData[calendarData.length - 1].day}
                />
                <Calendar data={calendarData} />
                <Heading h={3} my={4}>
                  {intl.formatMessage({ id: 'Network.Stats.Title' })}
                </Heading>
                <Box>
                  {/* we want sticky header only while scrolling over the charts */}
                  <StyledSticky>
                    <Box pb={3} pt={2}>
                      <Form onSubmit={onSubmit} availableCountries={countriesData.map((c) => c.country)} />
                    </Box>
                  </StyledSticky>
                  <ChartsContainer />
                </Box>
                {since && until && <ThirdPartyDataChart since={since} until={until} asn={displayASN} />}
                {!!recentMeasurements?.length && (
                  <RecentMeasurements recentMeasurements={recentMeasurements} query={query} />
                )}
              </>
            )}
            {calendarData?.length === 0 && (
              <CallToActionBox
                title={<FormattedMessage id='Network.NoData.Title' />}
                text={<FormattedMessage id='Network.NoData.Text' />}
              />
            )}
          </>
        )}
      </Container>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { probe_asn } = context.query

  if (/^AS[0-9]+$/.test(probe_asn)) {
    const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
    const path = '/api/v1/aggregation'

    const countriesData = await client
      .get(path, {
        params: {
          probe_asn,
          axis_x: 'probe_cc',
        },
      })
      .then((response) =>
        response.data.result.map((res) => ({
          country: res.probe_cc,
          measurements: res.measurement_count,
        }))
      )

    const networkName = await client
      .get('/api/_/asnmeta', { params: { asn: probe_asn.replace('AS', '') } })
      .then((response) => response?.data?.org_name)

    return {
      props: {
        probe_asn,
        countriesData,
        networkName,
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

export default NetworkDashboard
