import GridChart, {
  prepareDataForGridChart,
} from 'components/aggregation/mat/GridChart'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'
import { DetailsBox } from 'components/measurement/DetailsBox'
import Link from 'next/link'
import { memo, useEffect, useMemo } from 'react'
import { MdBarChart, MdOutlineFileDownload } from 'react-icons/md'
import { FormattedMessage, useIntl } from 'react-intl'
import { MATFetcher } from 'services/fetchers'
import useSWR from 'swr'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

export const MATLink = ({ query }) => {
  const intl = useIntl()
  const queryToSearchParams = new URLSearchParams(query)
  const apiUrl = `${process.env.NEXT_PUBLIC_OONI_API}/api/v1/aggregation?${queryToSearchParams}`

  const showMATButton = !Array.isArray(query.test_name)

  return (
    <div className="flex mt-4 justify-between items-center flex-wrap gap-4">
      {showMATButton && (
        <Link href={`/chart/mat?${queryToSearchParams}`}>
          <button type="button" className="btn btn-primary-hollow">
            {intl.formatMessage({ id: 'MAT.Charts.SeeOnMAT' })}{' '}
            <MdBarChart size={20} style={{ verticalAlign: 'bottom' }} />
          </button>
        </Link>
      )}
      <div className="flex gap-4">
        <Link className="inline-flex" href={apiUrl}>
          {intl.formatMessage({ id: 'MAT.Charts.DownloadJSONData' })}{' '}
          <MdOutlineFileDownload size={20} />
        </Link>
        <Link className="inline-flex" href={`${apiUrl}&format=CSV`}>
          {intl.formatMessage({ id: 'MAT.Charts.DownloadCSVData' })}{' '}
          <MdOutlineFileDownload size={20} />
        </Link>
      </div>
    </div>
  )
}

const Chart = memo(function Chart({
  testGroup = null,
  queryParams = {},
  setState,
}) {
  const apiQuery = useMemo(() => {
    const qs = new URLSearchParams(queryParams).toString()
    return qs
  }, [queryParams])

  const { data, error } = useSWR(apiQuery, MATFetcher, swrOptions)

  const [chartData, rowKeys, rowLabels] = useMemo(() => {
    if (!data) {
      return [null, 0]
    }
    const chartData = data.data
    const graphQuery = queryParams
    const [reshapedData, rowKeys, rowLabels] = prepareDataForGridChart(
      chartData,
      graphQuery,
    )
    return [reshapedData, rowKeys, rowLabels]
  }, [data, queryParams])

  useEffect(() => {
    if (setState && data?.data) setState(data.data)
  }, [data, setState])

  const headerOptions = { probe_cc: false, subtitle: false }

  return (
    // <MATContextProvider key={name} test_name={name} {...queryParams}>
    <MATContextProvider {...queryParams}>
      <div className="flex flex-col">
        {!chartData && !error ? (
          <FormattedMessage id="General.Loading" />
        ) : (
          <>
            <GridChart
              data={chartData}
              rowKeys={rowKeys}
              rowLabels={rowLabels}
            />
            {!!chartData?.size && <MATLink query={queryParams} />}
          </>
        )}
        {error && (
          <DetailsBox
            collapsed={false}
            content={
              <>
                <details>
                  <summary>
                    <span>Error: {error.message}</span>
                  </summary>
                  <pre>{JSON.stringify(error, null, 2)}</pre>
                </details>
              </>
            }
          />
        )}
      </div>
    </MATContextProvider>
  )
})

export default Chart
