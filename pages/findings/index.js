import { StickySubMenu } from 'components/SharedStyledComponents'
import HighlightBox from 'components/landing/HighlightBox'
import SpinLoader from 'components/vendor/SpinLoader'
import useFilterWithSort from 'hooks/useFilterWithSort'
import useUser from 'hooks/useUser'
import Link from 'next/link'
import { Input, Select } from 'ooni-components'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import useSWR from 'swr'
import { formatLongDate } from 'utils'
import { apiEndpoints, fetcher } from '/lib/api'

const sortOptions = [
  { key: 'start_asc', intlKey: 'Sort.StartAsc' },
  { key: 'start_desc', intlKey: 'Sort.StartDesc' },
  { key: 'end_asc', intlKey: 'Sort.EndAsc' },
  { key: 'end_desc', intlKey: 'Sort.EndDesc' },
]

const Index = () => {
  const intl = useIntl()
  const { user } = useUser()

  const { data, isLoading, error } = useSWR(
    apiEndpoints.SEARCH_INCIDENTS,
    fetcher,
  )

  const { searchValue, sortValue, setSortValue, debouncedSearchHandler } =
    useFilterWithSort({ initialSortValue: 'end_desc' })

  const displayData = useMemo(() => {
    if (data) {
      return data.incidents
        .filter((incident) => incident.published)
        .map((incident) => ({
          ...incident,
          start_time: new Date(incident.start_time),
          ...(incident.end_time && { end_time: new Date(incident.end_time) }),
          sort_end_time: incident.end_time
            ? new Date(incident.end_time)
            : new Date(),
        }))
    }
    return []
  }, [data])

  const sortedAndFilteredData = useMemo(() => {
    const sortedData = displayData
      .sort((a, b) => b.start_time - a.start_time) // make sure ongoing events are always chronologically sorted
      .sort((a, b) => {
        if (sortValue === 'start_asc') {
          return a.start_time - b.start_time
        }
        if (sortValue === 'start_desc') {
          return b.start_time - a.start_time
        }
        if (sortValue === 'end_asc') {
          return a.sort_end_time - b.sort_end_time
        }
        // default to 'end_desc' sort
        return b.sort_end_time - a.sort_end_time
      })

    const filteredData = searchValue.length
      ? sortedData.filter((incident) =>
          searchValue
            ? incident.title
                .toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              incident.short_description
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            : true,
        )
      : sortedData

    return filteredData
  }, [displayData, sortValue, searchValue])

  return (
    <>
      {/* <Head>
        <title></title>
      </Head> */}
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
              <HighlightBox
                key={incident.id}
                countryCode={incident.CCs[0]}
                title={incident.title}
                text={incident.short_description}
                dates={
                  <div className="text-gray-600">
                    <div className=" mb-2">
                      {incident.start_time &&
                        formatLongDate(incident.start_time, intl.locale)}{' '}
                      -{' '}
                      {incident.end_time
                        ? formatLongDate(incident.end_time, intl.locale)
                        : 'ongoing'}
                    </div>
                    <div>
                      {intl.formatMessage(
                        { id: 'Findings.Index.HighLightBox.CreatedOn' },
                        {
                          date:
                            incident?.create_time &&
                            formatLongDate(incident?.create_time, intl.locale),
                        },
                      )}
                    </div>
                  </div>
                }
                footer={
                  <div className="mx-auto mt-4">
                    <Link href={`/findings/${incident.id}`}>
                      <button
                        className="btn btn-primary-hollow btn-sm"
                        type="button"
                      >
                        {intl.formatMessage({
                          id: 'Findings.Index.HighLightBox.ReadMore',
                        })}
                      </button>
                    </Link>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Index
