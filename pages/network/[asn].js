import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Container, Heading, Box, Flex } from 'ooni-components'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import Layout from 'components/Layout'
import NavBar from 'components/NavBar'
import { MetaTags } from 'components/dashboard/MetaTags'
import Form from 'components/network/Form'
import Chart from 'components/network/Chart'
import Calendar from 'components/network/Calendar'

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

const NetworkDashboard = ({asn, calendarData, measurementsTotal}) => {
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
        <h1>AS{asn}</h1>
        {router.isReady && 
          <React.Fragment>
            <Calendar asn={asn} data={calendarData} />
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

    const measurementsTotal = await client
      .get('/api/v1/aggregation', {params: {'probe_asn': asn}})
      .then((response)=> response?.data?.result.measurement_count)
    
    if (measurementsTotal > 0) {
      const calendarData = await client.get('/api/v1/aggregation', { params: {
        probe_asn: asn,
        since: dayjs.utc().subtract(1, 'year').format('YYYY-MM-DD'),
        until: dayjs.utc().format('YYYY-MM-DD'),
        axis_x: 'measurement_start_day',
      }}).then((response) => prepareDataForCalendar(response.data.result))
    
      return { 
        props: { 
          asn,
          calendarData,
          measurementsTotal,
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