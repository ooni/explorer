import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import SpinLoader from 'components/vendor/SpinLoader'
import useUser from 'hooks/useUser'
import {
  apiEndpoints,
  fetcher,
  publishIncidentReport,
  unpublishIncidentReport,
} from 'lib/api'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { formatMediumDateUTC } from 'utils'

const Dashboard = () => {
  const intl = useIntl()
  const { user, loading } = useUser()
  const router = useRouter()

  const { data, error, mutate } = useSWR(apiEndpoints.SEARCH_INCIDENTS, fetcher)

  const tableData = useMemo(
    () => (data?.incidents ? data.incidents : []),
    [data],
  )

  const [sorting, setSorting] = useState([])

  const onError = (error) => {
    toast.error(`Error: ${error?.message}`, {
      position: toast.POSITION.BOTTOM_RIGHT,
      toastId: 'error',
    })
  }

  const { trigger: publish, isMutating: isPublishMutating } = useSWRMutation(
    'publish',
    (_, { arg }) => publishIncidentReport(arg),
    {
      onSuccess: () => {
        mutate()
      },
      throwOnError: false,
      onError,
    },
  )

  const { trigger: unpublish, isMutating: isUnpublishMutating } =
    useSWRMutation('unpublish', (_, { arg }) => unpublishIncidentReport(arg), {
      onSuccess: () => {
        mutate()
      },
      throwOnError: false,
      onError,
    })

  // redirect non-admin users
  useEffect(() => {
    if (!loading && user?.role !== 'admin') router.replace('/findings')
  }, [user, loading, router])

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title',
        cell: (info) => (
          <Link href={`/findings/${info.row.original.id}`}>
            {info.getValue()}
          </Link>
        ),
      },
      {
        header: 'Last Update',
        accessorKey: 'update_time',
        cell: (info) => formatMediumDateUTC(info.getValue()),
      },
      {
        header: 'Reported by',
        accessorKey: 'reported_by',
      },
      {
        header: 'Start Date',
        accessorKey: 'start_time',
        cell: (info) => formatMediumDateUTC(info.getValue()),
      },
      {
        header: 'End Date',
        accessorKey: 'end_time',
        cell: (info) => info.getValue() && formatMediumDateUTC(info.getValue()),
      },
      {
        header: 'Published',
        accessorKey: 'published',
        cell: (info) => (info.getValue() ? '✅' : '❌'),
      },
      {
        header: '',
        accessorKey: 'id',
        cell: (info) => (
          <>
            <Link href={`/findings/edit/${info.getValue()}`}>
              <button className="btn btn-primary-hollow btn-sm" type="button">
                Edit
              </button>
            </Link>
            {info.row.original.published ? (
              <button
                className="btn btn-primary-hollow btn-sm"
                onClick={() => unpublish({ id: info.getValue() })}
                disabled={isPublishMutating}
                type="button"
              >
                Unpublish
              </button>
            ) : (
              <button
                className="btn btn-primary-hollow btn-sm"
                onClick={() => publish({ id: info.getValue() })}
                disabled={isUnpublishMutating}
                type="button"
              >
                Publish
              </button>
            )}
          </>
        ),
      },
    ],
    [],
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
      {user?.role === 'admin' ? (
        <div className="container">
          <ToastContainer />
          <h1 className="mt-8">Censorship Findings Dashboard</h1>
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, i) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={i === 0 ? { width: '328px' } : {}}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                            style={{ display: 'ruby', cursor: 'pointer' }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: (
                                <>
                                  {' '}
                                  <FaSortUp />
                                </>
                              ),
                              desc: (
                                <>
                                  {' '}
                                  <FaSortDown />
                                </>
                              ),
                            }[header.column.getIsSorted()] ?? (
                              <>
                                {' '}
                                <FaSort />
                              </>
                            )}
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => {
                return (
                  <tr key={row.id} className={i % 2 && 'bg-gray-100'}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
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
          <div className="flex mt-8">
            <Link href="/findings/create">
              <button className="btn btn-primary mr-4" type="button">
                Create Finding
              </button>
            </Link>
            <Link href="/findings">
              <button className="btn btn-primary-hollow" type="button">
                View Published Findings
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="container pt-32">
          <SpinLoader />
        </div>
      )}
    </>
  )
}

export default Dashboard
