import axios from 'axios'
import { FunnelChart } from 'components/aggregation/mat/FunnelChart'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'
import { NoCharts } from 'components/aggregation/mat/NoCharts'
import { StackedBarChart } from 'components/aggregation/mat/StackedBarChart'
import TableView from 'components/aggregation/mat/TableView'
import { axiosResponseTime } from 'components/axios-plugins'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import useSWR from 'swr'
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

export const MATChartWrapper = ({ link, caption }) => {
  let searchParams
  const captionText = typeof caption === 'string' ? caption : ''
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

  return (
    !!searchParams && (
      <div className="my-8">
        <MATChart query={query} showFilters={false} />
        {caption && (
          <div className="mt-2">
            <FormattedMarkdownBase>{captionText}</FormattedMarkdownBase>
          </div>
        )}
      </div>
    )
  )
}

const MATChart = ({ query, showFilters = true }) => {
  const intl = useIntl()
  const { data, error, isValidating } = useSWR(
    query ? query : null,
    fetcher,
    swrOptions,
  )

  const showLoadingIndicator = useMemo(() => isValidating, [isValidating])
  return (
    <>
      <MATContextProvider queryParams={query}>
        {error && <NoCharts message={error?.info ?? JSON.stringify(error)} />}
        <>
          {showLoadingIndicator ? (
            <h2>{intl.formatMessage({ id: 'General.Loading' })}</h2>
          ) : (
            <>
              {data?.data?.result?.length > 0 ? (
                <>
                  {data && data.data.dimension_count === 0 && (
                    <FunnelChart data={data.data.result} />
                  )}
                  {data && data.data.dimension_count === 1 && (
                    <StackedBarChart data={data.data.result} query={query} />
                  )}
                  {data && data.data.dimension_count > 1 && (
                    <TableView
                      data={data.data.result}
                      query={query}
                      showFilters={showFilters}
                    />
                  )}
                </>
              ) : (
                <NoCharts />
              )}
            </>
          )}
        </>
      </MATContextProvider>
    </>
  )
}

export default MATChart
