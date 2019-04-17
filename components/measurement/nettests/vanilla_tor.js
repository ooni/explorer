import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Flex,
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'
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
  return (
    render({
      status: isAnomaly ? 'anomaly' : 'reachable',
      statusLabel: isAnomaly
        ? <FormattedMessage id='Measurement.Hero.Status.TorVanilla.Blocked' />
        : <FormattedMessage id='Measurement.Hero.Status.TorVanilla.Reachable' />,
      statusInfo: isAnomaly
        ? <FormattedMessage id='Measurement.Status.Hint.TorVanilla.Blocked' />
        : <FormattedMessage id='Measurement.Status.Hint.TorVanilla.Reachable' />,
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
              <AccessPointStatus
                width={1/4}
                icon={<MdTimelapse />}
                label={<FormattedMessage id='Measurement.Details.VanillaTor.Endpoint.Label.Progress' />}
                ok={!isAnomaly}
                content={<FormattedMessage id='Measurement.Details.VanillaTor.Endpoint.Progress' />}
              />
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
