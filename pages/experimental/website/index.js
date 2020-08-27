/* global process */

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Container, Flex, Box } from 'ooni-components'
import useSWR from 'swr'
import moment from 'moment'
import axios from 'axios'

import Layout from '../../../components/Layout'
import NavBar from '../../../components/NavBar'

// import gdata from '../../../components/aggregation/website/global-data'  // static data for offline mode
import Global from '../../../components/aggregation/website/Global'
import Form from '../../../components/aggregation/website/Form'
import { paramsToQuery, queryToParams } from '../../../components/aggregation/website/queryUtils'
import { Debug } from '../../../components/aggregation/website/Debug'
import { GlobalLoader } from '../../../components/aggregation/website/GlobalLoader'

const AGGREGATION_API = `${process.env.MEASUREMENTS_URL}/api/v1/aggregation?`

const dataFetcher = url => (
  axios.get(AGGREGATION_API + url).then(r => r.data)
)

const defaultParams = {
  'since': moment.utc().subtract(1, 'months').format('YYYY-MM-DD'),
  'until': moment.utc().format('YYYY-MM-DD'),
  'axis_x': 'probe_cc',
  'test_name': 'web_connectivity',
  'input': 'thepiratebay.org',
}

const WebsiteAnalytics = () => {
  const router = useRouter()

  const [query, setQuery] = useState(paramsToQuery(Object.assign({}, defaultParams, router.query)))

  const { data, error } = useSWR(query, dataFetcher)
  // const data = gdata, error = null

  const updateQuery = (values) => {
    const oldParams = queryToParams(query)
    const newParams = Object.assign({}, oldParams, values)
    setQuery(paramsToQuery(newParams))
  }

  useEffect(() => {
    const url = `${router.pathname}?${query}`
    router.push( url, url, { shallow: true })
  }, [query])

  return (
    <Layout>
      <Head>
        <title> Website Centric Charts </title>
      </Head>
      <NavBar />
      <Container>
        <Flex flexDirection='column'>
          <Form onSubmit={updateQuery} initialValues={queryToParams(query)} />
          {error && <div> {JSON.stringify(error)} </div>}
          <Debug params={query}>
            <pre>
              {error && <p>{error}</p>}
              {!data && !error && <p> Loading data... </p>}
              {data && JSON.stringify(data, null, 2)}
            </pre>
          </Debug>
          {!data && !error && <GlobalLoader />}
          {data && data.result && (
            <Box>
              <Global data={data.result} />
            </Box>
          )}
        </Flex>
      </Container>
    </Layout>
  )
}

export default WebsiteAnalytics
