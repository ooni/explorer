/* global process */

import React, { useState } from 'react'
import Head from 'next/head'
import { Container, Heading, Flex, Box, theme } from 'ooni-components'
import useSWR from 'swr'

import Layout from '../../components/Layout'
import NavBar from '../../components/NavBar'
// import wdata from '../../components/aggregation/website/website-data'
// import gdata from './global-data'
import Global from '../../components/aggregation/website/Global'
import WebsiteInCountry from '../../components/aggregation/website/WebsiteInCountry'
import Form from '../../components/aggregation/website/form'

const AGGREGATION_API = `${process.env.MEASUREMENTS_URL}/api/v1/aggregation?`

const dataFetcher = url => (
  fetch(AGGREGATION_API + url).then(r => r.json())
)

const defaultParams = {
  websiteStats: {
    'since': '2020-05-26',
    'until': '2020-06-26',
    'axis_x': 'probe_cc',
    'test_name': 'web_connectivity',
    'input': 'thepiratebay.org',
  }
}

const buildQuery = (params) => {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    query.append(key, value)
  }
  return query.toString()
}

const WebsiteAnalytics = () => {

  const [params, setParams] = useState(defaultParams.websiteStats)

  const query = buildQuery(params)

  const { data, error } = useSWR(query, dataFetcher)
  // const data = gdata, error = null

  const updateParams = (values) => {
    const newParams = Object.assign({}, params, values)
    setParams(newParams)
  }

  return (
    <Layout>
      <Head>
        <title> Website Centric Charts </title>
      </Head>
      <NavBar />
      <Container>
        <Flex flexDirection='column'>
          <Form onSubmit={updateParams} />
          <Box my={2}>
            {query}
          </Box>
          {error && <div> {JSON.stringify(error)} </div>}
          {!data && <Box> Loading ... </Box>}
          {data && <React.Fragment>
            <Box>
              <Global data={data.result} />
              {/* <WebsiteInCountry data={data.result} /> */}
            </Box>
            {/* <Box>
              {JSON.stringify(data)}
            </Box> */}
          </React.Fragment>}
        </Flex>
      </Container>
    </Layout>
  )
}

export default WebsiteAnalytics
