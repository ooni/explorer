import React, { useCallback, useMemo, useState } from 'react'
import { useTable, useFlexLayout, useRowSelect, useFilters, useGroupBy, useSortBy } from 'react-table'
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
  &:hover {
    background: ${props => props.theme.colors.gray1};
  }
`

const TableHeader = styled.div`
  ${TableRow} {
    margin-bottom: 8px;
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
        width: '45%'
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
      disableFilters: true,
      style: {
        textAlign: 'end'
      }
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.confirmed_count' />,
      accessor: 'confirmed_count',
      aggregate: 'sum',
      disableFilters: true,
      style: {
        textAlign: 'end'
      }
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.failure_count' />,
      accessor: 'failure_count',
      aggregate: 'sum',
      disableFilters: true,
      style: {
        textAlign: 'end'
      }
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.measurement_count' />,
      accessor: 'measurement_count',
      aggregate: 'sum',
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

  const [chartPanelHeight, setChartPanelHeight] = useState(800)

  const onPanelResize = useCallback((width, height) => {
    // Panel height - (height of ChartHeader + XAxis) = Height of RowCharts
    setChartPanelHeight(height - (90 + 62))
  }, [])

  const [dataForCharts, setDataForCharts] = useState(rows)
  
  const updateCharts = useCallback(() => {
    if (selectedFlatRows.length > 0 && selectedFlatRows.length < rows.length) {
      setDataForCharts(selectedFlatRows)
      setChartPanelHeight(selectedFlatRows.length * 70)
    } else {
      setDataForCharts(rows)
      setChartPanelHeight('auto')
    }
  }, [rows, selectedFlatRows])

  const showChartsButton = selectedFlatRows.length > 0 && selectedFlatRows.length < rows.length ? (
    <Button hollow onClick={updateCharts}>Show {selectedFlatRows.length} Charts</Button>
  ) : (
    <Text>Select rows to show</Text>      
  )

  const resetFilter = () => {
    toggleAllRowsSelected(false)
    setDataForCharts(rows)
    setChartPanelHeight('auto')
  }

  return (
    <Flex flexDirection='column'>
      <DetailsBox title={'Filters'} collapsed={false}>
        <Flex flexDirection='column'>
          <Flex my={2} alignItems='center'>
            {showChartsButton}
            <Button inverted onClick={resetFilter} mx={3} disabled={selectedFlatRows.length === 0}>Reset</Button>
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
                          {column.render('Header')}
                          {/* Column Filter */}
                          <div>{column.canFilter ? column.render('Filter') : null}</div>
                        </Cell>
                      )}
                    )}
                  </TableRow>
                ))}
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