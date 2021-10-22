import React, { useCallback, useMemo } from 'react'
import { useTable, useFlexLayout, useRowSelect, useFilters, useGroupBy } from 'react-table'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'
import { FixedSizeList } from 'react-window'
import { Flex } from 'ooni-components'
import { groupBy } from 'lodash'
import { Box } from 'rebass'
import { GridChart } from './GridChart'

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
}) => {
  const count = preFilteredRows.length

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

const TableView = ({ data, query }) => {
  const intl = useIntl()
  const yAxis = query.axis_y
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
    hiddenColumns: ['yAxisCode']
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows, // contains filtered rows
    prepareRow
  } = useTable(
    {
      columns,
      data,
      initialState,
      defaultColumn,
      filterTypes,
    },
    useFlexLayout,
    useFilters,
    useGroupBy,
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

  const RenderRow = useCallback(
    // eslint-disable-next-line react/display-name
    (rows) => ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)
      return (
        <TableRow alignItems='center'
          {...row.getRowProps({
            style,
          })}
        >
          {row.cells.map((cell, index) => {
            return (
              <Cell key={index} {...cell.getCellProps()}>
                {cell.render('Cell')}
              </Cell>
            )
          })}
        </TableRow>
      )
    },
    [prepareRow]
  )


  return (
    <Flex flexDirection='column'>
      <Flex>
        <GridChart data={rows} query={query} />
      </Flex>
      <Flex my={4} sx={{ height: '40vh' }}>
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
              {/* <FixedSizeList
                height={400}
                itemCount={data.length}
                itemSize={32}
              >
                {RenderRow(rows)}
              </FixedSizeList> */}
            </div>
          </Table>
          {/* eslint-enable react/jsx-key */}
        </TableContainer>
      </Flex>
    </Flex>
  )
}

export default TableView