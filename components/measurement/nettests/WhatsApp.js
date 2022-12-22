import React from 'react'
import PropTypes from 'prop-types'
import {
  Heading,
  Text,
  Flex,
  Box
} from 'ooni-components'
import { FormattedMessage, defineMessages } from 'react-intl'
import { MdPhoneAndroid } from 'react-icons/md'
import { MdWebAsset } from 'react-icons/md'
import { MdPersonAdd } from 'react-icons/md'
import styled from 'styled-components'

import AccessPointStatus from '../AccessPointStatus'
import { DetailsBox } from '../DetailsBox'

const BugBox = styled(Box)`
  margin-bottom: 30px;
  background-color: ${props => props.theme.colors.yellow2};
  border: 1px solid ${props => props.theme.colors.yellow8};
  padding: 20px;
`

const WhatsAppDetails = ({ isAnomaly, scores, measurement, render }) => {
  const testKeys = measurement.test_keys
  const tcp_connect = testKeys.tcp_connect
  let registrationServerAccessible, webAccessible, endpointsAccessible
  try {
    registrationServerAccessible = scores.analysis.registration_server_accessible
    endpointsAccessible = scores.analysis.whatsapp_endpoints_accessible
    webAccessible = scores.analysis.whatsapp_web_accessible
  } catch (e) {
    registrationServerAccessible = testKeys.registration_server_status === 'ok'
    endpointsAccessible = testKeys.whatsapp_endpoints_status === 'ok'
    webAccessible = testKeys.whatsapp_web_status === 'ok'
  }

  const messages = defineMessages({
    reachable: {
      id: 'Measurement.Metadata.Whatsapp.Reachable',
      defaultMessage: 'WhatsApp was reachable in {country}'
    },
    unReachable: {
      id: 'Measurement.Metadata.Whatsapp.UnReachable',
      defaultMessage: 'WhatsApp was likely blocked in {country}'
    }
  })

  let status = 'reachable'
  let info = <FormattedMessage id='Measurement.Details.Hint.WhatsApp.Reachable' />
  let summaryText = 'Measurement.Details.SummaryText.WhatsApp.Reachable'

  if (isAnomaly) {
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
    headMetadata: {
      message: isAnomaly ? messages.unReachable : messages.reachable,
      formatted: false
    },
    details: (
      <>
        <Box mb={4} width={1/2}>
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
        {Array.isArray(tcp_connect) && tcp_connect.length > 0 &&
          <>
            <DetailsBox
              title={<FormattedMessage id='Measurement.Details.WhatsApp.Endpoint.Status.Heading' />}
              content={
                <>
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
                </>
              }
            />
          </>
        }
      </>
    )
  })
}

WhatsAppDetails.propTypes = {
  measurement: PropTypes.object.isRequired,
  render: PropTypes.func
}

export default WhatsAppDetails
