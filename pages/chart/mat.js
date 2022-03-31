/* global process */
import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { useRouter } from  'next/router'
import axios from 'axios'
import {
  Container,
  Heading,
  Flex,
  Box,
  Link
} from 'ooni-components'
import useSWR from 'swr'

import Layout from 'components/Layout'
import NavBar from 'components/NavBar'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'
import { StackedBarChart } from 'components/aggregation/mat/StackedBarChart'
import { FunnelChart } from 'components/aggregation/mat/FunnelChart'
import { Form } from 'components/aggregation/mat/Form'
import { axiosResponseTime } from 'components/axios-plugins'
import TableView from 'components/aggregation/mat/TableView'
import { exportToCsv, exportToJson, requestUrl } from 'utils/dataExport'

const baseURL = process.env.NEXT_PUBLIC_MEASUREMENTS_URL
axiosResponseTime(axios)

export const getServerSideProps = async () => {
  const testNamesR = await axios.get(`${baseURL}/api/_/test_names`)

  return {
    props: {
      testNames: Array.isArray(testNamesR.data.test_names) ? testNamesR.data.test_names : []
    }
  }
}

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const fetcher = (query) => {
  const qs = new URLSearchParams(query).toString()
  const reqUrl = `${process.env.NEXT_PUBLIC_AGGREGATION_API || process.env.NEXT_PUBLIC_MEASUREMENTS_URL}/api/v1/aggregation?${qs}`
  console.debug(`API Query: ${reqUrl}`)
  return axios.get(reqUrl).then(r => {
    return {
      data: r.data,
      loadTime: r.loadTime,
      url: r.config.url
    }
  })
}

const MeasurementAggregationToolkit = ({ testNames }) => {

  const router = useRouter()

  const onSubmit = useCallback((data) => {
    let params = {}
    for (const p of Object.keys(data)) {
      if (data[p] !== '') {
        params[p] = data[p]
      }
    }
    const href = {
      pathname: router.pathname,
      query: params,
    }
    return router.push(href, href, { shallow: true })

  }, [router])

  const shouldFetchData = router.pathname !== router.asPath
  const query = router.query

  const { data, error, isValidating } = useSWR(
    () => shouldFetchData ? [query] : null,
    fetcher,
    swrOptions
  )

  const showLoadingIndicator = useMemo(() => isValidating, [isValidating])

  const renderLoading = () => (
    <Box>
      <h2>Loading ...</h2>
    </Box>
  )

  const renderData = () => {
    const { data: { dimension_count } } = data
    if (dimension_count === 0) {
      return (
        <Box sx={{ height: '500px' }}>
          <FunnelChart data={data.data.result} />
        </Box>
      )
    } else if (dimension_count === 1) {
      return (
        <Box sx={{ height: '600px' }}>
          <StackedBarChart data={data} query={query} />
        </Box>
      )
    } else if (dimension_count > 1) {
      return (
        <Box sx={{ minHeight: '500px' }}>
          <TableView data={data.data.result} query={query} />
        </Box>
      )
    } else {
      return null
    }
  }

  const renderDownloadButtons = () => (
    <Flex flexWrap='wrap' justifyContent='space-evenly' mt={100}>
      <Link href={requestUrl(query)} onClick={(event) => exportToCsv(event, query)} fontSize={20}>Download CSV</Link>
      <Link href={requestUrl(query)} onClick={(event) => exportToJson(event, data.data.result)} fontSize={20}>Download JSON</Link>
    </Flex>
  )

  const renderError = () => (
    <Box>
      <Heading h={5} my={4}>Error</Heading>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </Box>
  )

  return (
    <MATContextProvider>
      <Layout>
        <Head>
          <title>OONI MAT</title>
        </Head>
        <NavBar />
        <Container>
          <Flex flexDirection='column'>
            <Heading h={1} my={4} title='This is an experimental feature still undergoing development.'> 🧪 OONI Measurement Aggregation Toolkit</Heading>
            <Form onSubmit={onSubmit} testNames={testNames} query={router.query} />
            <Box sx={{ }}>
              {showLoadingIndicator && renderLoading()}
              {data && renderData()}
              {data && renderDownloadButtons()}
            </Box>
            {error && renderError()}
          </Flex>
        </Container>
      </Layout>
    </MATContextProvider>
  )
}

MeasurementAggregationToolkit.propTypes = {
  testNames: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  )
}

export default MeasurementAggregationToolkit
