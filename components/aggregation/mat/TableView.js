import React, { useCallback, useMemo, useState } from 'react'
import { useTable, useFlexLayout, useRowSelect, useFilters, useGroupBy, useSortBy } from 'react-table'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'
import { Flex, Box } from 'ooni-components'
import ReactResizeDetector from 'react-resize-detector'

import GridChart from './GridChart'
import { useDebugContext } from '../DebugContext'
import { getRowLabel } from './labels'
import { ResizableBox } from './Resizable'

const TableContainer = styled.div`
  padding: 1rem;
  ${'' /* These styles are suggested for the table fill all available space in its containing element */}
  flex: 1;
  ${'' /* These styles are required for a horizontaly scrollable table overflow */}
  overflow: auto;
`

const Table = styled.div`
  border-spacing: 0;
`

const Cell = styled.div`
  /* margin: 0;
  padding: 1rem; */

  ${'' /* In this example we use an absolutely position resizer,
    so this is required. */}
  /* position: relative; */

  &:last-child {
    border-right: 0;
  }
`

const TableRow = styled(Flex)`
  &:last-child {
    ${Cell} {
      border-bottom: 0;
    }
  }
  border-bottom: 1px solid black;
`

const TableHeader = styled.div`
  ${'' /* These styles are required for a scrollable body to align with the header properly */}
  overflow-y: auto;
  overflow-x: hidden;
  ${TableRow} {
    padding-bottom: 8px;
    border-bottom: 1px solid black;
  }
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


export function getDatesBetween(startDate, endDate) {
  const dateArray = new Set()
  var currentDate = startDate
  while (currentDate <= endDate) {
    dateArray.add(currentDate.toISOString().slice(0, 10))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dateArray
}

const reshapeTableData = (data, query) => {
  const reshapedData = data.map((item) => {
    const key = item[query.axis_y]
    // 1. Attach `ok_count` to all the data items
    item['ok_count'] = item.measurement_count - item.anomaly_count
    item['rowLabel'] = getRowLabel(key, query.axis_y)
    return item
  })
  return reshapedData
}
// End From GridChart

const TableView = ({ data, query }) => {
  const intl = useIntl()
  const yAxis = query.axis_y

  const { doneTableReshaping } = useDebugContext()

  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      width: 200, // width is used for both the flex-basis and flex-grow
      Filter: SearchFilter,
    }),
    []
  )

  const filterTypes = React.useMemo(
    () => ({
      // default text filter to use "startWith"
      text: (rows, id, filterValue) => {
        const regex = new RegExp(filterValue, 'i')
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? regex.test(String(rowValue))
            : true
        })
      },
    }),
    []
  )
  
  // Aggregate by the first column
  const initialState = React.useMemo(() => ({
    groupBy: ['yAxisCode'],
    hiddenColumns: ['yAxisCode'],
    sortBy: [{ id: 'yAxisLabel', desc: false }]
  }),[])

  const columns = useMemo(() => [
    {
      Header: intl.formatMessage({ id: `MAT.Table.Header.${yAxis}`}),
      id: 'yAxisLabel',
      accessor: 'rowLabel',
      aggregate: (values) => values[0],
      filter: 'text',
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
      disableFilters: true,
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.confirmed_count' />,
      accessor: 'confirmed_count',
      aggregate: 'sum',
      disableFilters: true,
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.failure_count' />,
      accessor: 'failure_count',
      aggregate: 'sum',
      disableFilters: true,
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.measurement_count' />,
      accessor: 'measurement_count',
      aggregate: 'sum',
      disableFilters: true,
    }
  ], [intl, yAxis])

  const reshapedTableData = useMemo(() => {
    const t0 = performance.now()
    const reshapedData = reshapeTableData(data, query)
    const t1 = performance.now()
    doneTableReshaping(t0, t1)
    console.debug(`Table reshaping: ${t1} - ${t0} = ${t1-t0}ms`)
    return reshapedData
  }, [doneTableReshaping, query, data])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows, // contains filtered rows
    preFilteredRows,
    selectedFlatRows,
    filteredFlatRows,
    groupedFlatRows,
    onlyGroupedFlatRows,
    nonGroupedFlatRows,
    prepareRow
  } = useTable(
    {
      columns,
      data: reshapedTableData,
      initialState,
      defaultColumn,
      filterTypes,
    },
    useFlexLayout,
    useFilters,
    useGroupBy,
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          width: 50,
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

  const dataForCharts = useMemo(() => {
    if (selectedFlatRows.length > 0) {
      return selectedFlatRows
    }

    return rows
  }, [rows, selectedFlatRows])

  const [chartPanelHeight, setChartPanelHeight] = useState(250)

  const onPanelResize = useCallback((width, height) => {
    console.log(`resized height: ${height}`)
    setChartPanelHeight(height)
  }, [])

  return (
    <Flex flexDirection='column'>
      <ResizableBox onResize={onPanelResize}>
        <GridChart data={dataForCharts} query={query} height={chartPanelHeight} />
      </ResizableBox>
      <Flex my={4} sx={{ height: '50vh' }}>
        <TableContainer>
          {/* eslint-disable react/jsx-key */}
          <Table {...getTableProps()}>
            <TableHeader>
              {headerGroups.map(headerGroup => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => {
                    return (
                      <Cell
                        {...column.getHeaderProps()}
                      >
                        {column.render('Header')}
                        {/* Column Filter */}
                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                      </Cell>
                    )}
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <div {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row)
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <Cell
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </Cell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </div>
          </Table>
          {/* eslint-enable react/jsx-key */}
        </TableContainer>
      </Flex>
    </Flex>
  )
}

export default TableView