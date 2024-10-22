import axios from 'axios'
import { useRouter } from 'next/router'
import { memo, useMemo } from 'react'
import { useIntl } from 'react-intl'
import useSWR from 'swr'

import GridChart, {
  prepareDataForGridChart,
} from '../aggregation/mat/GridChart'
import { MATContextProvider } from '../aggregation/mat/MATContext'
import { axiosResponseTime } from '../axios-plugins'
import { DetailsBox } from '../measurement/DetailsBox'
import { testNames } from '../test-info'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const baseURL = process.env.NEXT_PUBLIC_OONI_API
axiosResponseTime(axios)

// TODO export from mat.js
const fetcher = (query) => {
  const reqUrl = `${baseURL}/api/v1/aggregation?${query}`
  return axios
    .get(reqUrl)
    .then((r) => {
      if (!r?.data?.result) {
        const error = new Error(
          `Request ${reqUrl} did not contain expected result`,
        )
        error.data = r
        throw error
      }
      return {
        data: r.data.result,
        loadTime: r.loadTime,
        url: r.config.url,
      }
    })
    .catch((e) => {
      console.log(e)
      e.message = e?.request?.response ?? e.message
      throw e
    })
}
const fixedQuery = {
  axis_x: 'measurement_start_day',
  axis_y: 'probe_cc',
}

const Chart = memo(function Chart({ testName }) {
  const intl = useIntl()
  const {
    query: { probe_cc, since, until },
  } = useRouter()

  // Construct a `query` object that matches the router.query
  // used by MAT, because in this case axis_x, axis_y are not part
  // of router.query
  const query = useMemo(
    () => ({
      ...fixedQuery,
      test_name: testName,
      since,
      until,
      ...(probe_cc && { probe_cc }),
      time_grain: 'day',
    }),
    [since, testName, until, probe_cc],
  )

  const apiQuery = useMemo(() => {
    const qs = new URLSearchParams(query).toString()
    return qs
  }, [query])

  const { data, error } = useSWR(
    () => (since && until ? apiQuery : null),
    fetcher,
    swrOptions,
  )

  const [chartData, rowKeys, rowLabels] = useMemo(() => {
    if (!data) {
      return [null, 0]
    }

    const chartData = data.data.sort((a, b) =>
      new Intl.Collator(intl.locale).compare(a.probe_cc, b.probe_cc),
    )

    const [reshapedData, rowKeys, rowLabels] = prepareDataForGridChart(
      chartData,
      query,
      intl.locale,
    )

    return [reshapedData, rowKeys, rowLabels]
  }, [data, probe_cc, query, intl])

  const headerOptions = { probe_cc: false, subtitle: false }

  return (
    <div className="flex flex-col mt-6">
      <h3>{testNames[testName].name}</h3>
      <div>
        {!chartData && !error ? (
          <div>{intl.formatMessage({ id: 'General.Loading' })}</div>
        ) : (
          <GridChart
            data={chartData}
            rowKeys={rowKeys}
            rowLabels={rowLabels}
            header={headerOptions}
          />
        )}
      </div>
      {error && (
        <DetailsBox
          content={
            <details>
              <summary>
                <span>
                  {intl.formatMessage({ id: 'General.Error' })}: {error.message}
                </span>
              </summary>
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </details>
          }
        />
      )}
    </div>
  )
})

const testsOnPage = ['psiphon', 'tor', 'torsf']

const ChartsContainer = () => {
  return testsOnPage.map((testName) => (
    <MATContextProvider key={testName} test_name={testName} {...fixedQuery}>
      <Chart testName={testName} />
    </MATContextProvider>
  ))
}

export default ChartsContainer
