import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Heading, Box, Flex } from 'ooni-components'
import axios from 'axios'
import { axiosResponseTime } from 'components/axios-plugins'
import useSWR from 'swr'
import GridChart, { prepareDataForGridChart } from 'components/aggregation/mat/GridChart'
import { DetailsBox } from 'components/measurement/DetailsBox'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const baseURL = process.env.NEXT_PUBLIC_AGGREGATION_API
axiosResponseTime(axios)

const circumventionFetcher = (query) => {
  const reqUrl = `${baseURL}/api/v1/aggregation?${query}`
  const result = []

  const request = (reqUrl) => { 
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
      e.message = e?.request?.response ?? e.message
      throw e
    })
  }

  const circumventionTools = ['psiphon', 'tor', 'torsf']
  const requests = circumventionTools.map((tool) => request(`${reqUrl}&test_name=${tool}`))

  return Promise.allSettled(requests).then((responses) => {
    return responses.reduce((prev, current, index) => [...prev, ...current.value.data.map((obj) => ({...obj, circumvention_tool: circumventionTools[index]}))], [])
  })
}

const testName = 'circumvention_tool'
const queryParams = { axis_x: 'measurement_start_day' }

const CircumventionChart = React.memo(function MessagingChart() {
  const router = useRouter()
  const { query: {since, until, asn} } = router
  const query = useMemo(() => ({
    ...queryParams,
    probe_asn: asn,
    since: since,
    until: until,
    type: 'circumvention'
  }), [since, until, asn])

  const apiQuery = useMemo(() => {
    const qs = new URLSearchParams(query).toString()
    return qs
  }, [query])

  const { data, error } = useSWR(
    apiQuery,
    circumventionFetcher,
    swrOptions
  )
  const [chartData, rowKeys, rowLabels] = useMemo(() => {
    if (!data) {
      return [null, 0]
    }
    let chartData = data

    const graphQuery = {...query, axis_y: 'circumvention_tool'}

    const [reshapedData, rowKeys, rowLabels] = prepareDataForGridChart(chartData, graphQuery)

    return [reshapedData, rowKeys, rowLabels]

  }, [data, query])

  const headerOptions = { probe_cc: false, subtitle: false }

  return (
    <MATContextProvider key={testName} test_name={testName} {...queryParams}>
      <Flex flexDirection='column' mt={3}>
        <Box><Heading h={3}>{testName}</Heading></Box>
        <Box>
          {(!chartData && !error) ? (
            <div> Loading ...</div>
          ) : (
            chartData === null || chartData.length === 0 ? (
              <Heading h={5}>No Data</Heading>
            ) : (
              <GridChart
                data={chartData}
                rowKeys={rowKeys}
                rowLabels={rowLabels}
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
    </MATContextProvider>
  )
})

export default CircumventionChart