import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Container, Heading, Box, Flex, Text } from 'ooni-components'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import dayjs from 'services/dayjs'
import countryUtil from 'country-util'
import Layout from 'components/Layout'
import NavBar from 'components/NavBar'
import { MetaTags } from 'components/dashboard/MetaTags'
import Form from 'components/network/Form'
import Chart from 'components/network/Chart'
import Calendar from 'components/network/Calendar'
import FormattedMarkdown from 'components/FormattedMarkdown'

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
      <Chart testName='web_connectivity' title={intl.formatMessage({id: 'Tests.Groups.Webistes.Name'})} queryParams={{axis_y: 'domain'}} />
      <Chart testGroup={{name: 'messaging_apps', tests: messagingTestNames}} title={intl.formatMessage({id: 'Tests.Groups.Instant Messagging.Name'})} />
      <Chart testGroup={{name: 'circumvention_tools', tests: circumventionTestNames}} title={intl.formatMessage({id: 'Tests.Groups.Circumvention.Name'})} />
    </>
  )
}

const Summary = ({ measurementsTotal, firstMeasurement, countries }) => {
  const intl = useIntl()
  const formattedDate = dayjs(firstMeasurement).format('MMMM DD, YYYY')
  return (
    <Text fontSize={20} mt={40} mb={60}>
      <FormattedMarkdown id='Network.Heading.Summary'
        values={{
          measurementsTotal,
          formattedDate,
          countries: countries.map(c => countryUtil.territoryNames[c]).join(', ')
        }}
      />
    </Text>
  )
}

const NetworkDashboard = ({asn, calendarData, measurementsTotal, countries}) => {
  const router = useRouter()
  const query = router.query

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
    <Layout>
      <MetaTags />
      <NavBar />
      <Container>
        <Heading h={1} fontWeight='heading' my={20}>AS{asn}</Heading>
        {router.isReady && 
          <React.Fragment>
            <Summary measurementsTotal={measurementsTotal} countries={countries} firstMeasurement={calendarData[0].day} />
            <Calendar asn={asn} data={calendarData} />
            <Box as='hr' sx={{bg: 'gray5', border: 0, height: 1}} mt={20} mb={20} />
            <Form onChange={onChange} query={query} />
            <ChartsContainer />
          </React.Fragment>
        }
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async (context) => {
  const { asn } = context.query

  if (/^[0-9]+$/.test(asn)) {
    const client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL})
    const path = '/api/v1/aggregation'

    const measurementsTotal = await client
      .get(path, {params: {'probe_asn': asn}})
      .then((response)=> response?.data?.result.measurement_count)
    
    if (measurementsTotal > 0) {
      const calendarData = await client.get(path, { params: {
        probe_asn: asn,
        since: dayjs.utc().subtract(10, 'year').format('YYYY-MM-DD'),
        until: dayjs.utc().format('YYYY-MM-DD'),
        axis_x: 'measurement_start_day',
      }}).then((response) => prepareDataForCalendar(response.data.result))

      const countries = await client.get(path, { params: {
        probe_asn: asn,
        axis_x: 'probe_cc'
      }}).then((response) => (response.data.result.map(res => res.probe_cc)))

      return { 
        props: { 
          asn,
          calendarData,
          measurementsTotal,
          countries,
        }
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