import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { addWeeks, format, parseISO, subWeeks } from 'date-fns'
import Link from 'next/link'
import { useMemo } from 'react'
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa'

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
  const columns = useMemo(
    () => [
      {
        header: 'Direction',
        accessorKey: 'change_dir',
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
        cell: ({ getValue }: { getValue: () => string }) => {
          const time = getValue()
          return time
        },
      },
      {
        header: 'Country',
        accessorKey: 'probe_cc',
      },
      {
        header: 'Network',
        accessorKey: 'probe_asn',
        cell: ({ getValue }: { getValue: () => string }) => {
          const asn = getValue()
          return `AS${asn}`
        },
      },
      {
        header: 'Domain',
        accessorKey: 'domain',
      },
      {
        header: 'See more',
        id: 'see_more',
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
              href={`/chart/alert?${params.toString()}`}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              See more
            </Link>
          )
        },
      },
    ],
    [],
  )

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data: changepoints,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flow-root overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-400">
        <thead>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-3 py-3.5 text-sm text-start font-semibold text-gray-900"
                  scope="col"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row) => {
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
