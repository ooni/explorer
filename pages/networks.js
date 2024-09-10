import { useMemo } from 'react'

import GridLoader from 'components/GridLoader'
import { StickySubMenu } from 'components/SharedStyledComponents'
import VirtualizedGrid from 'components/VirtualizedGrid'
import useFilterWithSort from 'hooks/useFilterWithSort'
import Head from 'next/head'
import { Input, Select } from 'ooni-components'
import { useIntl } from 'react-intl'
import { simpleFetcher } from 'services/fetchers'
import useSWR from 'swr'

const sortOptions = [
  { key: 'asn_asc', intlKey: 'Sort.AsnAsc' },
  { key: 'asn_desc', intlKey: 'Sort.AsnDesc' },
  { key: 'measurements_asc', intlKey: 'Sort.MeasurementCountAsc' },
  { key: 'measurements_desc', intlKey: 'Sort.MeasurementCountDesc' },
]

const Networks = () => {
  const intl = useIntl()
  const { data, error } = useSWR('/api/_/networks', simpleFetcher)

  const { searchValue, sortValue, setSortValue, debouncedSearchHandler } =
    useFilterWithSort({ initialSortValue: 'measurements_desc' })

  const displayData = useMemo(() => {
    if (data) {
      return data.map((asn) => ({
        ...asn,
        title: (
          <>
            <div>{`AS${asn.probe_asn}`}</div>
            <div>{asn.org_name}</div>
          </>
        ),
        id: `AS${asn.probe_asn}`,
        count: asn.cnt,
        href: `/as/AS${asn.probe_asn}`,
      }))
    }
    return []
  }, [data])

  const sortedAndFilteredData = useMemo(() => {
    const sortedData = displayData.sort((a, b) => {
      if (sortValue === 'asn_desc') {
        return b.probe_asn - a.probe_asn
      }
      if (sortValue === 'measurements_asc') {
        return a.count - b.count
      }
      if (sortValue === 'measurements_desc') {
        return b.count - a.count
      }
      // use 'asn_asc' as default
      return a.probe_asn - b.probe_asn
    })

    const filteredData = searchValue.length
      ? sortedData.filter(
          (asn) =>
            asn.probe_asn.toString().includes(searchValue.toLowerCase()) ||
            asn.org_name.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : sortedData

    return filteredData
  }, [displayData, sortValue, searchValue])

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({ id: 'General.OoniExplorer' })} |{' '}
          {intl.formatMessage({ id: 'Networks.Title' })}
        </title>
      </Head>
      <div className="container">
        <StickySubMenu
          topClass="top-[116px]"
          title={
            <>
              {intl.formatMessage({ id: 'Networks.Title' })}{' '}
              {!!sortedAndFilteredData.length && (
                <>
                  (
                  {new Intl.NumberFormat().format(sortedAndFilteredData.length)}
                  )
                </>
              )}
            </>
          }
        >
          <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
            <Input
              onChange={(e) => debouncedSearchHandler(e.target.value)}
              placeholder={intl.formatMessage({
                id: 'Networks.SearchPlaceholder',
              })}
              error={
                searchValue &&
                !sortedAndFilteredData.length && (
                  <>{intl.formatMessage({ id: 'Networks.SearchError' })} </>
                )
              }
            />
            <Select
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
            >
              {sortOptions.map(({ key, intlKey }) => (
                <option key={key} value={key}>
                  {intl.formatMessage({ id: intlKey })}
                </option>
              ))}
            </Select>
          </div>
        </StickySubMenu>
        <div className="mt-8">
          {displayData.length ? (
            <VirtualizedGrid data={sortedAndFilteredData} />
          ) : (
            <div className="mt-8">
              <GridLoader />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Networks
