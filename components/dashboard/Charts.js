import React, { useMemo } from 'react'
import { Flex, Box, Heading } from 'ooni-components'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import { territoryNames } from 'country-util'

import GridChart from '../aggregation/mat/GridChart'
import { MATContextProvider } from '../aggregation/mat/MATContext'
import { withDebugProvider } from '../aggregation/DebugContext'
import { axiosResponseTime } from '../axios-plugins'
import { testNames } from '../test-info'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const baseURL = process.env.NEXT_PUBLIC_MEASUREMENTS_URL
axiosResponseTime(axios)

// TODO export from mat.js
const fetcher = (query) => {
  const reqUrl = `${baseURL}/api/v1/aggregation?${query}`
  return axios.get(reqUrl).then(r => {
    return {
      data: r.data,
      loadTime: r.loadTime,
      url: r.config.url
    }
  })
}
const fixedQuery = {
  axis_x: 'measurement_start_day',
  axis_y: 'probe_cc',
}

const Chart = ({ testName }) => {
  const { query } = useRouter()

  const derivedQuery = useMemo(() => ({
    ...fixedQuery,
    test_name: testName,
    since: query.since,
    until: query.until
  }), [query, testName])

  const apiQuery = useMemo(() => {
    const qs = new URLSearchParams(derivedQuery).toString()
    return qs
  }, [derivedQuery])

  const { data, error } = useSWR(
    apiQuery,
    fetcher,
    swrOptions
  )
  
  const [chartData] = useMemo(() => {
    if (!data?.data?.result) {
      return [null, 0]
    }

    let chartData = data?.data?.result.sort((a, b) => (territoryNames[a.probe_cc] < territoryNames[b.probe_cc]) ? -1 : (territoryNames[a.probe_cc] < territoryNames[b.probe_cc]) ? 1 : 0)

    const selectedCountries = query?.probe_cc?.length > 1 ? query?.probe_cc.split(',') : []
    if (selectedCountries.length > 0) {
      chartData = chartData.filter(d => selectedCountries.includes(d.probe_cc))
    }

    return [chartData]

  }, [data, query.probe_cc])

  return (
    <Flex flexDirection='column' mt={3}>
      <Box><Heading h={3}>{testNames[testName].name}</Heading></Box>
      <Box>
        {(!chartData && !error) ? (
          <div> Loading ...</div>
        ) : (
          chartData === null || chartData.length === 0 ? (
            <Heading h={5}>No Data</Heading>
          ) : (
            <GridChart
              data={chartData}
              isGrouped={false}
              query={derivedQuery}
            />
          )
        )}
      </Box>
    </Flex>
  )
}

const ChartsContainer = () => {
  return (
    ['psiphon', 'torsf', 'tor'].map(testName => (
      <MATContextProvider key={testName} test_name={testName} {...fixedQuery}>
        <Chart testName={testName} />
      </MATContextProvider>
    ))
  )
}

export default withDebugProvider(ChartsContainer)