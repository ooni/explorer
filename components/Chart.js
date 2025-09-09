import GridChart, {
  prepareDataForGridChart,
} from 'components/aggregation/mat/GridChart'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'
import { DetailsBox } from 'components/measurement/DetailsBox'
import SpinLoader from 'components/vendor/SpinLoader'
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

export const ChartSpinLoader = ({ height = '300px' }) => {
  return (
    <div
      className="bg-gray-100 flex items-center justify-center p-6"
      style={{ height }}
    >
      <SpinLoader />
    </div>
  )
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

const Chart = ({ queryParams = {}, setState = null, headerOptions = {} }) => {
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

  return (
    <MATContextProvider
      allFailureTypes={[]}
      queryProps={queryParams}
      {...queryParams}
    >
      <div className="flex flex-col">
        <>
          <GridChart
            data={chartData}
            rowKeys={rowKeys}
            rowLabels={rowLabels}
            header={headerOptions}
          />
          {!!chartData?.size && <MATLink query={queryParams} />}
        </>
        {error && (
          <DetailsBox
            content={
              <details>
                <summary>
                  <span>Error: {error.message}</span>
                </summary>
                <pre>{JSON.stringify(error, null, 2)}</pre>
              </details>
            }
          />
        )}
      </div>
    </MATContextProvider>
  )
}

export default memo(Chart)
