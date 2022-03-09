import React, { useMemo } from 'react'
import { Flex, Box, Heading } from 'ooni-components'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import { territoryNames } from 'country-util'

import GridChart from '../aggregation/mat/GridChart'
import { MATContextProvider } from '../aggregation/mat/MATContext'
import { axiosResponseTime } from '../axios-plugins'
import { testNames } from '../test-info'
import { DetailsBox } from '../measurement/DetailsBox'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const baseURL = process.env.NEXT_PUBLIC_AGGREGATION_API
axiosResponseTime(axios)

// TODO export from mat.js
const fetcher = (query) => {
  const reqUrl = `${baseURL}/api/v1/aggregation?${query}`
  return axios.get(reqUrl).then(r => {
    if (!r?.data?.result) {
      const error = new Error(`Request ${reqUrl} did not contain expected result`)
      error.data = r
      throw error
    }
    return {
      data: r.data.result,
      loadTime: r.loadTime,
      url: r.config.url
    }
  }).catch(e => {
    console.log(e)
    e.message = e?.request?.response ?? e.message
    throw e
  })
}
const fixedQuery = {
  axis_x: 'measurement_start_day',
  axis_y: 'probe_cc',
}

const Chart = React.memo(function Chart({ testName }) {
  const { query: {probe_cc, since, until} } = useRouter()

  // Construct a `query` object that matches the router.query
  // used by MAT, because in this case axis_x, axis_y are not part
  // of router.query
  const query = useMemo(() => ({
    ...fixedQuery,
    test_name: testName,
    since: since,
    until: until
  }), [since, testName, until])

  const apiQuery = useMemo(() => {
    const qs = new URLSearchParams(query).toString()
    return qs
  }, [query])

  const { data, error } = useSWR(
    apiQuery,
    fetcher,
    swrOptions
  )
  
  const [chartData] = useMemo(() => {
    if (!data) {
      return [null, 0]
    }

    let chartData = data.data.sort((a, b) => (territoryNames[a.probe_cc] < territoryNames[b.probe_cc]) ? -1 : (territoryNames[a.probe_cc] > territoryNames[b.probe_cc]) ? 1 : 0)

    const selectedCountries = probe_cc?.length > 1 ? probe_cc.split(',') : []
    if (selectedCountries.length > 0) {
      chartData = chartData.filter(d => selectedCountries.includes(d.probe_cc))
    }

    return [chartData]

  }, [data, probe_cc])

  const headerOptions = { probe_cc: false, subtitle: false }

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
              header={headerOptions}
            />
          )
        )}
      </Box>
      {error &&
        <DetailsBox collapsed={false} content={<>
          <details>
            <summary><span>Error: {error.message}</span></summary>
            <Box as='pre'>
              {JSON.stringify(error, null, 2)}
            </Box>
          </details>
        </>}/>
      }

    </Flex>
  )
})

const testsOnPage = ['psiphon', 'tor', 'torsf']

const ChartsContainer = () => {
  return (
    testsOnPage.map(testName => (
      <MATContextProvider key={testName} test_name={testName} {...fixedQuery}>
        <Chart testName={testName} />
      </MATContextProvider>
    ))
  )
}

export default ChartsContainer