// TODO: refactor to use the same chart for circumvention tools and domains (no request on probe_cc change)
import GridChart, { prepareDataForGridChart } from 'components/aggregation/mat/GridChart'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'
import { MATLink } from 'components/Chart'
import { DetailsBox } from 'components/measurement/DetailsBox'
import { useRouter } from 'next/router'
import { Box, Flex, Heading } from 'ooni-components'
import React, { useEffect, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { MATFetcher } from 'services/fetchers'
import useSWR from 'swr'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const Chart = React.memo(function Chart({testGroup = null, queryParams = {}, setState}) {
  const {query: { probe_cc }} = useRouter()
  const {locale} = useIntl()

  const apiQuery = useMemo(() => {
    const qs = new URLSearchParams(queryParams).toString()
    return qs
  }, [queryParams])

  const { data, error } = useSWR(
    apiQuery,
    MATFetcher,
    swrOptions
  )

  const [chartData, rowKeys, rowLabels] = useMemo(() => {
    if (!data) {
      return [null, 0]
    }

    let chartData = data.data.sort((a, b) => (new Intl.Collator(locale).compare(a.probe_cc, b.probe_cc)))

    if (probe_cc) chartData = chartData.filter(d => probe_cc === d.probe_cc)

    const [reshapedData, rowKeys, rowLabels] = prepareDataForGridChart(chartData, queryParams, locale)

    return [reshapedData, rowKeys, rowLabels]

  }, [data, queryParams, probe_cc, locale])

  useEffect(()=> {
    if (setState && data?.data) setState(data.data)
  }, [data, setState])

  const headerOptions = { probe_cc: false, subtitle: false }
  const linkParams = {...queryParams, ... probe_cc && {probe_cc}}

  return (
    // <MATContextProvider key={name} test_name={name} {...queryParams}>
    <MATContextProvider {...queryParams}>
      <Flex flexDirection='column'>
        <Box>
          {(!chartData && !error) ? (
            <FormattedMessage id="General.Loading" />
          ) : (
            <>
              <GridChart
                data={chartData}
                rowKeys={rowKeys}
                rowLabels={rowLabels}
              />
              {!!chartData?.size && <MATLink query={linkParams} />}
            </>
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
