import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Heading,
  Flex,
  Text,
  Box,
  theme
} from 'ooni-components'

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

const AccessPointStatus = ({ label, ok }) => (
  <Box>
    <Text fontSize={0}>{label}</Text>
    <Text
      fontSize={3}
      color={ok ? theme.colors.blue5 : theme.colors.red7}
    >
      {ok ? 'Okay' : 'Failed'}
    </Text>
  </Box>
)

AccessPointStatus.propTypes = {
  label: PropTypes.string.isRequired,
  ok: PropTypes.bool.isRequired
}

const TelegramDetails = ({ testKeys }) => {
  const {
    telegram_web_status,
    telegram_tcp_blocking,
    telegram_http_blocking,
    tcp_connect
  } = testKeys

  let telegramWebOK = true
  let telegramDesktopOK = true

  if (telegram_web_status === 'blocked') {
    telegramWebOK = false
  }

  if (telegram_tcp_blocking === true || telegram_http_blocking === true) {
    telegramDesktopOK = false
  }

  return (
    <Container>
      <Flex>
        <DetailsBox w={1/2} title='Test Details' content={
          <Flex>
            <Box w={1/4}>
              <AccessPointStatus label='Desktop App' ok={telegramDesktopOK} />
            </Box>
            <Box w={1/4}>
              <AccessPointStatus label='Web App' ok={telegramWebOK} />
            </Box>
          </Flex>
        } />
        <DetailsBox w={1/2} title='Endpoint Status' content={
          <React.Fragment>
            {tcp_connect.length === 0 && <Text> No results</Text>}
            {tcp_connect.map((connection, index) => (
              <Flex key={index}>
                <Box>
                  <Text>Connection to <strong>{connection.ip}:{connection.port}</strong>{
                    connection.status.success ? ' was successful' : ' failed'
                  }</Text>
                </Box>
              </Flex>
            ))}
          </React.Fragment>
        } />
      </Flex>
    </Container>
  )
}

TelegramDetails.propTypes = {
  testKeys: PropTypes.object.isRequired
}

export default TelegramDetails
