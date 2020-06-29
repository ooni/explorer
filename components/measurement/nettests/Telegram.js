import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Heading,
  Text,
  Flex,
  Box,
  theme
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import MdPhoneAndroid from 'react-icons/lib/md/phone-android'
import MdWebAsset from 'react-icons/lib/md/web-asset'
import { defineMessages } from 'react-intl'

import AccessPointStatus from '../AccessPointStatus'
import { DetailsBox } from '../DetailsBox'

const TelegramDetails = ({ measurement, render }) => {
  const testKeys = measurement.test_keys
  const {
    telegram_web_status,
    telegram_tcp_blocking,
    telegram_http_blocking,
    tcp_connect
  } = testKeys

  const message = defineMessages({
    reachable: {
      id: 'Measurement.Metadata.Telegram.Reachable',
      defaultMessage: 'On {date}, Telegram was reachable in {country}, explore more details and other measurements on OONI Explorer.'
    },
    unReachable: {
      id: 'Measurement.Metadata.Telegram.UnReachable',
      defaultMessage: 'On {date}, Telegram was NOT reachable in {country}, explore more details and other measurements on OONI Explorer.'
    }
  })

  let telegramWebOK = true
  let telegramDesktopOK = true
  let anomaly = false
  let hint = <FormattedMessage id='Measurement.Status.Hint.Telegram.Reachable' />
    let summaryText = 'Measurement.Details.SummaryText.Telegram.Reachable'
  let headMetadata = message.reachable

  if (telegram_web_status === 'blocked') {
    telegramWebOK = false
    summaryText = 'Measurement.Details.SummaryText.Telegram.AppFailure'
    headMetadata = message.unReachable
  }

  if (telegram_tcp_blocking === true || telegram_http_blocking === true) {
    telegramDesktopOK = false
    summaryText = 'Measurement.Details.SummaryText.Telegram.DesktopFailure'
    headMetadata = message.unReachable
  }

  if (!telegramWebOK || !telegramDesktopOK) {
    anomaly = true
    hint = <FormattedMessage id='Measurement.Status.Hint.Telegram.Blocked' />
      summaryText = 'Measurement.Details.SummaryText.Telegram.DesktopAndAppFailure'
    headMetadata = message.unReachable
  }

  return (
    render({
      status: anomaly ? 'anomaly': 'reachable',
      statusInfo: hint,
      summaryText: summaryText,
      headMetadata: {
        message: headMetadata,
        formatted: false
      },
      details: (
        <React.Fragment>
          <Container>
            <Flex>
              <DetailsBox content={
                <React.Fragment>
                  <Flex>
                    <Box width={1/4}>
                      <AccessPointStatus
                        icon={<MdPhoneAndroid />}
                        label={<FormattedMessage id='Measurement.Details.Telegram.Endpoint.Label.Mobile' />}
                        ok={telegramDesktopOK}
                      />
                    </Box>
                    <Box width={1/4}>
                      <AccessPointStatus
                        icon={<MdWebAsset />}
                        label={<FormattedMessage id='Measurement.Details.Telegram.Endpoint.Label.Web' />}
                        ok={telegramWebOK}
                      />
                    </Box>
                  </Flex>
                  {tcp_connect && tcp_connect.length > 0 &&
                  <div>
                    <Heading h={4}> <FormattedMessage id='Measurement.Details.Telegram.Endpoint.Status.Heading' /> </Heading>
                    {tcp_connect.map((connection, index) => (
                      <Flex key={index}>
                        <Box>
                          <Text>
                            {connection.status.failure &&
                            <FormattedMessage id="Measurement.Details.Telegram.Endpoint.ConnectionTo.Failed"
                              values={{ destination: <strong> {connection.ip}:{connection.port} </strong> }}
                            />
                            }
                            {connection.status.success &&
                              <FormattedMessage id="Measurement.Details.Telegram.Endpoint.ConnectionTo.Successful"
                                values={{ destination: <strong> {connection.ip}:{connection.port} </strong> }}
                              />
                            }
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                  </div>
                  }
                </React.Fragment>
                } />
            </Flex>
          </Container>
        </React.Fragment>
      )
    })
  )
}

TelegramDetails.propTypes = {
  measurement: PropTypes.object.isRequired,
  render: PropTypes.func
}

export default TelegramDetails
