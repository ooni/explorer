import { useMemo } from 'react'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from 'lib/api'
import { simpleFetcher } from 'services/fetchers'

function normalizeString(str) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

// Ongoing findings have no end_time. Use one shared sentinel so they tie on
// end-date sorts and fall through to start_time
const ONGOING_SORT_END = new Date(8640000000000000)

export const convertDatesData = (data) => {
  return data
    .filter((incident) => incident.published)
    .map((incident) => ({
      ...incident,
      start_time: new Date(incident.start_time),
      ...(incident.end_time && { end_time: new Date(incident.end_time) }),
      sort_end_time: incident.end_time
        ? new Date(incident.end_time)
        : ONGOING_SORT_END,
    }))
}

export const sortData = (data, sortValue) =>
  [...data].sort((a, b) => {
    if (sortValue === 'start_asc') {
      return a.start_time - b.start_time
    }
    if (sortValue === 'start_desc') {
      return b.start_time - a.start_time
    }
    if (sortValue === 'end_asc') {
      const byEnd = a.sort_end_time - b.sort_end_time
      return byEnd !== 0 ? byEnd : a.start_time - b.start_time
    }
    // default to 'end_desc': ongoing first, then by start_time among ties
    const byEnd = b.sort_end_time - a.sort_end_time
    return byEnd !== 0 ? byEnd : b.start_time - a.start_time
  })

export const getSortedAndFilteredFindings = (data, { sortValue = 'end_desc', searchValue = '', themeValue = null } = {}) => {
  if (!data) return []
  let result = sortData(convertDatesData(data), sortValue)
  if (searchValue.length) {
    result = filterData(result, searchValue)
  }
  if (themeValue?.length) {
    result = result.filter((f) => f.themes.includes(themeValue))
  }
  return result
}

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
    [apiEndpoints.SEARCH_INCIDENTS, params],
    simpleFetcher,
    { shouldRetryOnError: false },
  )

  const sortedAndFilteredData = useMemo(
    () => getSortedAndFilteredFindings(data, { sortValue, searchValue, themeValue }),
    [data, sortValue, searchValue, themeValue],
  )

  return {
    sortedAndFilteredData,
    isLoading,
    error,
  }
}

export default useFindings
