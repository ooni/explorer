import React from 'react'
import PropTypes from 'prop-types'
import url from 'url'
import moment from 'moment'
import NLink from 'next/link'
import styled from 'styled-components'
import { defineMessages, useIntl } from 'react-intl'
import {
  Flex, Box,
  Link,
  Text
} from 'ooni-components'

import {
  colorNormal,
  colorError,
  colorConfirmed,
  colorAnomaly
} from '../colors'
import Flag from '../Flag'

const StyledResultTag = styled.div`
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 12px;
`

const ResultTagFilled = styled(StyledResultTag)`
  background-color: ${props => props.theme.colors.gray7};
  color: ${props => props.theme.colors.white};
`

const ResultTagHollow = styled(StyledResultTag)`
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.gray7};
  color: ${props => props.theme.colors.gray7};
`

const testsWithStates = [
  'web_connectivity',
  'telegram',
  'whatsapp',
  'facebook_messenger',
  'signal',
  'tor',
  'torsf',
  'psiphon',
  'riseupvpn',
  'http_header_field_manipulation',
  'http_invalid_request_line',
]

const imTests = [
  'telegram',
  'whatsapp',
  'facebook_messenger'
]

const messages = defineMessages({
  'Search.WebConnectivity.Results.Reachable': {
    id: 'Search.WebConnectivity.Results.Reachable',
    defaultMessage: ''
  },
  'Search.WebConnectivity.Results.Anomaly': {
    id: 'Search.WebConnectivity.Results.Anomaly',
    defaultMessage: ''
  },
  'Search.WebConnectivity.Results.Blocked': {
    id: 'Search.WebConnectivity.Results.Blocked',
    defaultMessage: ''
  },
  'Search.WebConnectivity.Results.Error': {
    id: 'Search.WebConnectivity.Results.Error',
    defaultMessage: ''
  },
  'Search.WhatsApp.Results.Reachable': {
    id: 'Search.WhatsApp.Results.Reachable',
    defaultMessage: ''
  },
  'Search.WhatsApp.Results.Anomaly': {
    id: 'Search.WhatsApp.Results.Anomaly',
    defaultMessage: ''
  },
  'Search.WhatsApp.Results.Error': {
    id: 'Search.WhatsApp.Results.Error',
    defaultMessage: ''
  },
  'Search.FacebookMessenger.Results.Reachable': {
    id: 'Search.FacebookMessenger.Results.Reachable',
    defaultMessage: ''
  },
  'Search.FacebookMessenger.Results.Anomaly': {
    id: 'Search.FacebookMessenger.Results.Anomaly',
    defaultMessage: ''
  },
  'Search.FacebookMessenger.Results.Error': {
    id: 'Search.FacebookMessenger.Results.Error',
    defaultMessage: ''
  },
  'Search.Telegram.Results.Reachable': {
    id: 'Search.Telegram.Results.Reachable',
    defaultMessage: ''
  },
  'Search.Telegram.Results.Anomaly': {
    id: 'Search.Telegram.Results.Anomaly',
    defaultMessage: ''
  },
  'Search.Telegram.Results.Error': {
    id: 'Search.Telegram.Results.Error',
    defaultMessage: ''
  },
  'Search.Signal.Results.Reachable': {
    id: 'Search.Signal.Results.Reachable',
    defaultMessage: ''
  },
  'Search.Signal.Results.Anomaly': {
    id: 'Search.Signal.Results.Anomaly',
    defaultMessage: ''
  },
  'Search.Signal.Results.Error': {
    id: 'Search.Signal.Results.Error',
    defaultMessage: ''
  },
  'Search.HTTPInvalidRequestLine.Results.Anomaly': {
    id: 'Search.HTTPInvalidRequestLine.Results.Anomaly',
    defaultMessage: ''
  },
  'Search.HTTPInvalidRequestLine.Results.Reachable': {
    id: 'Search.HTTPInvalidRequestLine.Results.Reachable',
    defaultMessage: ''
  },
  'Search.HTTPInvalidRequestLine.Results.Error': {
    id: 'Search.HTTPInvalidRequestLine.Results.Error',
    defaultMessage: ''
  },
  'Search.HTTPHeaderFieldManipulation.Results.Anomaly': {
    id: 'Search.HTTPHeaderFieldManipulation.Results.Anomaly',
    defaultMessage: ''
  },
  'Search.HTTPHeaderFieldManipulation.Results.Reachable': {
    id: 'Search.HTTPHeaderFieldManipulation.Results.Reachable',
    defaultMessage: ''
  },
  'Search.HTTPHeaderFieldManipulation.Results.Error': {
    id: 'Search.HTTPHeaderFieldManipulation.Results.Error',
    defaultMessage: ''
  },
  'Search.HTTPRequests.Results.Reachable': {
    id: 'Search.HTTPRequests.Results.Reachable',
    defaultMessage: ''
  },
  'Search.HTTPRequests.Results.Error': {
    id: 'Search.HTTPRequests.Results.Error',
    defaultMessage: ''
  },
  'Search.HTTPRequests.Results.Blocked': {
    id: 'Search.HTTPRequests.Results.Blocked',
    defaultMessage: ''
  },
  'Search.HTTPRequests.Results.Anomaly': {
    id: 'Search.HTTPRequests.Results.Anomaly',
    defaultMessage: ''
  },
  'Search.Tor.Results.Reachable': {
    id: 'Search.Tor.Results.Reachable',
    defaultMessage: ''
  },
  'Search.Tor.Results.Anomaly': {
    id: 'Search.Tor.Results.Anomaly',
    defaultMessage: ''
  },
  'Search.TorSnowflake.Results.Reachable': {
    id: 'Search.TorSnowflake.Results.Reachable',
    defaultMessage: 'Reachable'
  },
  'Search.TorSnowflake.Results.Anomaly': {
    id: 'Search.TorSnowflake.Results.Anomaly',
    defaultMessage: 'Anomaly'
  },
  'Search.TorSnowflake.Results.Error': {
    id: 'Search.TorSnowflake.Results.Anomaly',
    defaultMessage: 'Anomaly'
  },
  'Search.Psiphon.Results.Reachable': {
    id: 'Search.Psiphon.Results.Reachable',
    defaultMessage: ''
  },
  'Search.Psiphon.Results.Anomaly': {
    id: 'Search.Psiphon.Results.Anomaly',
    defaultMessage: ''
  },
  'Search.Psiphon.Results.Error': {
    id: 'Search.Psiphon.Results.Error',
    defaultMessage: ''
  },
  'Search.RiseupVPN.Results.Reachable': {
    id: 'Search.RiseupVPN.Results.Reachable',
    defaultMessage: ''
  },
  'Search.RiseupVPN.Results.Anomaly': {
    id: 'Search.RiseupVPN.Results.Anomaly',
    defaultMessage: ''
  },
  'Search.RiseupVPN.Results.Error': {
    id: 'Search.RiseupVPN.Results.Error',
    defaultMessage: ''
  },
})

const ASNBox = ({asn}) => {
  const justNumber = asn.split('AS')[1]
  return <Text bold color='gray7'>AS {justNumber}</Text>
}

ASNBox.propTypes = {
  asn: PropTypes.string
}

// XXX add this to the design system
const StyledViewDetailsLink = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  color: ${props => props.theme.colors.blue5};
  &:hover {
    color: ${props => props.theme.colors.blue9};
  }
`

const ViewDetailsLink = ({reportId, input, children}) => {
  let href = `/measurement/${reportId}`
  if (input) {
    href += `?input=${encodeURIComponent(input)}`
  }
  return (
    <NLink href={href}>
      <StyledViewDetailsLink href={href}>{children}</StyledViewDetailsLink>
    </NLink>
  )
}

ViewDetailsLink.propTypes = {
  reportId: PropTypes.string,
  input: PropTypes.string,
  children: PropTypes.element.isRequired
}

const ColoredIndicator = styled.div`
  height: 100%;
  width: 5px;
  margin-right: 10px;
  background-color: ${props => props.color || 'unset'}
`

const ResultRow = styled(Flex)`
  color: ${props => props.theme.colors.gray7};
  background-color: #ffffff;
  &:hover {
    background-color: ${props => props.theme.colors.gray0};
  }
  border-bottom: 1px solid ${props => props.theme.colors.gray4};
  cursor: pointer;
`

const Hostname = styled.span`
  color: ${props => props.theme.colors.black};
`

const ResultInput = styled.div`
  color: ${props => props.theme.colors.gray5};
`

const getIndicators = ({ test_name, testDisplayName, scores = {}, confirmed, anomaly, failure, intl }) => {
  let color = '', tag = null
  if (testsWithStates.includes(test_name)) {
    if (imTests.includes(test_name) && Object.entries(scores).length === 0) {
      return [color, tag]
    }

    const testName = testDisplayName.replace(/ /gi, '')
    const computedMessageIdPrefix = `Search.${testName}.Results`
    const blockingType = scores.analysis && scores.analysis.blocking_type

    if (failure === true) {
      color = colorError
      tag = (
        <ResultTagHollow>
          {intl.formatMessage(messages[`${computedMessageIdPrefix}.Error`])}
        </ResultTagHollow>
      )
    } else if (confirmed === true) {
      color = colorConfirmed
      tag = (
        <ResultTagFilled>
          {intl.formatMessage(messages[`${computedMessageIdPrefix}.Blocked`])}
        </ResultTagFilled>
      )
    } else if (blockingType !== undefined) {
      color = colorAnomaly
      tag = (
        <ResultTagHollow>
          {blockingType}
        </ResultTagHollow>
      )
    } else if (anomaly === true) {
      color = colorAnomaly
      tag = (
        <ResultTagHollow>
          {intl.formatMessage(messages[`${computedMessageIdPrefix}.Anomaly`])}
        </ResultTagHollow>
      )
    } else {
      color = colorNormal
      tag = (
        <StyledResultTag>
          {intl.formatMessage(messages[`${computedMessageIdPrefix}.Reachable`])}
        </StyledResultTag>
      )
    }
  }
  return [color, tag]
}

const ResultItem = ({
  test_name,
  testDisplayName,
  input,
  report_id,
  probe_cc,
  probe_asn,
  measurement_start_time,
  scores,
  confirmed,
  anomaly,
  failure
}) => {
  const intl = useIntl()
  const pathMaxLen = 10
  let inputLabel = input
  if (input) {
    const p = url.parse(input)

    if (p.protocol !== null) {
      // Truncate the path part of the URL to ${pathMaxLen}
      let path = p.path
      if (path && path.length > pathMaxLen) {
        path = `${path.substr(0, pathMaxLen)}…`
      }

      // Truncate the domain to ${domainMaxLen}
      const domainMaxLen = 25
      if (p.host && p.host.length > domainMaxLen) {
        p.host = `${p.host.substr(0, domainMaxLen)}…`
      }

      inputLabel = <span><Hostname>{`${p.protocol}//${p.host}`}</Hostname>{path}</span>
    } else {
      inputLabel = <Hostname>{p.path}</Hostname>
    }
  }

  const [indicatorColor, tag] = getIndicators({test_name, testDisplayName, scores, confirmed, anomaly, failure, intl})

  return (
    <ViewDetailsLink reportId={report_id} input={input}>
      <ResultRow flexWrap='wrap' alignItems='stretch'>
        <Box width={1/32}>
          <ColoredIndicator color={indicatorColor} />
        </Box>
        <Box width={31/32} py={3}>
          <Flex flexDirection={['column', 'row']} alignItems='center'>
            <Box width={[1, 3/5]}>
              <Flex alignItems='center'>
                <Box width={1/16}>
                  <Text bold color='gray8'>{probe_cc}</Text>
                </Box>
                <Box width={2/16}>
                  <Flag countryCode={probe_cc} size={32} />
                </Box>
                <Box width={3/16}>
                  <ASNBox asn={probe_asn} />
                </Box>
                <Box width={5/16}>
                  {moment.utc(measurement_start_time).format('YYYY-MM-DD HH:mm [UTC]')}
                </Box>
                <Box width={5/16}>
                  {testDisplayName}
                </Box>
              </Flex>
            </Box>

            <Box width={[1, 2/5]}>
              <Flex justifyContent='space-between' alignItems='center'>
                <Box>
                  {input &&
                    <ResultInput title={input}>
                      {inputLabel}
                    </ResultInput>}
                </Box>
                <Box mr={3}>
                  {tag}
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>

      </ResultRow>
    </ViewDetailsLink>
  )
}

ResultItem.propTypes = {
  test_name: PropTypes.string,
  testDisplayName: PropTypes.string,
  input: PropTypes.string,
  report_id: PropTypes.string,
  probe_cc: PropTypes.string,
  probe_asn: PropTypes.string,
  measurement_start_time: PropTypes.string,
  scores: PropTypes.object,
  confirmed: PropTypes.bool,
  anomaly: PropTypes.bool,
  failure: PropTypes.bool,
}

const ResultContainer = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray4};
  border-radius: 5px;
  overflow: hidden;
`

const ResultsList = ({results, testNamesKeyed}) => {
  return (
    <Flex>
      <ResultContainer my={4} width={1} data-test-id='results-list'>
        {results.map((msmt, idx) => {
          msmt.testDisplayName = testNamesKeyed[msmt.test_name]
          return <ResultItem key={idx} {...msmt} />
        })}
      </ResultContainer>
    </Flex>
  )
}

ResultsList.propTypes = {
  results: PropTypes.array,
  testNamesKeyed: PropTypes.object,
}

export default ResultsList
