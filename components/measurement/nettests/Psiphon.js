import PropTypes from 'prop-types'
import { MdTimer } from 'react-icons/md'
import { FormattedMessage, defineMessages } from 'react-intl'

import AccessPointStatus from '../AccessPointStatus'

const PsiphonDetails = ({ measurement, render }) => {
  const {
    test_keys: { failure, bootstrap_time },
  } = measurement

  const messages = defineMessages({
    reachable: {
      id: 'Measurement.Metadata.Psiphon.Reachable',
      defaultMessage: 'Psiphon was reachable in {country}',
    },
    unReachable: {
      id: 'Measurement.Metadata.Psiphon.UnReachable',
      defaultMessage: 'Psiphon was NOT reachable in {country}',
    },
  })

  let status
  let hint
  let summaryText
  let metaText

  // https://github.com/ooni/spec/blob/master/nettests/ts-015-psiphon.md#possible-conclusions
  // Determine if psiphon is blocked and if the probe could bootstrap psiphon
  if (failure) {
    status = 'anomaly'
    metaText = messages.unReachable
    if (bootstrap_time === 0) {
      // Unable to bootstrap
      hint = (
        <FormattedMessage id="Measurement.Status.Hint.Psiphon.BootstrappingError" />
      )
      summaryText = 'Measurement.Details.SummaryText.Psiphon.BootstrappingError'
    } else {
      // Unable to use Psiphon to reach https://google.com/humans.txt
      hint = <FormattedMessage id="Measurement.Status.Hint.Psiphon.Blocked" />
      summaryText = 'Measurement.Details.SummaryText.Psiphon.Blocked'
    }
  } else {
    status = 'reachable'
    hint = <FormattedMessage id="Measurement.Status.Hint.Psiphon.Reachable" />
    summaryText = 'Measurement.Details.SummaryText.Psiphon.OK'
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
          <div className="container">
            <div className="flex">
              {bootstrap_time && (
                <AccessPointStatus
                  icon={<MdTimer />}
                  label={
                    <FormattedMessage id="Measurement.Details.Psiphon.BootstrapTime.Label" />
                  }
                  content={Number(bootstrap_time).toFixed(2)}
                  ok={true}
                />
              )}
            </div>
          </div>
        ),
      })}
    </>
  )
}

PsiphonDetails.propTypes = {
  render: PropTypes.func,
  measurement: PropTypes.object.isRequired,
  country: PropTypes.string.isRequired,
}

export default PsiphonDetails
