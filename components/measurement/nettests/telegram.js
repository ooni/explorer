import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Heading,
  Flex,
  Box,
  theme
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { Text } from 'rebass'
import MdPhoneAndroid from 'react-icons/lib/md/phone-android'
import MdWebAsset from 'react-icons/lib/md/web-asset'

const DetailsBox = ({ title, content, ...props}) => (
  <Box {...props}>
    <Heading h={4}>{title}</Heading>
    {content}
  </Box>
)

DetailsBox.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.element,
}

const AccessPointStatus = ({ icon, label, ok }) => (
  <Box>
    {icon}
    <Text fontWeight='bold' fontSize={0}>{label}</Text>
    <Text
      fontSize={3}
      fontWeight={200}
    >
      {ok
        ? <FormattedMessage id='Measurement.Details.Telegram.Endpoint.Status.Okay' />
        : <FormattedMessage id='Measurement.Details.Telegram.Endpoint.Status.Failed' />
      }
    </Text>
  </Box>
)

AccessPointStatus.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  ok: PropTypes.bool.isRequired
}

const TelegramDetails = ({ measurement, render }) => {
  const testKeys = measurement.test_keys
  const {
    telegram_web_status,
    telegram_tcp_blocking,
    telegram_http_blocking,
    tcp_connect
  } = testKeys

  let telegramWebOK = true
  let telegramDesktopOK = true
  let anomaly = false
  let hint = <FormattedMessage id='Measurement.Status.Hint.Telegram.Reachable' />

  if (telegram_web_status === 'blocked') {
    telegramWebOK = false
  }

  if (telegram_tcp_blocking === true || telegram_http_blocking === true) {
    telegramDesktopOK = false
  }

  if (!telegramWebOK || !telegramDesktopOK) {
    anomaly = true
    hint = <FormattedMessage id='Measurement.Status.Hint.Telegram.Blocked' />
  }

  return (
    render({
      status: anomaly ? 'anomaly': 'reachable',
      statusInfo: (anomaly === true) && 'Telegram is not working',
      summaryText: (anomaly === true)
        ? 'presented signs of Application Failure'
        : 'presented no signs of tampering and is reachable',
      details: (
        <React.Fragment>
          <Container>
            <Flex>
              <DetailsBox width={1/2} content={
                <React.Fragment>
                  <Flex>
                    <Box width={1/4}>
                      <AccessPointStatus
                        icon={<MdPhoneAndroid />}
                        label={<FormattedMessage id='Measurement.Details.Telegram.Endpoint.Label.Desktop' />}
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
                  {tcp_connect.length > 0 &&
                    <React.Fragment>
                      <Heading h={4}> <FormattedMessage id='Measurement.Details.Telegram.Endpoint.Status.Heading' /> </Heading>
                      {tcp_connect.map((connection, index) => (
                        <Flex key={index}>
                          <Box>
                            <Text>
                              <FormattedMessage
                                id='Measurement.Details.Telegram.Endpoint.ConnectionTo'
                                defaultMessage='Connection to {destination} {status, select, success {was successful} fail {failed}}.'
                                values={{
                                  destination: <strong> {connection.ip}:{connection.port} </strong>,
                                  status: connection.status.success ? 'success' : 'fail'
                                }}
                              />
                            </Text>
                          </Box>
                        </Flex>
                      ))}
                    </React.Fragment>
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
  testKeys: PropTypes.object.isRequired
}

export default TelegramDetails
