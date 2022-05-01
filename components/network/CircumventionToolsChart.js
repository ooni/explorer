import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Heading, Box, Flex } from 'ooni-components'
import useSWR from 'swr'
import { MATMultipleFetcher as fetcher } from 'services/fetchers'
import GridChart, { prepareDataForGridChart } from 'components/aggregation/mat/GridChart'
import { DetailsBox } from 'components/measurement/DetailsBox'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'
import { FormattedMessage } from 'react-intl'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
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
  }), [since, until, asn])

  const apiQuery = useMemo(() => {
    const qs = new URLSearchParams(query).toString()
    return qs
  }, [query])

  const { data, error } = useSWR(
    { query: apiQuery, 
      testNames: ['psiphon', 'tor', 'torsf'], 
      groupKey: testName
    },
    fetcher,
    swrOptions
  )

  const [chartData, rowKeys, rowLabels] = useMemo(() => {
    if (!data) {
      return [null, 0]
    }
    let chartData = data
    const graphQuery = {...query, axis_y: testName}
    const [reshapedData, rowKeys, rowLabels] = prepareDataForGridChart(chartData, graphQuery)
    return [reshapedData, rowKeys, rowLabels]
  }, [data, query])

  const headerOptions = { probe_cc: false, subtitle: false }

  return (
    <MATContextProvider key={testName} test_name={testName} {...queryParams}>
      <Flex flexDirection='column' mt={3}>
        <Box><Heading h={3}><FormattedMessage id='Tests.Groups.Circumvention.Name' /></Heading></Box>
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