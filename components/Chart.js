import GridChart, {
  prepareDataForGridChart,
} from 'components/aggregation/mat/GridChart'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'
import { DetailsBox } from 'components/measurement/DetailsBox'
import NLink from 'next/link'
import { memo, useEffect, useMemo } from 'react'
import { MdBarChart, MdOutlineFileDownload } from 'react-icons/md'
import { FormattedMessage, useIntl } from 'react-intl'
import { MATFetcher } from 'services/fetchers'
import useSWR from 'swr'
import { StyledHollowButton } from './SharedStyledComponents'

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
        <NLink href={`/chart/mat?${queryToSearchParams}`}>
          <StyledHollowButton>
            {intl.formatMessage({ id: 'MAT.Charts.SeeOnMAT' })}{' '}
            <MdBarChart size={20} style={{ verticalAlign: 'bottom' }} />
          </StyledHollowButton>
        </NLink>
      )}
      <div className="flex gap-4 flex-wrap">
        <NLink href={apiUrl}>
          {intl.formatMessage({ id: 'MAT.Charts.DownloadJSONData' })}{' '}
          <MdOutlineFileDownload
            style={{ verticalAlign: 'bottom' }}
            size={20}
          />
        </NLink>
        <NLink href={`${apiUrl}&format=CSV`}>
          {intl.formatMessage({ id: 'MAT.Charts.DownloadCSVData' })}{' '}
          <MdOutlineFileDownload
            style={{ verticalAlign: 'bottom' }}
            size={20}
          />
        </NLink>
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
