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

const WhatsAppDetails = ({ measurement, render }) => {
  const testKeys = measurement.test_keys
  const tcp_connect = testKeys.tcp_connect
  const registrationServerBlocked = testKeys.registration_server_status === 'blocked'
  const webBlocked = testKeys.whatsapp_web_status === 'blocked'
  const endpointsBlocked = testKeys.whatsapp_endpoints_status === 'blocked'

  const possibleCensorship = (
    testKeys.whatsapp_endpoints_status === 'blocked' ||
    testKeys.whatsapp_web_status === 'blocked' ||
    testKeys.facebook_tcp_blocking === true ||
    testKeys.registration_server_status === 'blocked')

  const working = (
    testKeys.registration_server_status === 'ok' &&
    testKeys.whatsapp_web_status === 'ok' &&
    testKeys.registration_server_status === 'ok'
  )

  const isFailed = (working === false && possibleCensorship === false)
  let status = 'reachable', info = <FormattedMessage id='Measurement.Details.Hint.WhatsApp.Reachable' />
  if (possibleCensorship || !working) {
    status = 'anomaly'
    info = possibleCensorship
      ? <FormattedMessage id='Measurement.Status.Hint.WhatsApp.Blocked' />
      : <FormattedMessage id='Measurement.Status.Hint.WhatsApp.Failed' />
  }

  return render({
    status: status,
    statusInfo: info,
    summaryText: info,
    details: (
      <React.Fragment>
        <Box width={1/2}>
          <Flex>
            <Box width={1/3}>
              <AccessPointStatus
                icon={<MdPhoneAndroid />}
                label={<FormattedMessage id='Measurement.Details.WhatsApp.Endpoint.Label.Mobile' />}
                ok={!endpointsBlocked}
              />
            </Box>
            <Box width={1/3}>
              <AccessPointStatus
                icon={<MdWebAsset />}
                label={<FormattedMessage id='Measurement.Details.WhatsApp.Endpoint.Label.Web' />}
                ok={!webBlocked}
              />
            </Box>
            <Box width={1/3}>
              <AccessPointStatus
                icon={<MdPersonAdd />}
                label={<FormattedMessage id='Measurement.Details.WhatsApp.Endpoint.Label.Registration' />}
                ok={!registrationServerBlocked}
              />
            </Box>
          </Flex>
        </Box>
        {tcp_connect.length > 0 &&
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
