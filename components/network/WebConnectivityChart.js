import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Heading, Box, Flex } from 'ooni-components'
import useSWR from 'swr'
import GridChart, { prepareDataForGridChart } from 'components/aggregation/mat/GridChart'
import { DetailsBox } from 'components/measurement/DetailsBox'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'
import { FormattedMessage } from 'react-intl'
import { MATFetcher as fetcher } from 'services/fetchers'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const testName = 'web_connectivity'
const queryParams = { axis_x: 'measurement_start_day', axis_y: 'domain' }

const Chart = React.memo(function Chart() {
  const router = useRouter()
  const { query: {since, until, asn} } = router
  
  const query = useMemo(() => ({
    ...queryParams,
    probe_asn: asn,
    test_name: testName,
    since: since,
    until: until
  }), [since, until, asn])

  const apiQuery = useMemo(() => {
    const qs = new URLSearchParams(query).toString()
    return qs
  }, [query])

  const { data, error } = useSWR(
    apiQuery,
    fetcher,
    swrOptions
  )

  const [chartData, rowKeys, rowLabels] = useMemo(() => {
    if (!data) {
      return [null, 0]
    }
    let chartData = data.data
    const [reshapedData, rowKeys, rowLabels] = prepareDataForGridChart(chartData, query)
    return [reshapedData, rowKeys, rowLabels]
  }, [data, query])

  const headerOptions = { probe_cc: false, subtitle: false }

  return (
    <MATContextProvider key={testName} test_name={testName} {...queryParams}>
      <Flex flexDirection='column' mt={3}>
        <Box><Heading h={3}><FormattedMessage id='Tests.Groups.Webistes.Name' /></Heading></Box>
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

export default Chart