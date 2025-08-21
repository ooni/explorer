import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import 'regenerator-runtime'

import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { DetailsBox } from '../../measurement/DetailsBox'
import { sortRows } from './computations'
import { useBlockingTypes } from './BlockingTypesContext'

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

// This same reference is passed to GridChart when there are no rows to filter out
// Maybe this can also be `[]`
const noRowsSelected = null

const rowConfig = (selectedItems) => {
  const keys = selectedItems?.length
    ? selectedItems
    : [
        'anomaly_count',
        'confirmed_count',
        'failure_count',
        'measurement_count',
        'tcp_generic_timeout_error',
      ]
  return keys.map((key) => ({
    header: selectedItems?.length ? (
      key
    ) : (
      <FormattedMessage id={`MAT.Table.Header.${key}`} />
    ),
    id: key,
    accessorKey: key,
    enableColumnFilter: false,
    minSize: 220,
  }))
}

const Filters = ({ data, setDataForCharts, query }) => {
  const intl = useIntl()
  const resetTableRef = useRef(false)
  const yAxis = query.axis_y
  const getRowId = useCallback((row) => row[query.axis_y], [query.axis_y])
  const { state } = useBlockingTypes()

  const config = useMemo(() => rowConfig(state.selected), [state.selected])
  const columns = useMemo(
    () => [
      {
        id: 'select',
        enableSorting: false,
        size: 30,
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      },
      {
        header: intl.formatMessage({ id: `MAT.Table.Header.${yAxis}` }),
        cell: ({ row, cell }) => (
          <div className={row.getIsSelected() && 'font-bold'}>
            {cell.getValue()}
          </div>
        ),
        id: 'yAxisLabel',
        accessorKey: 'rowLabel',
        minSize: 220,
      },
      ...config,
    ],
    [intl, yAxis, config],
  )

  const {
    getHeaderGroups,
    getRowModel,
    toggleAllRowsSelected,
    getState,
    getPreFilteredRowModel,
    setGlobalFilter,
  } = useReactTable({
    columns,
    data,
    initialState: {
      sorting: [
        {
          id: 'yAxisLabel',
          desc: yAxis === 'domain',
        },
      ],
    },
    globalFilterFn: (row, _, filterValue) => {
      const value = row.getValue('yAxisLabel')
      return typeof value === 'string'
        ? value.toLowerCase().includes(filterValue.toLowerCase())
        : row.id.toLowerCase().includes(filterValue.toLowerCase())
    },
    getRowId,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const updateCharts = useCallback(() => {
    const selectedRows = Object.keys(getState().rowSelection).sort((a, b) =>
      sortRows(a, b, query.axis_y, intl.locale),
    )

    if (selectedRows.length > 0 && selectedRows.length !== rows?.length) {
      setDataForCharts(selectedRows)
    } else {
      setDataForCharts(noRowsSelected)
    }
  }, [
    getPreFilteredRowModel,
    query.axis_y,
    getState,
    setDataForCharts,
    intl.locale,
  ])

  /**
   * Reset the table filter
   * Note: doesn't reset the sort state
   */

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const resetFilter = useCallback(() => {
    // toggleAllRowsSelected() doesn't work after calling setGlobalFilter('')
    // so if globalFilter is set, then use resetTableRef to make it a two-step
    // reset (step 2 in the below useEffect)
    // otherwise, just toggle the selected rows and the reset is done
    if (!getState().globalFilter) {
      toggleAllRowsSelected(false)
    } else {
      resetTableRef.current = true
      setGlobalFilter('')
    }
    setDataForCharts(noRowsSelected)
  }, [setGlobalFilter, toggleAllRowsSelected, setDataForCharts])

  useEffect(() => {
    if (
      getState().globalFilter === undefined &&
      resetTableRef.current === true
    ) {
      resetTableRef.current = false
      toggleAllRowsSelected(false)
    }
  }, [getState, toggleAllRowsSelected])

  const parentRef = useRef(null)

  const { rows } = getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    overscan: 10,
    estimateSize: useCallback(() => 28, []),
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

        <div
          ref={parentRef}
          className=" border border-black border-spacing-0"
          style={{
            overflow: 'auto', //our scrollable table container
            position: 'relative', //needed for sticky header
            height: '300px', //should be a fixed height
          }}
        >
          <table style={{ display: 'grid' }}>
            <thead className="grid sticky top-0 z-10 bg-white">
              {getHeaderGroups().map((headerGroup) => (
                <tr
                  className="h-auto border-b border-black "
                  style={{ display: 'flex', width: '100%' }}
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                      <th
                        className={`p-2 border-r border-black font-bold last:border-r-0 ${
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : ''
                        }`}
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        // style={{
                        //   width:
                        //     header.column.id === 'yAxisLabel'
                        //       ? '200px'
                        //       : header.getSize(),
                        //   minWidth: '200px',
                        // }}
                        style={{
                          display: 'flex',
                          width: header.getSize(),
                        }}
                      >
                        <span
                          className="flex items-center"
                          style={{ wordWrap: 'anywhere' }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort()
                            ? {
                                asc: <FaSortDown />,
                                desc: <FaSortUp />,
                                false: <FaSort />,
                              }[header.column.getIsSorted()]
                            : null}
                        </span>
                      </th>
                    )
                  })}
                </tr>
              ))}
              <tr className="h-auto border-b border-black px-3">
                <th colSpan={columns.length} className="flex gap-1 p-2">
                  {intl.formatMessage({ id: 'MAT.Table.Search' })}{' '}
                  <input
                    className="border-0 outline-0 font-normal"
                    value={getState().globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(String(e.target.value))}
                    placeholder={intl.formatMessage(
                      { id: 'MAT.Table.FilterPlaceholder' },
                      { count: rows?.length },
                    )}
                  />
                </th>
              </tr>
            </thead>

            <tbody
              style={{
                display: 'grid',
                height: `${virtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                position: 'relative', //needed for absolute positioning of rows
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = rows[virtualRow.index]
                return (
                  <tr
                    key={row.id}
                    // style={{
                    //   boxShadow: '0 1px black',
                    //   height: `${virtualRow.size}px`,
                    //   transform: `translateY(${
                    //     virtualRow.start - index * virtualRow.size
                    //   }px)`,
                    // }}
                    style={{
                      boxShadow: '0 1px black',
                      display: 'flex',
                      position: 'absolute',
                      transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                      width: '100%',
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="px-2 py-1"
                          // style={{
                          //   width:
                          //     cell.column.id === 'yAxisLabel'
                          //       ? '40%'
                          //       : cell.column.columnDef.size,
                          //   minWidth: '200px',
                          // }}
                          style={{
                            display: 'flex',
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DetailsBox>
  )
}

export default Filters
