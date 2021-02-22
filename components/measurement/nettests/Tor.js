import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Flex, Text, Container, theme } from 'ooni-components'
import styled from 'styled-components'
import { useTable, useSortBy } from 'react-table'
import { Cross, Tick } from 'ooni-components/dist/icons'
import { useClipboard } from 'use-clipboard-copy'
import { FaClipboard } from 'react-icons/lib/fa'

import AccessPointStatus from '../AccessPointStatus'

const TableStyles = styled.div`
  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 100%;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      text-align: center;
      :last-child {
        border-right: 0;
      }
    }
    th {
      border-right: 1px solid black;
    }
  }
`

const StyledNameCell = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
`

const ClipboardIcon = styled.div`
  position: absolute;
  right: -3px;
  top: -5px;
`

const NameCell = ({ children }) => {
  const clipboard = useClipboard({ copiedTimeout: 1500 })

  return (
    <React.Fragment>
      <StyledNameCell
        title={`${children} (Click to copy)`}
        onClick={() => clipboard.copy(children)}
      >
        {children}
        <ClipboardIcon>
          {clipboard.copied && <FaClipboard size={10} color={theme.colors.green7} />}
        </ClipboardIcon>
      </StyledNameCell>

    </React.Fragment>
  )
}

NameCell.propTypes = {
  children: PropTypes.element.isRequired
}

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data
    },
    useSortBy
  )

  return (
    /* eslint-disable react/jsx-key */
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                {/* Sort order indicator */}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )}
        )}
      </tbody>
    </table>
    /* eslint-enable react/js-key */

  )
}

const ConnectionStatusCell = ({ cell: { value} }) => {
  let statusIcon = null
  if (value === false) {
    statusIcon = <Text fontWeight='bold' fontSize={1} color={theme.colors.gray7}>N/A</Text>
  } else {
    statusIcon = value === null ? <Tick color={theme.colors.green7} /> : <Cross color={theme.colors.red7} />
  }
  return (
    <React.Fragment>
      {statusIcon} {value}
    </React.Fragment>
  )
}

const TorDetails = ({
  isAnomaly,
  isFailure,
  measurement,
  render
}) => {
  // https://github.com/ooni/spec/blob/master/nettests/ts-023-tor.md#possible-conclusions
  let status, hint, summaryText

  if (isFailure) {
    status = 'error'
    hint = <FormattedMessage id='Measurement.Status.Hint.Tor.Error' />
    summaryText = 'Measurement.Details.SummaryText.Tor.Error'
  } else if (isAnomaly) {
    status = 'anomaly'
    hint = <FormattedMessage id='Measurement.Status.Hint.Tor.Blocked' />
    summaryText = 'Measurement.Details.SummaryText.Tor.Blocked'
  } else {
    status = 'reachable'
    hint = <FormattedMessage id='Measurement.Status.Hint.Tor.Reachable' />
    summaryText = 'Measurement.Details.SummaryText.Tor.OK'
  }

  const {
    or_port_accessible,
    or_port_total,
    or_port_dirauth_accessible,
    or_port_dirauth_total,
    obfs4_accessible,
    obfs4_total,
    dir_port_accessible,
    dir_port_total,
    targets = {}
  } = measurement.test_keys

  const columns = useMemo(() => [
    {
      Header: <FormattedMessage id='Measurement.Details.Tor.Table.Header.Name' />,
      accessor: 'name',
      Cell: ({ cell: { value } }) => ( // eslint-disable-line react/display-name,react/prop-types
        <NameCell>{value}</NameCell>
      )
    },
    {
      Header: <FormattedMessage id='Measurement.Details.Tor.Table.Header.Address' />,
      accessor: 'address'
    },
    {
      Header: <FormattedMessage id='Measurement.Details.Tor.Table.Header.Type' />,
      accessor: 'type'
    },
    {
      Header: <FormattedMessage id='Measurement.Details.Tor.Table.Header.Connect' />,
      accessor: 'connect',
      collapse: true,
      Cell: ConnectionStatusCell
    },
    {
      Header: <FormattedMessage id='Measurement.Details.Tor.Table.Header.Handshake' />,
      accessor: 'handshake',
      collapse: true,
      Cell: ConnectionStatusCell
    }
  ], [])

  const data = useMemo(() => (
    Object.keys(targets).map(target => {
      // Connection Status values
      // false: Didn't run (N/A)
      // null: No failure a.k.a success
      // string: Failure with error string
      let connectStatus = false, handshakeStatus = false
      if (targets[target].summary.connect) {
        connectStatus = targets[target].summary.connect.failure
      }

      if (targets[target].summary.handshake) {
        handshakeStatus = targets[target].summary.handshake.failure
      }

      return {
        name: targets[target].target_name || target,
        address: targets[target].target_address,
        type: targets[target].target_protocol,
        connect: connectStatus,
        handshake: handshakeStatus
      }
    })
  ), [targets])

  const messages = defineMessages({
    tor: {
      id: 'Measurement.Metadata.Tor',
      defaultMessage: 'Tor censorship test result in {country}'
    }
  })

  return (
    <React.Fragment>
      {render({
        status: status,
        statusInfo: hint,
        summaryText: summaryText,
        headMetadata: {
          message: messages.tor,
          formatted: false
        },
        details: (
          <React.Fragment>
            <Container>
              <Flex my={4}>
                <AccessPointStatus
                  width={1/2}
                  label={<FormattedMessage id='Measurement.Details.Tor.Bridges.Label.Title' />}
                  content={
                    <FormattedMessage
                      id='Measurement.Details.Tor.Bridges.Label.OK'
                      defaultMessage='{bridgesAccessible}/{bridgesTotal} OK'
                      values={{
                        bridgesAccessible: obfs4_accessible,
                        bridgesTotal: obfs4_total
                      }}
                    />
                  }
                  ok={true}
                  color='blue5'
                />
                <AccessPointStatus
                  width={1/2}
                  label={<FormattedMessage id='Measurement.Details.Tor.DirAuth.Label.Title' />}
                  content={
                    <FormattedMessage
                      id='Measurement.Details.Tor.DirAuth.Label.OK'
                      defaultMessage='{dirAuthAccessible}/{dirAuthTotal} OK'
                      values={{
                        dirAuthAccessible: or_port_dirauth_accessible,
                        dirAuthTotal: or_port_dirauth_total
                      }}
                    />
                  }
                  ok={true}
                  color='blue5'
                />
              </Flex>
              <TableStyles>
                <Table
                  columns={columns}
                  data={data}
                />
              </TableStyles>
            </Container>
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

TorDetails.propTypes = {
  render: PropTypes.func,
  measurement: PropTypes.object.isRequired,
  country: PropTypes.string.isRequired
}

export default TorDetails
