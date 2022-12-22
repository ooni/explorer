import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Container, Heading, Box, Flex, Text, Link } from 'ooni-components'
import { useIntl } from 'react-intl'
import NLink from 'next/link'
import styled from 'styled-components'
import dayjs from 'services/dayjs'
import Layout from 'components/Layout'
import NavBar from 'components/NavBar'
import { MetaTags } from 'components/dashboard/MetaTags'
import Form from 'components/network/Form'
import Chart from 'components/network/Chart'
import Calendar from 'components/network/Calendar'
import FormattedMarkdown from 'components/FormattedMarkdown'
import { FormattedMessage } from 'react-intl'
import CallToActionBox from 'components/CallToActionBox'
import { getLocalisedRegionName } from '../../utils/i18nCountries'

const Bold = styled.span`
  font-weight: bold
`

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
  return (
    <> 
      <Chart
        testName='web_connectivity'
        title={intl.formatMessage({id: 'Tests.Groups.Webistes.Name'})}
        queryParams={{axis_y: 'domain'}} />
      <Chart
        testGroup={{name: 'messaging_apps', tests: messagingTestNames}}
        title={intl.formatMessage({id: 'Tests.Groups.Instant Messagging.Name'})} />
      <Chart
        testGroup={{name: 'circumvention_tools', tests: circumventionTestNames}}
        title={intl.formatMessage({id: 'Tests.Groups.Circumvention.Name'})} />
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
  const query = router.query
  const displayASN = asn.replace('AS', '')

  // Sync page URL params with changes from form values
  const onChange = useCallback(({ since, until }) => {
    // since: "2022-01-02",
    // until: "2022-02-01",
    const params = {
      since,
      until,
    }
    const href = {
      pathname: router.pathname.replace('[asn]', asn),
      query: params,
    }
    if (query.since !== since
      || query.until !== until
    ) {
      router.push(href, href, { shallow: true })
    }

  }, [router, query, asn])

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
                <Form onChange={onChange} query={query} />
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
      .then((response)=> response?.data?.result.measurement_count)
    
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