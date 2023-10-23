import { Box, Text } from 'ooni-components'
import { StackedBarChart } from 'components/aggregation/mat/StackedBarChart'
import { FunnelChart } from 'components/aggregation/mat/FunnelChart'
import { NoCharts } from 'components/aggregation/mat/NoCharts'
import TableView from 'components/aggregation/mat/TableView'
import { useMemo } from 'react'
import useSWR from 'swr'
import dayjs from 'services/dayjs'
import { axiosResponseTime } from 'components/axios-plugins'
import axios from 'axios'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'
import { useIntl } from 'react-intl'
import { FormattedMarkdownBase } from './FormattedMarkdown'

axiosResponseTime(axios)

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const fetcher = (query) => {
  const qs = new URLSearchParams(query).toString()
  const reqUrl = `${process.env.NEXT_PUBLIC_OONI_API}/api/v1/aggregation?${qs}`
  console.debug(`API Query: ${reqUrl}`)
  return axios
    .get(reqUrl)
    .then((r) => {
      return {
        data: r.data,
        loadTime: r.loadTime,
        url: r.config.url,
      }
    })
    .catch((e) => {
      // throw new Error(e?.response?.data?.error ?? e.message)
      const error = new Error('An error occurred while fetching the data.')
      // Attach extra info to the error object.
      error.info = e.response.data.error
      error.status = e.response.status
      throw error
    })
}

export const MATChartReportWrapper = ({link, caption}) => {
  let searchParams
  const today = dayjs.utc().add(1, 'day')
  const monthAgo = dayjs.utc(today).subtract(1, 'month')

  try {
    if (link) searchParams = Object.fromEntries(new URL(link).searchParams)
  } catch (e) {
    console.log('e', link, e)
    searchParams = null
  }

  //TODO: make sure searchParams are only the ones that are allowed
  const query = {
    test_name: 'web_connectivity',
    axis_x: 'measurement_start_day',
    since: monthAgo.format('YYYY-MM-DD'),
    until: today.format('YYYY-MM-DD'),
    time_grain: 'day',
    ...searchParams,
  }

  return !!searchParams && 
    <Box my={4}>
      <MATChart query={query} showFilters={false} />
      {caption && (
        <Text fontSize={1} mt={2}>
          <FormattedMarkdownBase>{caption}</FormattedMarkdownBase>
        </Text>
      )}
    </Box>
}

const MATChart = ({ query, showFilters = true }) => {
  const intl = useIntl()
  const { data, error, isValidating } = useSWR(query ? query : null, fetcher, swrOptions)

  const showLoadingIndicator = useMemo(() => isValidating, [isValidating])
  return (
    <Box>  
      <MATContextProvider queryParams={query}>
        {error && <NoCharts message={error?.info ?? JSON.stringify(error)} />}
        <Box>
          {showLoadingIndicator ? (
            <Box>
              <h2>{intl.formatMessage({ id: 'General.Loading' })}</h2>
            </Box>
          ) : (
            <>
              {data?.data?.result?.length > 0 ? 
                <Box sx={{ minHeight: '500px' }}>
                  {data && data.data.dimension_count == 0 && <FunnelChart data={data.data.result} />}
                  {data && data.data.dimension_count == 1 && <StackedBarChart data={data.data.result} query={query} />}
                  {data && data.data.dimension_count > 1 && (
                    <TableView data={data.data.result} query={query} showFilters={showFilters} />
                  )}
                </Box> : <NoCharts />
              }
            </>
          )}
        </Box>
      </MATContextProvider>
    </Box>
  )
}

export default MATChart
