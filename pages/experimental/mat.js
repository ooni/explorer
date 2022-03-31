/* global process */
import React, { useCallback, useEffect, useMemo } from 'react'
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
import { MATContextProvider } from '../../components/aggregation/mat/MATContext'
import { StackedBarChart } from '../../components/aggregation/mat/StackedBarChart'
import { FunnelChart } from '../../components/aggregation/mat/FunnelChart'
import { Form } from '../../components/aggregation/mat/Form'
import { axiosResponseTime } from '../../components/axios-plugins'
import { withDebugProvider, useDebugContext } from '../../components/aggregation/DebugContext'
import { Debug } from '../../components/aggregation/Debug'
import TableView from 'components/aggregation/mat/TableView'
import Help from 'components/aggregation/mat/Help'

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
              {showLoadingIndicator &&
                <Box>
                  <h2>Loading ...</h2>
                </Box>
              }
              {data && data.data.dimension_count == 0 &&
                <Box sx={{ height: '500px' }}>
                  <FunnelChart data={data.data.result} />
                </Box>
              }
              {data && data.data.dimension_count == 1 &&
                <Box sx={{ height: '600px' }}>
                  <StackedBarChart data={data} query={query} />
                </Box>
              }
              {data && data.data.dimension_count > 1 &&
                <Box sx={{ minHeight: '500px' }}>
                  <TableView data={data.data.result} query={query} />
                </Box>
              }
            </Box>
            <Help />
            {error && <Box>
              <Heading h={5} my={4}>Error</Heading>
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </Box>}
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

// function DebuggableMAT({ testNames }) {
//   return (
//     <DebugProvider>
//       <MeasurementAggregationToolkit testNames={testNames} />
//     </DebugProvider>
//   )
// }

export default MeasurementAggregationToolkit
