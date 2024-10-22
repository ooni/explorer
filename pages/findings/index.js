import { FindingBox } from 'components/landing/HighlightBox'
import { StickySubMenu } from 'components/SharedStyledComponents'
import SpinLoader from 'components/vendor/SpinLoader'
import useFilterWithSort from 'hooks/useFilterWithSort'
import useFindings from 'hooks/useFindings'
import useUser from 'hooks/useUser'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Input, Select } from 'ooni-components'
import { useIntl } from 'react-intl'

const sortOptions = [
  { key: 'start_asc', intlKey: 'Sort.StartAsc' },
  { key: 'start_desc', intlKey: 'Sort.StartDesc' },
  { key: 'end_asc', intlKey: 'Sort.EndAsc' },
  { key: 'end_desc', intlKey: 'Sort.EndDesc' },
]

const themeOptions = [
  { key: '' },
  { key: 'social_media', intlKey: 'Sort.StartAsc' },
  { key: 'circumvention', intlKey: 'Sort.StartDesc' },
  { key: 'news_media', intlKey: 'Sort.EndAsc' },
  // { key: 'end_desc', intlKey: 'Sort.EndDesc' },
]

const Index = () => {
  const intl = useIntl()
  const { user } = useUser()
  const { query } = useRouter()
  const { theme } = query

  const {
    searchValue,
    sortValue,
    setSortValue,
    debouncedSearchHandler,
    categoryValue,
    setCategoryValue,
  } = useFilterWithSort({
    initialSortValue: 'end_desc',
    initialCategoryValue: theme,
  })

  const { sortedAndFilteredData, isLoading, error } = useFindings({
    sortValue,
    searchValue,
    themeValue: categoryValue,
  })

  return (
    <>
      <div className="container">
        {user?.role === 'admin' && (
          <div className="mt-4 flex justify-end">
            <Link href="/findings/dashboard">
              <button className="btn btn-primary-hollow" type="button">
                {intl.formatMessage({ id: 'Findings.Dashboard.ShortTitle' })}
              </button>
            </Link>
          </div>
        )}
        <StickySubMenu
          title={
            <>
              {intl.formatMessage(
                { id: 'Findings.Index.Title' },
                { amount: sortedAndFilteredData.length },
              )}
            </>
          }
        >
          <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
            <Input
              onChange={(e) => debouncedSearchHandler(e.target.value)}
              placeholder={intl.formatMessage({
                id: 'Findings.Index.SearchPlaceholder',
              })}
              error={
                searchValue &&
                sortedAndFilteredData?.length === 0 && (
                  <>
                    {intl.formatMessage({ id: 'Findings.Index.SearchError' })}
                  </>
                )
              }
            />
            <Select
              value={categoryValue}
              onChange={(e) => setCategoryValue(e.target.value)}
            >
              {themeOptions.map(({ key, intlKey }) => (
                <option key={key} value={key}>
                  {key}
                  {/* {intl.formatMessage({ id: intlKey })} */}
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
        {isLoading && (
          <div className="container pt-32">
            <SpinLoader />
          </div>
        )}
        {!!sortedAndFilteredData?.length && (
          <div className="grid my-8 gap-6 grid-cols-1 md:grid-cols-2">
            {sortedAndFilteredData.map((incident) => (
              <FindingBox key={incident.id} incident={incident} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Index
