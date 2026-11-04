import type { ReactNode } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { DetailsBoxTable } from './DetailsBox'
import type { WebObservation } from './observations/types'

export type CommonDetailsFields = {
  software_name?: string | null
  software_version?: string | null
  engine_name?: string | null
  engine_version?: string | null
  platform?: string | null
  resolver_asn?: string | number | null
  resolver_ip?: string | null
  resolver_network_name?: string | null
}

export type RawMeasurement = {
  software_name?: string | null
  software_version?: string | null
  annotations?: {
    engine_name?: string | null
    engine_version?: string | null
    platform?: string | null
    [key: string]: unknown
  } | null
  resolver_asn?: string | number | null
  resolver_ip?: string | null
  resolver_network_name?: string | null
  probe_network_name?: string | null
  test_runtime?: number | null
  test_name?: string
  test_keys?: Record<string, unknown> | null
}

export function commonDetailsFromObservation(
  o?: WebObservation | null,
): CommonDetailsFields {
  if (!o) return {}
  return {
    software_name: o.software_name,
    software_version: o.software_version,
    engine_name: o.engine_name,
    engine_version: o.engine_version,
    platform: o.platform,
    resolver_asn: o.resolver_asn,
    resolver_ip: o.resolver_ip,
    resolver_network_name: o.resolver_as_org_name,
  }
}

export function commonDetailsFromRaw(
  m?: RawMeasurement | null,
): CommonDetailsFields {
  if (!m) return {}
  return {
    software_name: m.software_name,
    software_version: m.software_version,
    engine_name: m.annotations?.engine_name,
    engine_version: m.annotations?.engine_version,
    platform: m.annotations?.platform,
    resolver_asn: m.resolver_asn,
    resolver_ip: m.resolver_ip,
    resolver_network_name: m.resolver_network_name,
  }
}

type UserFeedbackItem = {
  label: string
  value?: ReactNode
}

type CommonDetailsProps = {
  details?: CommonDetailsFields
  reportId?: string
  measurementUid?: string
  userFeedbackItems?: UserFeedbackItem[]
}

const CommonDetails = ({
  details = {},
  reportId,
  measurementUid,
  userFeedbackItems = [],
}: CommonDetailsProps) => {
  const {
    software_name,
    software_version,
    engine_name,
    engine_version,
    platform: platformValue,
    resolver_asn,
    resolver_ip,
    resolver_network_name,
  } = details

  const intl = useIntl()
  const unavailable = intl.formatMessage({
    id: 'Measurement.CommonDetails.Value.Unavailable',
  })

  let engine = unavailable
  let platform = unavailable

  if (engine_name) {
    engine = engine_name

    if (engine_version) {
      engine = `${engine} (${engine_version})`
    }
  }

  if (platformValue) {
    platform = platformValue
  }

  let software = software_name ?? unavailable
  software += software_version ? ` (${software_version})` : ''

  const items = [
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.MsmtID',
      }),
      value: measurementUid ?? unavailable,
    },
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.ReportID',
      }),
      value: reportId ?? unavailable,
    },
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.Platform',
      }),
      value: platform,
    },
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.Software',
      }),
      value: software,
    },
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.Engine',
      }),
      value: engine,
    },
  ]

  const showResolverItems = resolver_asn || resolver_ip || resolver_network_name
  const resolverItems = [
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.ResolverASN',
      }),
      value: resolver_asn ?? unavailable,
    },
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.ResolverIP',
      }),
      value: resolver_ip ?? unavailable,
    },
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.ResolverNetworkName',
      }),
      value: resolver_network_name ?? unavailable,
    },
  ]

  return (
    <>
      {!!showResolverItems && (
        <DetailsBoxTable
          title={
            <FormattedMessage id="Measurement.CommonDetails.Label.Resolver" />
          }
          items={resolverItems}
        />
      )}
      <DetailsBoxTable items={items} className="bg-gray-200" />
      {!!userFeedbackItems.length && (
        <DetailsBoxTable
          title={
            <FormattedMessage id="Measurement.CommonDetails.Label.UserFeedback" />
          }
          items={userFeedbackItems}
        />
      )}
    </>
  )
}

export default CommonDetails
