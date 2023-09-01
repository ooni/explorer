import Head from 'next/head'
import NLink from 'next/link'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button, Container, Heading } from 'ooni-components'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from 'lib/api'
import useUser from 'hooks/useUser'
import NavBar from 'components/NavBar'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { formatLongDate } from '../../utils'

const StyledTable = styled.table`
border-collapse: collapse;
width: 100%;
th, td {
  border: 1px solid gray;
}
`

const StyledRow = styled.tr`
// &:nth-child(even) {
//   background-color: gray;
// }
`

const IncidentsDashboard = () => {
  const { user } = useUser()
  const { data, error } = useSWR(apiEndpoints.SEARCH_INCIDENTS, fetcher)

  const tableData = useMemo(() => (data?.incidents ? data.incidents : []), [data])
  
  const [sorting, setSorting] = useState([])

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title',
        footer: props => props.column.id,
        cell: info => (
          <NLink href={`/incidents/${info.row.original.id}`}>
            <Button variant='link'>{info.getValue()}</Button>
          </NLink>
        )
      },
      {
        header: 'Reported by',
        accessorKey: 'reported_by',
        footer: props => props.column.id,
      },
      {
        header: 'Start Time',
        accessorKey: 'start_time',
        footer: props => props.column.id,
        cell: (info) => (formatLongDate(info.getValue()))
      },
      {
        header: 'End Time',
        accessorKey: 'end_time',
        footer: props => props.column.id,
        cell: (info) => (info.getValue() && formatLongDate(info.getValue()))
      },
      {
        header: 'Published',
        accessorKey: 'published',
        footer: props => props.column.id,
        cell: (info) => (info.getValue() ? '✅' : '❌')
      },
      {
        header: '',
        accessorKey: 'id',
        cell: (id) => (
          <NLink href={`/incidents/edit/${id.getValue()}`}>
            <Button type="button" btnSize="small" hollow>
              <>Edit</>
            </Button>
          </NLink>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  })

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1} mt={4}>Incidents Dashboard</Heading>
        <StyledTable>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 10)
              .map(row => {
                return (
                  <StyledRow key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                  </StyledRow>
                )
              })}
          </tbody>
        </StyledTable>
        <NLink href="/incidents/create">
          <Button type="button" hollow mt={4}>
            + Add Incident
          </Button>
        </NLink>
      </Container>
    </>
  )
}

export default IncidentsDashboard
