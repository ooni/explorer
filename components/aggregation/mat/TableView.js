import React, { useCallback, useMemo } from 'react'
import { useTable, useFlexLayout } from 'react-table'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'
import { FixedSizeList } from 'react-window'

const TableContainer = styled.div`
  padding: 1rem;
  ${'' /* These styles are suggested for the table fill all available space in its containing element */}
  display: block;
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

const TableRow = styled.div`
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
    border-bottom: 2px double black;
  }
`

const TableBody = styled.div`
  ${'' /* These styles are required for a scrollable table body */}
  overflow-y: scroll;
  overflow-x: hidden;
  height: 400px;
`

const TableView = ({ data, yAxis }) => {
  const intl = useIntl()
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      width: 250, // width is used for both the flex-basis and flex-grow
    }),
    []
  )
  const columns = useMemo(() => [
    {
      Header: intl.formatMessage({ id: `MAT.Table.Header.${yAxis}`}),
      accessor: yAxis
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.anomaly_count' />,
      accessor: 'anomaly_count'
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.confirmed_count' />,
      accessor: 'confirmed_count'
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.failure_count' />,
      accessor: 'failure_count',
    },
    {
      Header: <FormattedMessage id='MAT.Table.Header.measurement_count' />,
      accessor: 'measurement_count',
    }
  ], [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useFlexLayout,
    // useRowSelect
  )

  const RenderRow = useCallback(
    // eslint-disable-next-line react/display-name
    (rows) => ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)
      index === 0 && console.log(row.getRowProps)
      return (
        <TableRow
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
    [prepareRow, rows]
  )


  return (
    <TableContainer>
      {/* eslint-disable react/jsx-key */}
      <Table {...getTableProps()}>
        <TableHeader>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Cell
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </Cell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody {...getTableBodyProps()}>
          {/*rows.map(row => {
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
          })*/}
          <FixedSizeList
            height={400}
            itemCount={data.length}
            itemSize={40}
            width='100%'
          >
            {RenderRow(rows)}
          </FixedSizeList>
        </TableBody>
      </Table>
      {/* eslint-enable react/jsx-key */}
    </TableContainer>
  )
}

export default TableView