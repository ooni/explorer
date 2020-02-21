import React from 'react'
import PropTypes from 'prop-types'
import {
  Heading,
  Text,
  Flex,
  Box
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import MdPhoneAndroid from 'react-icons/lib/md/phone-android'
import MdWebAsset from 'react-icons/lib/md/web-asset'
import MdPersonAdd from 'react-icons/lib/md/person-add'

import AccessPointStatus from '../AccessPointStatus'

const WhatsAppDetails = ({ isAnomaly, scores, measurement, render }) => {
  const testKeys = measurement.test_keys
  const tcp_connect = testKeys.tcp_connect
  const registrationServerAccessible = scores.analysis.registration_server_accessible
  const webAccessible = scores.analysis.whatsapp_web_accessible
  const endpointsAccessible = scores.analysis.whatsapp_endpoints_accessible

  const possibleCensorship = !(
    registrationServerAccessible &&
    webAccessible &&
    endpointsAccessible
  )

  // const isFailed = (working === false && possibleCensorship === false)

  let status = 'reachable'
  let info = <FormattedMessage id='Measurement.Details.Hint.WhatsApp.Reachable' />
  let summaryText = 'Measurement.Details.SummaryText.WhatsApp.Reachable'

  if (possibleCensorship) {
    status = 'anomaly'
    info = <FormattedMessage id='Measurement.Status.Hint.WhatsApp.Blocked' />
    if (!endpointsAccessible) {
      summaryText = 'Measurement.Details.SummaryText.WhatsApp.AppFailure'
    } else if (!webAccessible) {
      summaryText = 'Measurement.Details.SummaryText.WhatsApp.DesktopFailure'
    } else if (!endpointsAccessible && !webAccessible) {
      summaryText = 'Measurement.Details.SummaryText.WhatsApp.DesktopAndAppFailure'
    }
  }


  return render({
    status: status,
    statusInfo: info,
    summaryText: summaryText,
    details: (
      <React.Fragment>
        <Box width={1/2}>
          <Flex>
            <Box width={1/3}>
              <AccessPointStatus
                icon={<MdPhoneAndroid />}
                label={<FormattedMessage id='Measurement.Details.WhatsApp.Endpoint.Label.Mobile' />}
                ok={endpointsAccessible}
              />
            </Box>
            <Box width={1/3}>
              <AccessPointStatus
                icon={<MdWebAsset />}
                label={<FormattedMessage id='Measurement.Details.WhatsApp.Endpoint.Label.Web' />}
                ok={webAccessible}
              />
            </Box>
            <Box width={1/3}>
              <AccessPointStatus
                icon={<MdPersonAdd />}
                label={<FormattedMessage id='Measurement.Details.WhatsApp.Endpoint.Label.Registration' />}
                ok={registrationServerAccessible}
              />
            </Box>
          </Flex>
        </Box>
        {tcp_connect && tcp_connect.length > 0 &&
          <React.Fragment>
            <Heading h={4}> <FormattedMessage id='Measurement.Details.WhatsApp.Endpoint.Status.Heading' /> </Heading>
            {tcp_connect.map((connection, index) => (
              <Flex key={index}>
                <Box>
                  <Text>
                    {connection.status.failure &&
                      <FormattedMessage id="Measurement.Details.WhatsApp.Endpoint.ConnectionTo.Failed"
                        values={{ destination: <strong> {connection.ip}:{connection.port} </strong> }}
                      />
                    }
                    {connection.status.success &&
                      <FormattedMessage id="Measurement.Details.WhatsApp.Endpoint.ConnectionTo.Successful"
                        values={{ destination: <strong> {connection.ip}:{connection.port} </strong> }}
                      />
                    }
                  </Text>
                </Box>
              </Flex>
            ))}
          </React.Fragment>
        }
      </React.Fragment>
    )
  })
}

WhatsAppDetails.propTypes = {
  measurement: PropTypes.object.isRequired,
  render: PropTypes.func
}

export default WhatsAppDetails
