import { useMemo } from 'react'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '/lib/api'
import { simpleFetcher } from 'services/fetchers'

function normalizeString(str) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

export const convertDatesData = (data) => {
  return data
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

export const sortData = (data, sortValue) =>
  data
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

export const filterData = (data, searchValue) =>
  data.filter((incident) => {
    const normalizedSearchValue = normalizeString(searchValue).toLowerCase()
    return searchValue
      ? normalizeString(incident.title)
          .toLowerCase()
          .includes(normalizedSearchValue) ||
          normalizeString(incident.short_description)
            .toLowerCase()
            .includes(normalizedSearchValue)
      : true
  })

const useFindings = ({
  sortValue = 'end_desc',
  searchValue = '',
  themeValue = null,
  params = {},
}) => {
  const { data, isLoading, error } = useSWR(
    // apiEndpoints.SEARCH_INCIDENTS,
    [apiEndpoints.SEARCH_INCIDENTS, params],
    // fetcher,
    simpleFetcher,
    { shouldRetryOnError: false },
  )

  const displayData = useMemo(() => {
    if (data) {
      return convertDatesData(data)
    }
    return []
  }, [data])

  const sortedAndFilteredData = useMemo(() => {
    let data = sortData(displayData, sortValue)

    if (searchValue.length) {
      data = filterData(data, searchValue)
    }

    if (themeValue?.length) {
      data = data.filter((f) => f.themes.includes(themeValue))
    }

    return data
  }, [displayData, sortValue, searchValue, themeValue])

  return {
    sortedAndFilteredData,
    isLoading,
    error,
  }
}

export default useFindings
