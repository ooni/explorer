/* global process */
import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { useRouter } from  'next/router'
import axios from 'axios'
import {
  Container,
  Heading,
  Flex, Box,
} from 'ooni-components'
import useSWR from 'swr'

import Layout from '../../components/Layout'
import NavBar from '../../components/NavBar'
import { StackedBarChart } from '../../components/aggregation/mat/StackedBarChart'
import { FunnelChart } from '../../components/aggregation/mat/FunnelChart'
import { HeatmapChart } from '../../components/aggregation/mat/HeatMapChart'
import { Form } from '../../components/aggregation/mat/Form'
import { axiosResponseTime } from '../../components/axios-plugins'

const baseURL = process.env.NEXT_PUBLIC_MEASUREMENTS_URL
axiosResponseTime(axios)

export const getServerSideProps = async () => {
  const testNamesR = await axios.get(`${baseURL}/api/_/test_names`)
  if (Array.isArray(testNamesR.data.test_names)){
    return {
      props: {
        testNames: testNamesR.data.test_names
      }
    }
  } else {
    return {
      props: { testNames: [] }
    }
  }
}

const swrOptions = {
  revalidateOnFocus: false,
}

const fetcher = (query) => {
  const qs = new URLSearchParams(query).toString()
  const reqUrl = `${baseURL}/api/v1/aggregation?${qs}`
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

  }, [router.pathname])

  const shouldFetchData = router.pathname !== router.asPath
  const query = router.query

  const { data, error, isValidating } = useSWR(
    () => shouldFetchData ? [query] : null,
    fetcher,
    swrOptions
  )

  const chartMeta = useMemo(() => {
    // TODO Move charting related transformations to Charts.js
    if (data) {
      let cols = [
        'anomaly_count',
        'confirmed_count',
        'failure_count',
        'ok_count',
      ]
      let indexBy = ''
      cols.push(query['axis_x'])
      indexBy = query['axis_x']
      let reshapedData = Array.isArray(data.data.result) ? data.data.result.map(d => {
        d['ok_count'] = d.measurement_count - d.confirmed_count - d.anomaly_count
        return d
      }) : data.data.result
      return {
        data: reshapedData,
        dimensionCount: data.data.dimension_count,
        url: data.url,
        loadTime: data.loadTime,
        cols,
        indexBy
      }
    } else {
      return null
    }
  }, [data, query])

  return (
    <Layout>
      <Head>
        <title>OONI MAT</title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1} my={4} title='This is an experimental feature still undergoing development.'> 🧪 OONI Measurement Aggregation Toolkit</Heading>
        <Form onSubmit={onSubmit} testNames={testNames} query={router.query} />
        <Flex flexDirection='column'>
          {isValidating &&
            <Box>
              <h2>Loading ...</h2>
            </Box>
          }
          {chartMeta && chartMeta.dimensionCount == 0 &&
            <Box style={{height: '50vh'}}>
              <FunnelChart data={data.data.result} />
              <pre>{JSON.stringify(data.data.result, null, 2)}</pre>
            </Box>

          }
          {chartMeta && chartMeta.dimensionCount == 1 &&
            <Box style={{height: '50vh'}}>
              <StackedBarChart data={data} query={query} />
            </Box>
          }
          {chartMeta && chartMeta.dimensionCount > 1 &&
            <Flex alignItems='center' justifyContent='center' flexDirection='column'>
              <Box width={1}>
                <HeatmapChart data={data.data.result} query={query} />
              </Box>
              <br />
              {/* <Box width={1} style={{height: '30vh', 'overflow-y': 'scroll'}} >
                <pre>{JSON.stringify(data.data.result, null, 2)}</pre>
              </Box> */}
            </Flex>
          }
          <Box>
            {chartMeta && chartMeta.url}
            {chartMeta && ` (dimensions: ${chartMeta.dimensionCount})`}
          </Box>
          <Box>
            {/* loadTime && <span>Load time: {loadTime} ms</span> */}
          </Box>
          {error && <Box>
            <Heading h={5} my={4}>Error</Heading>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </Box>}
        </Flex>
      </Container>
    </Layout>
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
