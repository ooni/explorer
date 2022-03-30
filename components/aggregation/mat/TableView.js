import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTable, useFlexLayout, useRowSelect, useFilters, useGroupBy, useSortBy, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'
import { Flex, Box, Button, Text } from 'ooni-components'

import GridChart from './GridChart'
import { useDebugContext } from '../DebugContext'
import { getRowLabel } from './labels'
import { ResizableBox } from './Resizable'
import { DetailsBox } from '../../measurement/DetailsBox'

const TableContainer = styled.div`
  ${'' /* These styles are suggested for the table fill all available space in its containing element */}
  flex: 1;
  ${'' /* These styles are required for a horizontaly scrollable table overflow */}
  overflow: auto;
`

const Table = styled.div`
  border-spacing: 0;
  border: 1px solid black;
`

const Cell = styled.div`
  padding: 8px;
`

const TableRow = styled(Flex)`
  border-bottom: 1px solid black;
  &:last-child {
    border-bottom: 0;
  }
`

const TableHeader = styled.div`
  ${TableRow} {
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
  ${'' /* These styles are required for a scrollable table body */}
  overflow-y: scroll;
  overflow-x: hidden;
  height: 250px;
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
    setGlobalFilter(value || undefined)
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

const reshapeTableData = (data, query) => {
  const reshapedData = data.map((item) => {
    const key = item[query.axis_y]
    item['rowLabel'] = getRowLabel(key, query.axis_y)
    return item
  })
  return reshapedData
}
// End From GridChart

const TableView = ({ data, query }) => {
  const intl = useIntl()
  const yAxis = query.axis_y

  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      width: 70, // width is used for both the flex-basis and flex-grow
      Filter: SearchFilter,
    }),
    []
  )

  // Aggregate by the first column
  const initialState = React.useMemo(() => ({
    groupBy: ['yAxisCode'],
    hiddenColumns: ['yAxisCode'],
    sortBy: [{ id: 'yAxisLabel', desc: false }]
  }),[])

  const selectedRowsRef = React.useRef(new Set())

  const columns = useMemo(() => [
    {
      Header: intl.formatMessage({ id: `MAT.Table.Header.${yAxis}`}),
      Cell: ({ value, row, toggleRowSelected }) => (
        <Text fontWeight={row.isSelected ? 'bold' : 'initial'}>
          {value}
        </Text>
      ),
      id: 'yAxisLabel',
      accessor: 'rowLabel',
      aggregate: (values) => values[0],
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
      aggregate: 'sum',
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
      aggregate: 'sum',
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
      aggregate: 'sum',
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
      aggregate: 'sum',
      width: 150,
      sortDescFirst: true,
      disableFilters: true,
      style: {
        textAlign: 'end'
      }
    }
  ], [intl, yAxis])

  const reshapedTableData = useMemo(() => {
    const reshapedData = reshapeTableData(data, query)
    return reshapedData
  }, [query, data])

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
    flatRows,
    preGlobalFilteredRows,
    preGlobalFilteredFlatRows,
    globalFilteredRows,
    preGroupedRows,
    preGroupedFlatRow,
    groupedRows,
    groupedFlatRows,
    preSortedRows,
    sortedRows,
  } = useTable(
    {
      columns,
      data: reshapedTableData,
      initialState,
      defaultColumn,
    },
    useFlexLayout,
    useGlobalFilter,
    useGroupBy,
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

  useEffect(() => {
    // console.log('selectedFlatRows', selectedFlatRows.length)
    selectedFlatRows.forEach(row => {
      console.log(row.groupByVal)
      selectedRowsRef.current.add(row.groupByVal)
    })
  }, [selectedFlatRows])

  const [chartPanelHeight, setChartPanelHeight] = useState(800)

  const onPanelResize = useCallback((width, height) => {
    // Panel height - (height of ChartHeader + XAxis) = Height of RowCharts
    setChartPanelHeight(height - (90 + 62))
  }, [])

  const [dataForCharts, setDataForCharts] = useState(rows)
  
  const updateCharts = useCallback(() => {
    if (selectedRowsRef.current.size > 0) {
      setDataForCharts(rows.filter(row => selectedRowsRef.current.has(row.groupByVal)))
      setChartPanelHeight(selectedRowsRef.current.size * 70)
    } else {
      setDataForCharts(rows)
      setChartPanelHeight('auto')
    }
  }, [rows])

  const chartsButton =  (
    <Button hollow onClick={updateCharts}>Show {selectedFlatRows.length > 0 ? selectedFlatRows.length: 'All'} Charts</Button>
  )

  const resetFilter = () => {
    toggleAllRowsSelected(false)
    setGlobalFilter('')
    setDataForCharts(rows)
    setChartPanelHeight('auto')
    selectedRowsRef.current.clear()
  }

  return (
    <Flex flexDirection='column'>
      <DetailsBox title={'Filters'} collapsed={false}>
        <Flex flexDirection='column'>
          <Flex my={2} alignItems='center'>
            {/* {chartsButton} */}
            <Button hollow onClick={updateCharts}>Apply</Button>
            <Button inverted onClick={resetFilter} mx={3}>Reset</Button>
          </Flex>
          <TableContainer>
            {/* eslint-disable react/jsx-key */}
            <Table {...getTableProps()}>
              <TableHeader>
                {headerGroups.map(headerGroup => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => {
                      return (
                        <Cell {...column.getHeaderProps([
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
                    preGlobalFilteredRows={rows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                  />
                </TableRow>
              </TableHeader>
              <TableBody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row)
                  return (
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        return (
                          <Cell {...cell.getCellProps([
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
            </Table>
            {/* eslint-enable react/jsx-key */}
          </TableContainer>
        </Flex>
      </DetailsBox>
      <ResizableBox onResize={onPanelResize}>
        <GridChart
          data={dataForCharts}
          isGrouped={true}
          query={query}
          height={chartPanelHeight}
        />
      </ResizableBox>
    </Flex>
  )
}

export default TableView