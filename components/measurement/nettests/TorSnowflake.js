import PropTypes from 'prop-types'
import { MdTimer } from 'react-icons/md'
import { FormattedMessage, defineMessages } from 'react-intl'

import AccessPointStatus from '../AccessPointStatus'

const messages = defineMessages({
  reachable: {
    id: 'Measurement.Metadata.TorSnowflake.Reachable',
    defaultMessage: '',
  },
  unReachable: {
    id: 'Measurement.Metadata.TorSnowflake.UnReachable',
    defaultMessage: '',
  },
  error: {
    id: 'Measurement.Metadata.TorSnowflake.Error',
    defaultMessage: '',
  },
})

const TorSnowflakeDetails = ({ isAnomaly, isFailure, measurement, render }) => {
  const {
    test_keys: { bootstrap_time, failure },
  } = measurement

  let status
  let hint
  let summaryText
  let metaText

  if (isFailure) {
    status = 'error'
    hint = <FormattedMessage id="Measurement.Status.Hint.TorSnowflake.Error" />
    summaryText = 'Measurement.Details.SummaryText.TorSnowflake.Error'
    metaText = messages.error
  } else if (isAnomaly) {
    status = 'anomaly'
    hint = (
      <FormattedMessage id="Measurement.Status.Hint.TorSnowflake.Blocked" />
    )
    summaryText = 'Measurement.Details.SummaryText.TorSnowflake.Blocked'
    metaText = messages.unReachable
  } else {
    status = 'reachable'
    hint = (
      <FormattedMessage id="Measurement.Status.Hint.TorSnowflake.Reachable" />
    )
    summaryText = 'Measurement.Details.SummaryText.TorSnowflake.OK'
    metaText = messages.reachable
  }

  return (
    <>
      {render({
        status: status,
        statusInfo: hint,
        summaryText: summaryText,
        headMetadata: {
          message: metaText,
          formatted: false,
        },
        details: (
          <>
            {isAnomaly && (
              <AccessPointStatus
                label={
                  <FormattedMessage id="Measurement.Details.TorSnowflake.Error.Label" />
                }
                content={failure}
                ok={true}
              />
            )}
            {!isAnomaly && !isFailure && bootstrap_time !== null && (
              <AccessPointStatus
                icon={<MdTimer />}
                label={
                  <FormattedMessage id="Measurement.Details.TorSnowflake.BootstrapTime.Label" />
                }
                content={Number(bootstrap_time).toFixed(2)}
                ok={true}
              />
            )}
          </>
        ),
      })}
    </>
  )
}

TorSnowflakeDetails.propTypes = {
  render: PropTypes.func,
  measurement: PropTypes.object.isRequired,
}

export default TorSnowflakeDetails
