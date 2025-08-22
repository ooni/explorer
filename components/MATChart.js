import axios from 'axios'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'
import { NoCharts } from 'components/aggregation/mat/NoCharts'
import { StackedBarChart } from 'components/aggregation/mat/StackedBarChart'
import TableView from 'components/aggregation/mat/TableView'
import { axiosResponseTime } from 'components/axios-plugins'
import dayjs from 'services/dayjs'
import useSWR from 'swr'
import { ChartSpinLoader } from './Chart'
import { FormattedMarkdownBase } from './FormattedMarkdown'
import { useMemo } from 'react'
import { BlockingTypesProvider } from './aggregation/mat/BlockingTypesContext'

axiosResponseTime(axios)

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const fetcher = (query) => {
  const qs = new URLSearchParams(query).toString()
  let reqUrl = `${process.env.NEXT_PUBLIC_OONI_API}/api/v1/aggregation?${qs}`

  if (query.loni) {
    const { loni, v5, ...v5qs } = query
    if (loni === 'observations') {
      const axisX =
        v5qs.axis_x === 'measurement_start_day'
          ? '&group_by=timestamp'
          : `&group_by=${v5qs.axis_x}`
      const axisY = v5qs.axis_y ? `&group_by=${v5qs.axis_y}` : ''
      reqUrl = `https://api.dev.ooni.io/api/v1/aggregation/observations?group_by=failure${axisX}${axisY}&${new URLSearchParams(v5qs).toString()}`
    } else {
      reqUrl = `https://api.dev.ooni.io/api/v1/aggregation/analysis?${new URLSearchParams(v5qs).toString()}`
    }
  }
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

const getAllBlockingTypes = (data) => {
  return data.reduce((acc, obj) => {
    const failure = obj.failure
    if (acc[failure]) {
      acc[failure] += obj.observation_count
    } else {
      acc[failure] = obj.observation_count
    }
    return acc
  }, {})
}

const getSortedBlockingTypes = (OGdata) => {
  const blockingTypes = getAllBlockingTypes(OGdata)
  return Object.entries(blockingTypes)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key)
}

const getOutcomeBlockingTypes = (data) => {
  return [...new Set(data.map((item) => item.loni.blocked_max_outcome))]
}

const MATChart = ({ query, showFilters = true }) => {
  const { data, error, isValidating } = useSWR(
    query ? query : null,
    fetcher,
    swrOptions,
  )

  const results = useMemo(
    () => data?.data?.result || data?.data?.results || [],
    [data],
  )

  const allBlockingTypes = useMemo(() => {
    if (query.loni === 'observations') {
      return getSortedBlockingTypes(results)
    }
    if (query.loni === 'outcome') {
      return getOutcomeBlockingTypes(results)
    }
    return []
  }, [results, query])

  return (
    <>
      <MATContextProvider queryParams={query}>
        {error && <NoCharts message={error?.info ?? JSON.stringify(error)} />}

        {isValidating ? (
          <ChartSpinLoader height="500px" />
        ) : (
          <BlockingTypesProvider allBlockingTypes={allBlockingTypes}>
            {results.length > 0 || Object.keys(results).length ? (
              <>
                {((data && data.data.dimension_count === 1) ||
                  (data && query.axis_x && !query.axis_y)) && (
                  <StackedBarChart data={results} query={query} />
                )}
                {((data && data.data.dimension_count > 1) ||
                  (data && query.axis_x && query.axis_y)) && (
                  <TableView
                    data={results}
                    query={query}
                    showFilters={showFilters}
                  />
                )}
              </>
            ) : (
              <NoCharts />
            )}
          </BlockingTypesProvider>
        )}
      </MATContextProvider>
    </>
  )
}

export default MATChart
