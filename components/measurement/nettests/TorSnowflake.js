import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Flex, Container } from 'ooni-components'
import { MdTimer } from 'react-icons/md'

import AccessPointStatus from '../AccessPointStatus'

const messages = defineMessages({
  reachable: {
    id: 'Measurement.Metadata.TorSnowflake.Reachable',
    defaultMessage: 'Telegram was reachable in {country}'
  },
  unReachable: {
    id: 'Measurement.Metadata.TorSnowflake.UnReachable',
    defaultMessage: 'Telegram was NOT reachable in {country}'
  }
})

const TorSnowflakeDetails = ({ isAnomaly, isFailure, measurement, render }) => {
  const { 
    test_keys: {
      bootstrap_time,
      failure
    }
  } = measurement

  let status, hint, summaryText, metaText

  if (isFailure) {
    status = 'error'
    hint = <FormattedMessage id='Measurement.Status.Hint.TorSnowflake.Error' />
    summaryText = 'Measurement.Details.SummaryText.TorSnowflake.Error'
  } else if (isAnomaly) {
    status = 'anomaly'
    hint = <FormattedMessage id='Measurement.Status.Hint.TorSnowflake.Blocked' />
    summaryText = 'Measurement.Details.SummaryText.TorSnowflake.Blocked'
  } else {
    status = 'reachable'
    hint = <FormattedMessage id='Measurement.Status.Hint.TorSnowflake.Reachable' />
    summaryText = 'Measurement.Details.SummaryText.TorSnowflake.OK'
  }

  return (
    <React.Fragment>
      {render({
        status: status,
        statusInfo: hint,
        summaryText: summaryText,
        details: (
          <React.Fragment>
            <Container>
              <Flex>
                { isAnomaly &&
                    <AccessPointStatus
                      label={<FormattedMessage id='Measurement.Details.TorSnowflake.Error.Label' />}
                      content={failure}
                      ok={true}
                    />
                }
                {
                  !isAnomaly && !isFailure && bootstrap_time !== null &&
                    <AccessPointStatus
                      icon={<MdTimer />}
                      label={<FormattedMessage id='Measurement.Details.TorSnowflake.BootstrapTime.Label' />}
                      content={Number(bootstrap_time).toFixed(2)}
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

TorSnowflakeDetails.propTypes = {
  render: PropTypes.func,
  measurement: PropTypes.object.isRequired
}

export default TorSnowflakeDetails