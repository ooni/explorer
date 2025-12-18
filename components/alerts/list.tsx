import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { addWeeks, format, parseISO, subWeeks } from 'date-fns'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaSort,
  FaSortDown,
  FaSortUp,
} from 'react-icons/fa'

export interface Changepoint {
  id: string
  name: string
  description: string
  probe_cc: string
  probe_asn: string
  start_time: string
  end_time: string
  domain: string
  change_dir: 'up' | 'down'
}

const AlertList: React.FC<{ changepoints: Changepoint[] }> = ({
  changepoints,
}) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => [
      {
        header: 'Direction',
        accessorKey: 'change_dir',
        enableSorting: true,
        cell: ({ getValue }: { getValue: () => 'up' | 'down' }) => {
          const direction = getValue()
          return (
            <span className="inline-block align-middle">
              {direction === 'up' ? (
                <FaArrowAltCircleUp className="text-red-700" />
              ) : (
                <FaArrowAltCircleDown className="text-green-700" />
              )}
            </span>
          )
        },
      },
      {
        header: 'Time',
        accessorKey: 'start_time',
        enableSorting: true,
        cell: ({ getValue }: { getValue: () => string }) => {
          const time = getValue()
          return time
        },
      },
      {
        header: 'Country',
        accessorKey: 'probe_cc',
        enableSorting: true,
      },
      {
        header: 'Network',
        accessorKey: 'probe_asn',
        enableSorting: true,
        cell: ({ getValue }: { getValue: () => string }) => {
          const asn = getValue()
          return `AS${asn}`
        },
      },
      {
        header: 'Domain',
        accessorKey: 'domain',
        enableSorting: true,
      },
      {
        header: 'Failure type',
        accessorKey: 'block_type',
        enableSorting: true,
      },
      {
        header: 'See more',
        id: 'see_more',
        enableSorting: false,
        cell: ({ row }: { row: { original: Changepoint } }) => {
          const { probe_asn, probe_cc, domain, start_time } = row.original
          const startDate = parseISO(start_time)
          const since = format(subWeeks(startDate, 2), 'yyyy-MM-dd')
          const until = format(addWeeks(startDate, 2), 'yyyy-MM-dd')

          const params = new URLSearchParams({
            probe_asn,
            probe_cc,
            domain,
            since,
            until,
          })

          return (
            <Link
              href={`/chart/alerts?${params.toString()}`}
              className="text-blue-600 hover:text-blue-800 underline"
              prefetch={false}
            >
              See more
            </Link>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable({
    columns,
    data: changepoints,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flow-root overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-400">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-3 py-3.5 text-sm text-start font-semibold text-gray-900"
                  scope="col"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      {...(header.column.getCanSort()
                        ? {
                            className:
                              'flex items-center gap-2 cursor-pointer select-none hover:text-gray-700',
                            onClick: header.column.getToggleSortingHandler(),
                          }
                        : { className: 'flex items-center' })}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getCanSort() && (
                        <span className="text-gray-400">
                          {{
                            asc: <FaSortUp />,
                            desc: <FaSortDown />,
                          }[header.column.getIsSorted() as string] ?? (
                            <FaSort />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="even:bg-gray-50">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap px-3 py-4 text-sm"
                    >
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
    </div>
  )
}

export default AlertList
