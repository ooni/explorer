import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Flex,
} from 'ooni-components'
import { FormattedMessage, defineMessages } from 'react-intl'
import MdCheckCircle from 'react-icons/lib/md/check-circle'
import MdTimelapse from 'react-icons/lib/md/timelapse'

import AccessPointStatus from '../AccessPointStatus'

const VanillaTorDetails = ({ measurement, render }) => {
  const testKeys = measurement.test_keys
  const isOK = testKeys.success === true
  const isAnomaly = testKeys.success === false
  const torVersion = testKeys.tor_version
  const torLog = testKeys.tor_log
  const torProgress = testKeys.tor_progress
  const isFailure = testKeys.error !== null
  const failure = testKeys.failure

  const messages = defineMessages({
    reachable: {
      id: 'Measurement.Metadata.VanillaTor.Reachable',
      defaultMessage: 'On {date}, Vanilla Tor was able to bootstrap in {country}, explore more details and other measurements on OONI Explorer.'
    },
    unReachable: {
      id: 'Measurement.Metadata.VanillaTor.UnReachable',
      defaultMessage: 'On {date}, Vanilla Tor was NOT able to bootstrap in {country}, explore more details and other measurements on OONI Explorer.'
    }
  })

  return (
    render({
      status: isAnomaly ? 'anomaly' : 'reachable',
      statusLabel: isAnomaly
        ? <FormattedMessage id='Measurement.Hero.Status.TorVanilla.Blocked' />
        : <FormattedMessage id='Measurement.Hero.Status.TorVanilla.Reachable' />,
      summaryText: isAnomaly
        ? 'Measurement.Details.SummaryText.TorVanilla.Blocked'
        : 'Measurement.Details.SummaryText.TorVanilla.Reachable',
      headMetadata: {
        message: isAnomaly ? messages.unReachable : messages.reachable,
        formatted: false
      },
      details: (
        <React.Fragment>
          <Container>
            <Flex>
              <AccessPointStatus
                width={1/4}
                icon={<MdCheckCircle />}
                label={<FormattedMessage id='Measurement.Details.VanillaTor.Endpoint.Label.Reachability' />}
                ok={!isAnomaly}
              />
              {/* <AccessPointStatus
                width={1/4}
                icon={<MdTimelapse />}
                label={<FormattedMessage id='Measurement.Details.VanillaTor.Endpoint.Label.Progress' />}
                ok={!isAnomaly}
                content={<FormattedMessage id='Measurement.Details.VanillaTor.Endpoint.Progress' />}
              /> */}
            </Flex>
          </Container>
        </React.Fragment>
      )}
    )
  )
}

VanillaTorDetails.propTypes = {
  measurement: PropTypes.object.isRequired,
  render: PropTypes.func}

export default VanillaTorDetails
