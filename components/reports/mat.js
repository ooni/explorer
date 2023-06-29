import { Box, Container } from 'ooni-components'
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

const baseURL = process.env.NEXT_PUBLIC_OONI_API
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

const MAT = ({ link }) => {
  const today = dayjs.utc().add(1, 'day')
  const monthAgo = dayjs.utc(today).subtract(1, 'month')

  let searchParams

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
  console.log('searchParams', searchParams)
  const { data, error, isValidating } = useSWR(searchParams ? query : null, fetcher, swrOptions)

  const showLoadingIndicator = useMemo(() => isValidating, [isValidating])
  console.log('data', data)
  return (
    <Box my={3}>
      {data ? (
        <MATContextProvider queryParams={searchParams}>
          {error && <NoCharts message={error?.info ?? JSON.stringify(error)} />}
          <Box sx={{ minHeight: '500px' }}>
            {showLoadingIndicator && (
              <Box>
                {/* <h2>{intl.formatMessage({id: 'General.Loading'})}</h2> */}
                <h2>LOADING</h2>
              </Box>
            )}
            {data && data.data.dimension_count == 0 && <FunnelChart data={data.data.result} />}
            {data && data.data.dimension_count == 1 && (
              <StackedBarChart data={data} query={query} />
            )}
            {data && data.data.dimension_count > 1 && (
              <TableView data={data.data.result} query={query} />
            )}
          </Box>
        </MATContextProvider>
      ) : (
        <>Chart not available</>
      )}
    </Box>
  )
}

export default MAT
