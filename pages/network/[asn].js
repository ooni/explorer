import React, { useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Container, Heading, Box, Text, Link } from 'ooni-components'
import { useIntl } from 'react-intl'
import NLink from 'next/link'
import dayjs from 'services/dayjs'
import Layout from 'components/Layout'
import NavBar from 'components/NavBar'
import { MetaTags } from 'components/dashboard/MetaTags'
import Form from 'components/network/Form'
import Chart from 'components/Chart'
import Calendar from 'components/network/Calendar'
import FormattedMarkdown from 'components/FormattedMarkdown'
import { FormattedMessage } from 'react-intl'
import CallToActionBox from 'components/CallToActionBox'
import { getLocalisedRegionName } from '../../utils/i18nCountries'

const prepareDataForCalendar = (data) => {
  return data.map((r) => ({
    value: r.measurement_count,
    day: r.measurement_start_day
    })
  )
}

const messagingTestNames = ['signal', 'telegram', 'whatsapp', 'facebook_messenger']
const circumventionTestNames = ['psiphon', 'tor', 'torsf']

const ChartsContainer = () => {
  const intl = useIntl()
  const router = useRouter()
  const { query: { since, until, asn } } = router

  const queryWebsites = useMemo(() => ({
    axis_y: 'domain',
    axis_x: 'measurement_start_day',
    asn,
    since,
    until,
    test_name: 'web_connectivity',
  }), [asn, since, until])

  const queryMessagingApps = useMemo(() => ({
    axis_x: 'measurement_start_day',
    asn,
    since,
    until,
  }), [asn, since, until])

  const queryCircumventionTools = useMemo(() => ({
    axis_x: 'measurement_start_day',
    asn,
    since,
    until,
  }), [asn, since, until])

  return (
    <>
      <Chart
        testName='web_connectivity'
        title={intl.formatMessage({id: 'Tests.Groups.Webistes.Name'})}
        queryParams={queryWebsites} />
      <Chart
        testGroup={{name: 'messaging_apps', tests: messagingTestNames}}
        title={intl.formatMessage({id: 'Tests.Groups.Instant Messagging.Name'})}
        queryParams={queryMessagingApps} />
      <Chart
        testGroup={{name: 'circumvention_tools', tests: circumventionTestNames}}
        title={intl.formatMessage({id: 'Tests.Groups.Circumvention.Name'})} 
        queryParams={queryCircumventionTools} />
    </>
  )
}

const Summary = ({ measurementsTotal, firstMeasurement, countriesData }) => {
  const intl = useIntl()
  const formattedDate = new Intl.DateTimeFormat(intl.locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(firstMeasurement))
  const sortedCountries = countriesData.sort((a, b) => b.measurements - a.measurements)
  const countriesList = sortedCountries.map(function(c){
    return (
      <li key={c.country}>
        <NLink passHref href={`/country/${c.country}`}>
          <Link mr={1}>{getLocalisedRegionName(c.country, intl.locale)}</Link>
        </NLink>
        <FormattedMessage id='Network.Summary.Country.Measurements' values={{measurementsTotal: c.measurements}} />
      </li>
    )
  })

  return (
    <>
      <Text fontSize={20} my={10}>
        <FormattedMarkdown id='Network.Summary.TotalMeasurements' values={{measurementsTotal}} />
      </Text>
      <Text fontSize={20} my={10}>
        <FormattedMarkdown id='Network.Summary.FirstMeasurement' values={{formattedDate}} />
      </Text>
      <Text fontSize={20} my={10}>
        <FormattedMarkdown id='Network.Summary.Countries' />
        <Box sx={{ ul: { my: 2 }, li: { fontWeight: 'bold' }}}>
          <ul>{countriesList}</ul>
        </Box>
      </Text>
    </>
  )
}

const NetworkDashboard = ({asn, calendarData = [], measurementsTotal, countriesData}) => {
  const router = useRouter()
  const { query } = router
  const displayASN = asn.replace('AS', '')

  useEffect(() => {
    if (Object.keys(query).length  < 3) {
      const today = dayjs.utc().add(1, 'day')
      const monthAgo = dayjs.utc(today).subtract(1, 'month')
      const href = {
        query: {
          since: monthAgo.format('YYYY-MM-DD'),
          until: today.format('YYYY-MM-DD'),
          asn: query.asn
        },
      }
      router.replace(href, undefined, { shallow: true })
    }
  }, [])

  // Sync page URL params with changes from form values
  const onSubmit = ({ since, until }) => {
    // since: "2022-01-02",
    // until: "2022-02-01",
    const params = {
      since,
      until,
      asn
    }
    if (query.since !== since || query.until !== until) {
      router.push({ query: params }, undefined, { shallow: true })
    }
  }

  return (
    <>
      <MetaTags />
      <NavBar />
      <Container>
        <Heading h={1} fontWeight='heading' my={20}>AS{displayASN}</Heading>
        {router.isReady &&
          <>
            {!!calendarData.length ?
              <>
                <Summary measurementsTotal={measurementsTotal} countriesData={countriesData} firstMeasurement={calendarData[0].day} />
                <Calendar data={calendarData} />
                <Box as='hr' sx={{bg: 'gray5', border: 0, height: 1}} mt={20} mb={20} />
                <Form onSubmit={onSubmit} query={query} />
                <ChartsContainer />
              </> :
              <CallToActionBox
                title={<FormattedMessage id='Network.NoData.Title' />}
                text={<FormattedMessage id='Network.NoData.Text' />}
              />
            }
          </>
        }
      </Container>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { asn } = context.query

  if (/^AS[0-9]+$/.test(asn)) {
    const client = axios.create({baseURL: process.env.NEXT_PUBLIC_OONI_API})
    const path = '/api/v1/aggregation'

    const measurementsTotal = await client
      .get(path, {params: {'probe_asn': asn}})
      .then((response) => response?.data?.result.measurement_count)

    const calendarData = await client.get(path, { params: {
      probe_asn: asn,
      since: dayjs.utc().subtract(10, 'year').format('YYYY-MM-DD'),
      until: dayjs.utc().format('YYYY-MM-DD'),
      axis_x: 'measurement_start_day',
    }}).then((response) => prepareDataForCalendar(response.data.result))

    const countriesData = await client.get(path, { params: {
      probe_asn: asn,
      axis_x: 'probe_cc'
    }}).then((response) => (response.data.result.map(res => ({country: res.probe_cc, measurements: res.measurement_count}))))

    return {
      props: {
        asn,
        calendarData,
        measurementsTotal,
        countriesData,
      }
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: '/404'
    }
  }
}

export default NetworkDashboard
