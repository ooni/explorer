import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Container } from 'ooni-components'
import { MdTimer } from 'react-icons/lib/md'
import { defineMessages } from 'react-intl'

import AccessPointStatus from '../AccessPointStatus'

const PsiphonDetails = ({
  measurement,
  render
}) => {
  const {
    test_keys: {
      failure,
      bootstrap_time
    }
  } = measurement

  const messages = defineMessages({
    reachable: {
      id: 'Measurement.Metadata.Psiphon.Reachable',
      defaultMessage: 'Psiphon was reachable in {country}'
    },
    unReachable: {
      id: 'Measurement.Metadata.Psiphon.UnReachable',
      defaultMessage: 'Psiphon was NOT reachable in {country}'
    }
  })

  let status, hint, summaryText

  // https://github.com/ooni/spec/blob/master/nettests/ts-015-psiphon.md#possible-conclusions
  // Determine if psiphon is blocked and if the probe could bootstrap psiphon
  if (failure) {
    status = 'anomaly'
    if (bootstrap_time === 0) {
      // Unable to bootstrap
      hint = <FormattedMessage id='Measurement.Status.Hint.Psiphon.BootstrappingError' />
        summaryText = 'Measurement.Details.SummaryText.Psiphon.BootstrappingError'
    } else {
      // Unable to use Psiphon to reach https://google.com/humans.txt
      hint = <FormattedMessage id='Measurement.Status.Hint.Psiphon.Blocked' />
        summaryText = 'Measurement.Details.SummaryText.Psiphon.Blocked'
    }
  } else {
    status = 'reachable'
    hint = <FormattedMessage id='Measurement.Status.Hint.Psiphon.Reachable' />
      summaryText = 'Measurement.Details.SummaryText.Psiphon.OK'
  }

  return (
    <React.Fragment>
      {render({
        status: status,
        statusInfo: hint,
        summaryText: summaryText,
        headMetadata: {
          message: failure ? messages.unReachable : messages.reachable,
          formatted: false
        },
        details: (
          <React.Fragment>
            <Container>
              <Flex>
                {
                  bootstrap_time &&
                    <AccessPointStatus
                      icon={<MdTimer />}
                      label={<FormattedMessage id='Measurement.Details.Psiphon.BootstrapTime.Label' />}
                      content={bootstrap_time.toFixed(2)}
                      ok={true}
                    />
                }
              </Flex>
            </Container>
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

PsiphonDetails.propTypes = {
  render: PropTypes.func,
  measurement: PropTypes.object.isRequired,
  country: PropTypes.string.isRequired
}

export default PsiphonDetails
