import Head from 'next/head'
import NLink from 'next/link'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import useSWRMutation from 'swr/mutation'
import { Button, Container, Flex, Heading } from 'ooni-components'
import useSWR from 'swr'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { apiEndpoints, fetcher } from 'lib/api'
import useUser from 'hooks/useUser'
import NavBar from 'components/NavBar'
import SpinLoader from 'components/vendor/SpinLoader'
import { useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { formatMediumDate } from 'utils'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { publishIncidentReport, unpublishIncidentReport } from 'lib/api'

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

const Dashboard = () => {
  const intl = useIntl()
  const { user, loading } = useUser()
  const router = useRouter()

  const { data, error, mutate } = useSWR(apiEndpoints.SEARCH_INCIDENTS, fetcher)

  const tableData = useMemo(() => (data?.incidents ? data.incidents : []), [data])

  const [sorting, setSorting] = useState([])

  const onError = (error) => {
    toast.error(`Error: ${error?.message}`, {
      position: toast.POSITION.BOTTOM_RIGHT,
      toastId: 'error'
    })
  }

  const { trigger: publish, isMutating: isPublishMutating } = useSWRMutation(
    'publish',
    (_, { arg }) => publishIncidentReport(arg),
    { onSuccess: () => { mutate() },
      throwOnError: false,
      onError
    }
  )

  const { trigger: unpublish, isMutating: isUnpublishMutating } = useSWRMutation(
    'unpublish',
    (_, { arg }) => unpublishIncidentReport(arg),
    { onSuccess: () => { mutate() },
      throwOnError: false,
      onError
    }
  )

  // redirect non-admin users
  useEffect(() => {
    if (!loading && user?.role !== 'admin') router.replace('/findings')
  }, [user, loading, router])

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title',
        cell: info => (
          <NLink href={`/findings/${info.row.original.id}`}>
            <Button variant='link'>{info.getValue()}</Button>
          </NLink>
        )
      },
      {
        header: 'Last Update',
        accessorKey: 'update_time',
        cell: (info) => (formatMediumDate(info.getValue()))
      },
      {
        header: 'Reported by',
        accessorKey: 'reported_by',
      },
      {
        header: 'Email Address',
        accessorKey: 'email_address',
      },
      {
        header: 'Start Date',
        accessorKey: 'start_time',
        cell: (info) => (formatMediumDate(info.getValue()))
      },
      {
        header: 'End Date',
        accessorKey: 'end_time',
        cell: (info) => (info.getValue() && formatMediumDate(info.getValue()))
      },
      {
        header: 'Published',
        accessorKey: 'published',
        cell: (info) => (info.getValue() ? '✅' : '❌')
      },
      {
        header: '',
        accessorKey: 'id',
        cell: info => (
          <>
            <NLink href={`/findings/edit/${info.getValue()}`}>
              <Button mr={1} type="button" size="small" hollow>
                {intl.formatMessage({id: 'Findings.Dashboard.Edit'})}
              </Button>
            </NLink>
            {info.row.original.published ? 
              <Button onClick={() => unpublish({id: info.getValue()})} disabled={isPublishMutating} p={1} type="button" size="small" hollow>
                {intl.formatMessage({id: 'Findings.Dashboard.Unpublish'})}
              </Button> :
              <Button onClick={() => publish({id: info.getValue()})} disabled={isUnpublishMutating} mr={1} type="button" size="small" hollow>
                {intl.formatMessage({id: 'Findings.Dashboard.Publish'})}
              </Button>
            }
          </>
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
  })

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      {user?.role === 'admin' ? (
        <Container>
          <ToastContainer />
          <Heading h={1} mt={4}>{intl.formatMessage({id: 'Findings.Dashboard.Title'})}</Heading>
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
          <Flex mt={4}>
            <NLink href="/findings/create">
              <Button type="button" mr={3}>{intl.formatMessage({id: 'Findings.Create.Title'})}</Button>
            </NLink>
            <NLink href="/findings">
              <Button type="button" hollow>{intl.formatMessage({id: 'Findings.Dashboard.ViewPublished'})}</Button>
            </NLink>
          </Flex>
        </Container>
      ) : (
        <Container pt={6}><SpinLoader /></Container>
      )}
    </>
  )
}

export default Dashboard
