import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
import { Heading, Box, Flex } from 'ooni-components'
import useSWR from 'swr'
import GridChart, { prepareDataForGridChart } from 'components/aggregation/mat/GridChart'
import { DetailsBox } from 'components/measurement/DetailsBox'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'
import { MATMultipleFetcher, MATFetcher } from 'services/fetchers'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const Chart = React.memo(function Chart({testName, testGroup = null, title, queryParams = {}}) {
  const name = testName || testGroup.name

  const apiQuery = useMemo(() => {
    const qs = new URLSearchParams(queryParams).toString()
    return qs
  }, [queryParams])

  const { data, error } = useSWR(
    testGroup ? 
      { query: apiQuery, 
        testNames: testGroup.tests, 
        groupKey: name
      } : 
      apiQuery,
    testGroup ? MATMultipleFetcher : MATFetcher,
    swrOptions
  )
  const [chartData, rowKeys, rowLabels] = useMemo(() => {
    if (!data) {
      return [null, 0]
    }
    let chartData = testGroup ? data : data.data
    const graphQuery = testGroup ? {...queryParams, axis_y: name} : queryParams
    const [reshapedData, rowKeys, rowLabels] = prepareDataForGridChart(chartData, graphQuery)
    return [reshapedData, rowKeys, rowLabels]
  }, [data, queryParams, name, testGroup])

  const headerOptions = { probe_cc: false, subtitle: false }

  return (
    <MATContextProvider key={name} test_name={name} {...queryParams}>
      <Flex flexDirection='column' mb={60}>
        <Box><Heading h={3} mt={40} mb={20}>{title}</Heading></Box>
        <Box>
          {(!chartData && !error) ? (
            <FormattedMessage id="General.Loading" />
          ) : (
            chartData === null || chartData.length === 0 ? (
              <Heading h={5}><FormattedMessage id="General.NoData" /></Heading>
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

export default Chart
