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
import SpinLoader from 'components/vendor/SpinLoader'
import { useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { formatMediumDateTime } from '../../utils'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

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
  const intl = useIntl()
  const { user } = useUser()
  const router = useRouter()

  const { data, error } = useSWR(apiEndpoints.SEARCH_INCIDENTS, fetcher)

  const tableData = useMemo(() => (data?.incidents ? data.incidents : []), [data])

  const [sorting, setSorting] = useState([])

  // redirect non-admin users
  useEffect(() => {
    if (user && user?.role !== 'admin') router.replace('/incidents')
  }, [user, router])

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
        header: 'Last Update',
        accessorKey: 'update_time',
        footer: props => props.column.id,
        cell: (info) => (formatMediumDateTime(info.getValue()))
      },
      {
        header: 'Reported by',
        accessorKey: 'reported_by',
        footer: props => props.column.id,
      },
      {
        header: 'Email Address',
        accessorKey: 'email_address',
        footer: props => props.column.id,
      },
      {
        header: 'Start Time',
        accessorKey: 'start_time',
        footer: props => props.column.id,
        cell: (info) => (formatMediumDateTime(info.getValue()))
      },
      {
        header: 'End Time',
        accessorKey: 'end_time',
        footer: props => props.column.id,
        cell: (info) => (info.getValue() && formatMediumDateTime(info.getValue()))
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
            <Button type="button" size="small" hollow>
              <>{intl.formatMessage({id: 'Incidents.Dashboard.Edit'})}</>
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
      {user?.role === 'admin' ? (
        <Container>
          <Heading h={1} mt={4}>{intl.formatMessage({id: 'Incidents.Dashboard.Title'})}</Heading>
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
            <Button type="button" hollow mt={4}>{intl.formatMessage({id: 'Incidents.Dashboard.Add'})}</Button>
          </NLink>
        </Container>
      ) : (
        <Container pt={6}><SpinLoader /></Container>
      )}
    </>
  )
}

export default IncidentsDashboard
