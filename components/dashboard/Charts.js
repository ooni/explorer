import React, { useMemo } from 'react'
import { Flex, Box, Heading } from 'ooni-components'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'

import { GridChart } from '../aggregation/mat/GridChart'
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

  const { data, error, isValidating } = useSWR(
    apiQuery,
    fetcher,
    swrOptions
  )
  
  const chartData = useMemo(() => {
    if (data?.data?.result) {
      const selectedCountries = query?.probe_cc.length > 1 ? query?.probe_cc.split(',') : []
      if (selectedCountries.length > 0) {
        return data?.data?.result.filter(d => selectedCountries.includes(d.probe_cc))
      } else {
        return data?.data?.result
      }
    }
    return null
  }, [data, query.probe_cc])


  return (
    <Flex flexDirection='column' my={2}>
      <Box><Heading h={2}>{testNames[testName].name}</Heading></Box>
      <Box sx={{ height: `${250}px` }}>
        {chartData && 
          <GridChart
            data={chartData}
            query={derivedQuery}
          />
        }
      </Box>
    </Flex>
  )
}

const ChartsContainer = () => {
  return (
    <>
      <Chart testName='psiphon' />
      <Chart testName='riseupvpn' />
      <Chart testName='torsf' />
      <Chart testName='tor' />
    </>
  )
}

export default withDebugProvider(ChartsContainer)