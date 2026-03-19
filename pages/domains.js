import { CategoryBadge } from 'components/Badge'
import GridLoader from 'components/GridLoader'
import { StickySubMenu } from 'components/SharedStyledComponents'
import { getCategoryCodesMap } from 'components/utils/categoryCodes'
import useFilterWithSort from 'hooks/useFilterWithSort'
import Head from 'next/head'
import { Input, Select } from 'ooni-components'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { simpleFetcher } from 'services/fetchers'
import useSWR from 'swr'
import VirtualizedGrid from '/components/VirtualizedGrid'

const categoryCodes = [...getCategoryCodesMap().keys()]

const sortOptions = [
  { key: 'domain_asc', intlKey: 'Sort.DomainAsc' },
  { key: 'domain_desc', intlKey: 'Sort.DomainDesc' },
  { key: 'measurements_asc', intlKey: 'Sort.MeasurementCountAsc' },
  { key: 'measurements_desc', intlKey: 'Sort.MeasurementCountDesc' },
  { key: 'category_asc', intlKey: 'Sort.CategoryNameAsc' },
  { key: 'category_desc', intlKey: 'Sort.CategoryNameDesc' },
]

const Domains = () => {
  const { data, error } = useSWR('/api/_/domains', simpleFetcher)
  const intl = useIntl()

  const {
    searchValue,
    sortValue,
    setSortValue,
    categoryValue,
    setCategoryValue,
    debouncedSearchHandler,
  } = useFilterWithSort({ initialSortValue: 'measurements_desc' })

  const displayData = useMemo(() => {
    if (data) {
      return data
        .filter(
          (
            value,
            index,
            self, // first remove duplicates
          ) =>
            index ===
            self.findIndex((d) => d.domain_name === value.domain_name),
        )
        .map((domain) => ({
          ...domain,
          title: <div className="break-words">{domain.domain_name}</div>,
          id: domain.domain_name,
          tag: <CategoryBadge categoryCode={domain.category_code} />,
          count: domain.measurement_count,
          href: `/domain/${domain.domain_name}`,
        }))
    }
    return []
  }, [data])

  const sortedAndFilteredData = useMemo(() => {
    const sortedData = displayData.sort((a, b) => {
      if (sortValue === 'measurements_asc') {
        return a.count - b.count
      }
      if (sortValue === 'measurements_desc') {
        return b.count - a.count
      }
      if (sortValue === 'domain_desc') {
        return b.domain_name.localeCompare(a.domain_name, intl.locale, {
          numeric: true,
        })
      }
      if (sortValue === 'category_asc') {
        return a.category_code.localeCompare(b.category_code, intl.locale)
      }
      if (sortValue === 'category_desc') {
        return b.category_code.localeCompare(a.category_code, intl.locale)
      }
      // default to 'domain_asc' sort
      return a.domain_name.localeCompare(b.domain_name, intl.locale, {
        numeric: true,
      })
    })

    const filteredData =
      !!searchValue.length || !!categoryValue.length
        ? sortedData.filter((domain) => {
            const fitsSearchValue = searchValue
              ? domain.domain_name
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              : true
            const fitsCategoryCode = categoryValue
              ? categoryValue === domain.category_code
              : true
            return fitsSearchValue && fitsCategoryCode
          })
        : sortedData

    return filteredData
  }, [displayData, sortValue, searchValue, categoryValue, intl.locale])

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({ id: 'General.OoniExplorer' })} |{' '}
          {intl.formatMessage({ id: 'Domains.Title' })}
        </title>
      </Head>
      <div className="container">
        <StickySubMenu
          topClass="top-[116px]"
          title={
            <>
              {intl.formatMessage({ id: 'Domains.Title' })}{' '}
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
          <div className="flex gap-4 flex-col md:flex-row w-full sm:w-auto">
            <Input
              onChange={(e) => debouncedSearchHandler(e.target.value)}
              placeholder={intl.formatMessage({
                id: 'Domains.SearchPlaceholder',
              })}
              error={
                searchValue &&
                sortedAndFilteredData?.length === 0 &&
                intl.formatMessage({ id: 'Domains.SearchError' })
              }
            />
            <Select onChange={(e) => setCategoryValue(e.target.value)}>
              <option value="">
                {intl.formatMessage({ id: 'Domains.AllCategories' })}
              </option>
              {categoryCodes.map((key) => (
                <option key={key} value={key}>
                  {intl.formatMessage({ id: `CategoryCode.${key}.Name` })}
                </option>
              ))}
            </Select>
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
            <GridLoader />
          )}
        </div>
      </div>
    </>
  )
}

export default Domains
