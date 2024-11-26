import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  useAsyncDebounce,
  useFlexLayout,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'
import { useVirtual } from 'react-virtual'
import 'regenerator-runtime'

import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { DetailsBox } from '../../measurement/DetailsBox'
import { sortRows } from './computations'

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  )
})
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

const SearchFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
  groupedRows,
}) => {
  const count = groupedRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={intl.formatMessage(
        { id: 'MAT.Table.FilterPlaceholder' },
        { count },
      )}
    />
  )
}

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const intl = useIntl()
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || '')
  }, 200)

  useEffect(() => {
    if (!globalFilter || globalFilter === '') {
      setValue('')
    }
  }, [globalFilter])

  return (
    <div className="m-4">
      {intl.formatMessage({ id: 'MAT.Table.Search' })}{' '}
      <input
        className="border-0 outline-0"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={intl.formatMessage(
          { id: 'MAT.Table.FilterPlaceholder' },
          { count },
        )}
      />
    </div>
  )
}

const SortHandle = ({ isSorted, isSortedDesc }) => {
  return (
    <>{isSorted ? isSortedDesc ? <FaSortDown /> : <FaSortUp /> : <FaSort />}</>
  )
}

// This same reference is passed to GridChart when there are no rows to filter out
// Maybe this can also be `[]`
const noRowsSelected = null

const Filters = ({ data = [], tableData, setDataForCharts, query }) => {
  const intl = useIntl()
  const resetTableRef = useRef(false)
  const yAxis = query.axis_y

  const defaultColumn = useMemo(
    () => ({
      // When using the useFlexLayout:
      width: 70, // width is used for both the flex-basis and flex-grow
      Filter: SearchFilter,
      Cell: ({ value }) => {
        const intl = useIntl()
        return typeof value === 'number'
          ? intl.formatNumber(value, {})
          : String(value)
      },
    }),
    [],
  )

  // Aggregate by the first column
  const initialState = useMemo(
    () => ({
      hiddenColumns: ['yAxisCode'],
      sortBy: [{ id: 'yAxisLabel', desc: false }],
    }),
    [],
  )

  const getRowId = useCallback((row) => row[query.axis_y], [query.axis_y])

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({ id: `MAT.Table.Header.${yAxis}` }),
        Cell: ({ value, row }) => (
          <div className={row.isSelected && 'font-bold'}>{value}</div>
        ),
        id: 'yAxisLabel',
        accessor: 'rowLabel',
        filter: 'text',
        style: {
          width: '35%',
        },
      },
      {
        id: 'yAxisCode',
        accessor: yAxis,
        disableFilters: true,
      },
      {
        Header: <FormattedMessage id="MAT.Table.Header.anomaly_count" />,
        accessor: 'anomaly_count',
        width: 150,
        sortDescFirst: true,
        disableFilters: true,
        style: {
          textAlign: 'end',
        },
      },
      {
        Header: <FormattedMessage id="MAT.Table.Header.confirmed_count" />,
        accessor: 'confirmed_count',
        width: 150,
        sortDescFirst: true,
        disableFilters: true,
        style: {
          textAlign: 'end',
        },
      },
      {
        Header: <FormattedMessage id="MAT.Table.Header.failure_count" />,
        accessor: 'failure_count',
        width: 150,
        sortDescFirst: true,
        disableFilters: true,
        style: {
          textAlign: 'end',
        },
      },
      {
        Header: <FormattedMessage id="MAT.Table.Header.measurement_count" />,
        accessor: 'measurement_count',
        width: 150,
        sortDescFirst: true,
        disableFilters: true,
        style: {
          textAlign: 'end',
        },
      },
    ],
    [intl, yAxis],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows, // contains filtered rows
    toggleAllRowsSelected,
    selectedFlatRows,
    prepareRow,
    state,
    setGlobalFilter,
    preGlobalFilteredRows,
    globalFilteredRows,
  } = useTable(
    {
      columns,
      data: tableData,
      initialState,
      defaultColumn,
      getRowId,
    },
    useFlexLayout,
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Pseudo column for selection checkboxes
        {
          id: 'selection',
          width: 30,
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          // eslint-disable-next-line react/display-name
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          // eslint-disable-next-line react/display-name
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    },
  )

  const updateCharts = useCallback(() => {
    const selectedRows = Object.keys(state.selectedRowIds).sort((a, b) =>
      sortRows(a, b, query.axis_y, intl.locale),
    )

    if (
      selectedRows.length > 0 &&
      selectedRows.length !== preGlobalFilteredRows.length
    ) {
      setDataForCharts(selectedRows)
    } else {
      setDataForCharts(noRowsSelected)
    }
  }, [
    preGlobalFilteredRows.length,
    query.axis_y,
    state.selectedRowIds,
    setDataForCharts,
    intl.locale,
  ])

  /**
   * Reset the table filter
   * Note: doesn't reset the sort state
   */
  const resetFilter = useCallback(() => {
    // toggleAllRowsSelected() doesn't work after calling setGlobalFilter('')
    // so if globalFilter is set, then use resetTableRef to make it a two-step
    // reset (step 2 in the below useEffect)
    // otherwise, just toggle the selected rows and the reset is done
    if (!state.globalFilter) {
      toggleAllRowsSelected(false)
    } else {
      resetTableRef.current = true
      setGlobalFilter('')
    }
    setDataForCharts(noRowsSelected)
  }, [
    setGlobalFilter,
    state.globalFilter,
    toggleAllRowsSelected,
    setDataForCharts,
  ])

  useEffect(() => {
    if (state.globalFilter === undefined && resetTableRef.current === true) {
      resetTableRef.current = false
      toggleAllRowsSelected(false)
    }
  }, [state.globalFilter, toggleAllRowsSelected])

  const parentRef = useRef()

  const { virtualItems: virtualRows, totalSize } = useVirtual({
    size: rows.length,
    parentRef,
    overscan: 10,
    estimateSize: useCallback(() => 35, []),
  })

  return (
    <DetailsBox title={intl.formatMessage({ id: 'MAT.Table.Filters' })}>
      <div className="flex flex-col">
        <div className="flex mb-4 items-center">
          <button
            type="button"
            className="btn btn-primary-hollow"
            onClick={updateCharts}
          >
            {intl.formatMessage({ id: 'General.Apply' })}
          </button>
          <button
            type="button"
            className="btn btn-primary mx-3"
            onClick={resetFilter}
          >
            {intl.formatMessage({ id: 'General.Reset' })}
          </button>
        </div>
        <div className="flex-1">
          <div
            className="Table border border-black border-spacing-0"
            {...getTableProps()}
          >
            <div className="TableHeader last:border-b-2 last:border-black">
              {headerGroups.map((headerGroup, i) => (
                <div
                  className="TableRow flex h-auto mb-2 border-b border-black"
                  key={i}
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column, i) => {
                    return (
                      <div
                        className="Cell p-2 border-r border-black font-bold last:border-r-0"
                        key={i}
                        {...column.getHeaderProps([
                          {
                            style: column.style,
                          },
                        ])}
                      >
                        <span
                          className="flex items-center"
                          {...column.getSortByToggleProps()}
                        >
                          {column.render('Header')}
                          {column.canSort && (
                            <SortHandle
                              isSorted={column.isSorted}
                              isSortedDesc={column.isSortedDesc}
                            />
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              <div className="TableRow h-auto mb-2 border-b border-black">
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </div>
            </div>
            <div
              ref={parentRef}
              className="block h-[200px] overflow-auto w-full"
            >
              <div
                className="TableBody h-[250px] overflow-auto block relative"
                style={{
                  height: `${totalSize}px`,
                }}
              >
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index]
                  prepareRow(row)
                  return (
                    <div
                      className="flex h-[35px] border-b border-black last:border-b-0"
                      key={virtualRow.index}
                      ref={virtualRow.measureRef}
                      {...row.getRowProps({
                        style: {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        },
                      })}
                    >
                      {row.cells.map((cell, i) => {
                        return (
                          <div
                            className="Cell p-3"
                            key={i}
                            {...cell.getCellProps([
                              {
                                style: cell.column.style,
                              },
                            ])}
                          >
                            {cell.render('Cell')}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DetailsBox>
  )
}

export default Filters
