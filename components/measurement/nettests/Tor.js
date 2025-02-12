import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { colors } from 'ooni-components'
import { Cross, Tick } from 'ooni-components/icons'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { FaClipboard } from 'react-icons/fa'
import { FormattedMessage, defineMessages } from 'react-intl'
import { useClipboard } from 'use-clipboard-copy'

import { twMerge } from 'tailwind-merge'
import AccessPointStatus from '../AccessPointStatus'

const NameCell = ({ children }) => {
  const clipboard = useClipboard({ copiedTimeout: 1500 })

  return (
    <>
      <div
        className="overflow-hidden text-ellipsis relative"
        title={`${children} (Click to copy)`}
        onClick={() => clipboard.copy(children)}
      >
        {children}
        <div className="absolute right-[-3px] top-[-5px]">
          {clipboard.copied && (
            <FaClipboard size={10} color={colors.green['700']} />
          )}
        </div>
      </div>
    </>
  )
}

NameCell.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
}

const Table = ({ columns, data }) => {
  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  const cellClassNames = 'm-0 p-2 border-b border-black text-center'
  return (
    <table className="border border-black border-spacing-0 table-fixed break-all w-full">
      <thead>
        {getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className={twMerge('border-r', cellClassNames)}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                {/* Sort order indicator */}
                {/* <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span> */}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id} className={cellClassNames}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const ConnectionStatusCell = ({ getValue }) => {
  const value = getValue()

  let statusIcon = null
  if (value === false) {
    statusIcon = <div className="font-bold text-base text-gray-700">N/A</div>
  } else {
    statusIcon =
      value === null ? (
        <Tick color={colors.green['700']} />
      ) : (
        <Cross color={colors.red['700']} />
      )
  }
  return (
    <>
      <span className="inline-block">{statusIcon}</span> {value}
    </>
  )
}

const TorDetails = ({ isAnomaly, isFailure, measurement, render }) => {
  // https://github.com/ooni/spec/blob/master/nettests/ts-023-tor.md#possible-conclusions
  let status
  let hint
  let summaryText

  if (isFailure) {
    status = 'error'
    hint = <FormattedMessage id="Measurement.Status.Hint.Tor.Error" />
    summaryText = 'Measurement.Details.SummaryText.Tor.Error'
  } else if (isAnomaly) {
    status = 'anomaly'
    hint = <FormattedMessage id="Measurement.Status.Hint.Tor.Blocked" />
    summaryText = 'Measurement.Details.SummaryText.Tor.Blocked'
  } else {
    status = 'reachable'
    hint = <FormattedMessage id="Measurement.Status.Hint.Tor.Reachable" />
    summaryText = 'Measurement.Details.SummaryText.Tor.OK'
  }

  const testKeys = measurement?.test_keys || {}
  const {
    or_port_dirauth_accessible,
    or_port_dirauth_total,
    obfs4_accessible,
    obfs4_total,
    targets = {},
  } = testKeys

  const columns = useMemo(
    () => [
      {
        header: (
          <FormattedMessage id="Measurement.Details.Tor.Table.Header.Name" />
        ),
        accessorKey: 'name',
      },
      {
        header: (
          <FormattedMessage id="Measurement.Details.Tor.Table.Header.Address" />
        ),
        accessorKey: 'address',
      },
      {
        header: (
          <FormattedMessage id="Measurement.Details.Tor.Table.Header.Type" />
        ),
        accessorKey: 'type',
      },
      {
        header: <FormattedMessage id="General.Accessible" />,
        accessorKey: 'failure',
        // collapse: true,
        cell: ConnectionStatusCell,
      },
    ],
    [],
  )

  const data = useMemo(
    () =>
      Object.keys(targets).map((target) => {
        return {
          name: targets[target].target_name || target,
          address: targets[target].target_address,
          type: targets[target].target_protocol,
          failure: targets[target].failure,
        }
      }),
    [targets],
  )

  const messages = defineMessages({
    tor: {
      id: 'Measurement.Metadata.Tor',
      defaultMessage: 'Tor censorship test result in {country}',
    },
  })

  return (
    <>
      {render({
        status: status,
        statusInfo: hint,
        summaryText: summaryText,
        headMetadata: {
          message: messages.tor,
          formatted: false,
        },
        details: (
          <>
            {!!Object.keys(testKeys).length && (
              <>
                <div className="flex gap-8 my-8">
                  <AccessPointStatus
                    width={1 / 2}
                    label={
                      <FormattedMessage id="Measurement.Details.Tor.Bridges.Label.Title" />
                    }
                    content={
                      <FormattedMessage
                        id="Measurement.Details.Tor.Bridges.Label.OK"
                        defaultMessage="{bridgesAccessible}/{bridgesTotal} OK"
                        values={{
                          bridgesAccessible: obfs4_accessible,
                          bridgesTotal: obfs4_total,
                        }}
                      />
                    }
                    ok={true}
                    color="blue5"
                  />
                  <AccessPointStatus
                    width={1 / 2}
                    label={
                      <FormattedMessage id="Measurement.Details.Tor.DirAuth.Label.Title" />
                    }
                    content={
                      <FormattedMessage
                        id="Measurement.Details.Tor.DirAuth.Label.OK"
                        defaultMessage="{dirAuthAccessible}/{dirAuthTotal} OK"
                        values={{
                          dirAuthAccessible: or_port_dirauth_accessible,
                          dirAuthTotal: or_port_dirauth_total,
                        }}
                      />
                    }
                    ok={true}
                    color="blue5"
                  />
                </div>

                <Table columns={columns} data={data} />
              </>
            )}
          </>
        ),
      })}
    </>
  )
}

TorDetails.propTypes = {
  render: PropTypes.func,
  measurement: PropTypes.object.isRequired,
  country: PropTypes.string.isRequired,
}

export default TorDetails
