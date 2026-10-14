import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'

import { DetailsBoxTable } from './DetailsBox'

const CommonDetails = ({
  measurement,
  reportId,
  measurementUid,
  userFeedbackItems = [],
}) => {
  const {
    software_name,
    software_version,
    annotations,
    resolver_asn,
    resolver_ip,
    resolver_network_name,
  } = measurement ?? {}

  const intl = useIntl()
  const unavailable = intl.formatMessage({
    id: 'Measurement.CommonDetails.Value.Unavailable',
  })

  let engine = unavailable
  let platform = unavailable

  if (annotations?.engine_name) {
    engine = annotations.engine_name

    if (annotations.engine_version) {
      engine = `${engine} (${annotations.engine_version})`
    }
  }

  if (annotations?.platform) {
    platform = annotations.platform
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
      {showResolverItems && (
        // Resolver data
        <DetailsBoxTable
          title={
            <FormattedMessage id="Measurement.CommonDetails.Label.Resolver" />
          }
          items={resolverItems}
        />
      )}
      {/* Metadata: platform, probe, MK version etc. */}
      <DetailsBoxTable items={items} className="bg-gray-200" />
      {/* User Feedback */}
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

CommonDetails.propTypes = {
  measurement: PropTypes.object,
  reportId: PropTypes.string,
  measurementUid: PropTypes.string,
}

export default CommonDetails
