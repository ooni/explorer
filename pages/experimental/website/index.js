/* global process */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Container, Flex, Box } from 'ooni-components'
import useSWR from 'swr'
import moment from 'moment'
import axios from 'axios'

import Layout from '../../../components/Layout'
import NavBar from '../../../components/NavBar'

import Global from '../../../components/aggregation/website/Global'
import FForm from '../../../components/aggregation/website/Form'
import { paramsToQuery, queryToParams } from '../../../components/aggregation/website/queryUtils'
import { Debug } from '../../../components/aggregation/Debug'
import { withDebugProvider } from '../../../components/aggregation/DebugContext'

const Form = React.memo(FForm)

const AGGREGATION_API = `${process.env.NEXT_PUBLIC_AGGREGATION_API || process.env.NEXT_PUBLIC_MEASUREMENTS_URL}/api/v1/aggregation?`

const swrOptions = {
  revalidateOnFocus: false,
}

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
  const [globalData, setData] = useState(null)

  const { data, error, isValidating } = useSWR(query, dataFetcher, swrOptions)
  // const data = gdata, error = null, isValidating = false

  useEffect(() => {
    if(data?.result) {
      setData(data.result)
    }
  }, [data, error])

  const updateQuery = useCallback((values) => {
    const oldParams = queryToParams(query)
    const newParams = Object.assign({}, oldParams, values)
    setQuery(paramsToQuery(newParams))
  }, [query])

  useEffect(() => {
    const url = `${router.pathname}?${query}`
    router.push( url, url, { shallow: true })
  }, [query, router])

  const derivedParams = useMemo(() => {
    return queryToParams(query)
  }, [query])

  return (
    <Layout>
      <Head>
        <title> Website Centric Charts </title>
      </Head>
      <NavBar />
      <Container>
        <Flex flexDirection='column'>
          <Form onSubmit={updateQuery} initialValues={derivedParams} />
          <Debug params={query}>
            <pre>
              {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
              {isValidating && <p> Loading data... </p>}
              {!isValidating && globalData && JSON.stringify(globalData, null, 2)}
            </pre>
          </Debug>
          <Box>
            <Global data={globalData} error={error} loading={isValidating} />
          </Box>
        </Flex>
      </Container>
    </Layout>
  )
}

export default withDebugProvider(WebsiteAnalytics)
