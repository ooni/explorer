import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTable, useFlexLayout, useRowSelect, useSortBy, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { FormattedMessage, useIntl } from 'react-intl'
import { defaultRangeExtractor, useVirtual } from 'react-virtual'
import styled from 'styled-components'
import { Flex, Box, Button, Text } from 'ooni-components'

import GridChart, { prepareDataForGridChart } from './GridChart'
import { ResizableBox } from './Resizable'
import { DetailsBox } from '../../measurement/DetailsBox'
import { sortRows } from './computations'

const TableContainer = styled.div`
  ${'' /* These styles are suggested for the table fill all available space in its containing element */}
  flex: 1;
`

const Table = styled.div`
  border-spacing: 0;
  border: 1px solid black;
`

const Cell = styled.div`
  padding: 8px;
`

const TableRow = styled(Flex)`
  height: 35px;
  border-bottom: 1px solid black;
  &:last-child {
    border-bottom: 0;
  }
`

const TableHeader = styled.div`
  ${TableRow} {
    height: auto;
    margin-bottom: 8px;
    border-bottom: 1px solid black;
  }
  &:last-child {
    border-bottom: 2px solid black;
  }
  & ${Cell} {
    border-right: 1px solid black;
    font-weight: bold;
    &:last-child {
      border-right: 0;
    }
  }
`

const TableBody = styled.div`
  height: 250px;
  overflow: auto;
`

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

const SearchFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
  groupedRows,
}) => {
  const count = groupedRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

const StyledGlobalFilter = styled(Box)`
  margin: 16px;
  margin-top: 10px;
  input {
    border: 0;
    outline: 0;
  }
`

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || '')
  }, 200)

  useEffect(() => {
    if (!globalFilter || globalFilter === '') {
      setValue('')
    }
  }, [globalFilter])

  return (
    <StyledGlobalFilter>
      Search:{' '}
      <input
        value={value || ''}
        onChange={e => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={`Search ${count} records...`}
      />
    </StyledGlobalFilter>
  )
}

const SortHandle = ({ isSorted, isSortedDesc }) => {
  return (
    <Box as='code' ml={1}>
      {isSorted ? (
        isSortedDesc ? '▼' : '▲'
      ) : (
        <Box as='code'>&nbsp;</Box>
    )}</Box>
  )
}

// This same reference is passed to GridChart when there are no rows to filter out
// Maybe this can also be `[]`
const noRowsSelected = null

const Filters = ({ data = [], tableData, setDataForCharts, query }) => {
  const intl = useIntl()
  const resetTableRef = useRef(false)
  const yAxis = query.axis_y

  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      width: 70, // width is used for both the flex-basis and flex-grow
      Filter: SearchFilter,
      Cell: ({ value }) => {
        const intl = useIntl()
        return typeof value === 'number' ? intl.formatNumber(value, {}) : String(value)
      }
    }),
    []
  )

  // Aggregate by the first column
  const initialState = React.useMemo(() => ({
    hiddenColumns: ['yAxisCode'],
    sortBy: [{ id: 'yAxisLabel', desc: false }]
  }),[])

  const getRowId = React.useCallback(row => row[query.axis_y], [])

  const columns = useMemo(() => [
    {
      Header: intl.formatMessage({ id: `MAT.Table.Header.${yAxis}`}),
      Cell: ({ value, row }) => (
        <Text fontWeight={row.isSelected ? 'bold' : 'initial'}>
          {value}
        </Text>
      ),
      id: 'yAxisLabel',
      accessor: 'rowLabel',
      filter: 'text',
      style: {
        width: '35%'
      }
    },
    {
      id: 'yAxisCode',
      accessor: yAxis,
      disableFilters: true,
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.anomaly_count' />,
      accessor: 'anomaly_count',
      width: 150,
      sortDescFirst: true,
      disableFilters: true,
      style: {
        textAlign: 'end'
      }
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.confirmed_count' />,
      accessor: 'confirmed_count',
      width: 150,
      sortDescFirst: true,
      disableFilters: true,
      style: {
        textAlign: 'end'
      }
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.failure_count' />,
      accessor: 'failure_count',
      width: 150,
      sortDescFirst: true,
      disableFilters: true,
      style: {
        textAlign: 'end'
      }
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.measurement_count' />,
      accessor: 'measurement_count',
      width: 150,
      sortDescFirst: true,
      disableFilters: true,
      style: {
        textAlign: 'end'
      }
    }
  ], [intl, yAxis])

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
          )
        },
        ...columns
      ])
    }
  )
  
  const updateCharts = useCallback(() => {
    const selectedRows = Object.keys(state.selectedRowIds).sort((a,b) => sortRows(a, b, query.axis_y))

    if (selectedRows.length > 0 && selectedRows.length !== preGlobalFilteredRows.length) {
      setDataForCharts(selectedRows)
    } else {
      setDataForCharts(noRowsSelected)
    }
  }, [preGlobalFilteredRows.length, query.axis_y, state.selectedRowIds, setDataForCharts])

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
  }, [setGlobalFilter, state.globalFilter, toggleAllRowsSelected, setDataForCharts])

  useEffect(() => {
    if (state.globalFilter == undefined && resetTableRef.current === true) {
      resetTableRef.current = false
      toggleAllRowsSelected(false)
    }
  }, [state.globalFilter, toggleAllRowsSelected])

  const parentRef = React.useRef()

  const { virtualItems: virtualRows, totalSize } = useVirtual({
    size: rows.length,
    parentRef,
    overscan: 10,
    estimateSize: React.useCallback(() => 35, []),
  })

  return (
    <DetailsBox title={'Filters'} collapsed={false}>
      <Flex flexDirection='column'>
        <Flex mb={3} alignItems='center'>
          <Button hollow onClick={updateCharts}>Apply</Button>
          <Button inverted onClick={resetFilter} mx={3}>Reset</Button>
        </Flex>
        <TableContainer>
          <Table {...getTableProps()}>
            <TableHeader>
              {headerGroups.map((headerGroup, i) => (
                <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, i) => {
                    return (
                      <Cell key={i} {...column.getHeaderProps([
                        {
                          style: column.style
                        }
                      ])}>
                        <span {...column.getSortByToggleProps()}>
                          {column.render('Header')}
                          {column.canSort &&
                            <SortHandle isSorted={column.isSorted} isSortedDesc={column.isSortedDesc} />
                          }
                        </span>
                      </Cell>
                    )}
                  )}
                </TableRow>
              ))}
              <TableRow>
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </TableRow>
            </TableHeader>
            <div
              ref={parentRef}
              style={{
                display: 'block',
                height: '200px',
                overflow: 'auto',
                width: '100%'
              }}
            >
              <TableBody
                style={{
                  display: 'block',
                  height: `${totalSize}px`,
                  position: 'relative'
                }}
              >
                {virtualRows.map(virtualRow => {
                  const row = rows[virtualRow.index]
                  prepareRow(row)
                  return (
                    <TableRow
                      key={virtualRow.index}
                      ref={virtualRow.measureRef}
                      {...row.getRowProps({
                        style: {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`
                        }
                      })}>
                      {row.cells.map((cell, i) => {
                        return (
                          <Cell
                            key={i}
                            {...cell.getCellProps([
                              {
                                style: cell.column.style
                              }
                            ])}>
                            {cell.render('Cell')}
                          </Cell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </div>
          </Table>
        </TableContainer>
      </Flex>
    </DetailsBox>
  )
}

export default Filters