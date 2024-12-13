import debounce from 'lodash.debounce'
import { useMemo, useState } from 'react'

const useFilterWithSort = ({ initialSortValue, initialCategoryValue = '' }) => {
  const [searchValue, setSearchValue] = useState('')
  const [categoryValue, setCategoryValue] = useState(initialCategoryValue)
  const [sortValue, setSortValue] = useState(initialSortValue)

  const searchHandler = (searchTerm) => {
    setSearchValue(searchTerm)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
