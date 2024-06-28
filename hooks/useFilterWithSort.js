import debounce from 'lodash.debounce'
import { useMemo, useState } from 'react'

const useFilterWithSort = ({ initialSortValue, initialFilterValue = '' }) => {
  const [searchValue, setSearchValue] = useState('')
  const [categoryValue, setCategoryValue] = useState('')
  const [sortValue, setSortValue] = useState(initialSortValue)

  const searchHandler = (searchTerm) => {
    setSearchValue(searchTerm)
  }

  const debouncedSearchHandler = useMemo(() => debounce(searchHandler, 200), [])

  return {
    searchValue,
    sortValue,
    setSortValue,
    categoryValue,
    setCategoryValue,
    debouncedSearchHandler,
  }
}

export default useFilterWithSort
