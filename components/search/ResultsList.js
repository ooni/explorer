import React from 'react'
import PropTypes from 'prop-types'
import url from 'url'
import dayjs from 'services/dayjs'
import NLink from 'next/link'
import styled from 'styled-components'
import { useIntl, defineMessages } from 'react-intl'
import {
  Flex, Box,
  Link,
  Text
} from 'ooni-components'

import { testNames } from '/components/test-info'
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
  'Search.web_connectivity.Results.Reachable': {
    id: 'General.Accessible',
    defaultMessage: ''
  },
  'Search.web_connectivity.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: ''
  },
  'Search.web_connectivity.Results.Blocked': {
    id: 'Search.WebConnectivity.Results.Blocked',
    defaultMessage: ''
  },
  'Search.web_connectivity.Results.Error': {
    id: 'General.Error',
    defaultMessage: ''
  },
  'Search.whatsapp.Results.Reachable': {
    id: 'General.Accessible',
    defaultMessage: ''
  },
  'Search.whatsapp.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: ''
  },
  'Search.whatsapp.Results.Error': {
    id: 'General.Error',
    defaultMessage: ''
  },
  'Search.facebook_messenger.Results.Reachable': {
    id: 'General.Accessible',
    defaultMessage: ''
  },
  'Search.facebook_messenger.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: ''
  },
  'Search.facebook_messenger.Results.Error': {
    id: 'General.Error',
    defaultMessage: ''
  },
  'Search.telegram.Results.Reachable': {
    id: 'General.Accessible',
    defaultMessage: ''
  },
  'Search.telegram.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: ''
  },
  'Search.telegram.Results.Error': {
    id: 'General.Error',
    defaultMessage: ''
  },
  'Search.signal.Results.Reachable': {
    id: 'General.Accessible',
    defaultMessage: ''
  },
  'Search.signal.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: ''
  },
  'Search.signal.Results.Error': {
    id: 'General.Error',
    defaultMessage: ''
  },
  'Search.http_invalid_request_line.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: ''
  },
  'Search.http_invalid_request_line.Results.Reachable': {
    id: 'General.OK',
    defaultMessage: ''
  },
  'Search.http_invalid_request_line.Results.Error': {
    id: 'General.Error',
    defaultMessage: ''
  },
  'Search.http_header_field_manipulation.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: ''
  },
  'Search.http_header_field_manipulation.Results.Reachable': {
    id: 'General.OK',
    defaultMessage: ''
  },
  'Search.http_header_field_manipulation.Results.Error': {
    id: 'General.Error',
    defaultMessage: ''
  },
  'Search.http_requests.Results.Reachable': {
    id: 'Search.HTTPRequests.Results.Reachable',
    defaultMessage: ''
  },
  'Search.http_requests.Results.Error': {
    id: 'Search.HTTPRequests.Results.Error',
    defaultMessage: ''
  },
  'Search.http_requests.Results.Blocked': {
    id: 'Search.HTTPRequests.Results.Blocked',
    defaultMessage: ''
  },
  'Search.http_requests.Results.Anomaly': {
    id: 'Search.HTTPRequests.Results.Anomaly',
    defaultMessage: ''
  },
  'Search.tor.Results.Reachable': {
    id: 'General.OK',
    defaultMessage: ''
  },
  'Search.tor.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: ''
  },
  'Search.tor.Results.Error': {
    id: 'General.Error',
    defaultMessage: ''
  },
  'Search.torsf.Results.Reachable': {
    id: 'General.OK',
    defaultMessage: 'Reachable'
  },
  'Search.torsf.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: 'Anomaly'
  },
  'Search.torsf.Results.Error': {
    id: 'General.Error',
    defaultMessage: 'Anomaly'
  },
  'Search.psiphon.Results.Reachable': {
    id: 'General.OK',
    defaultMessage: ''
  },
  'Search.psiphon.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: ''
  },
  'Search.psiphon.Results.Error': {
    id: 'General.Error',
    defaultMessage: ''
  },
  'Search.riseupvpn.Results.Reachable': {
    id: 'General.Accessible',
    defaultMessage: ''
  },
  'Search.riseupvpn.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: ''
  },
  'Search.riseupvpn.Results.Error': {
    id: 'General.Error',
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

const ViewDetailsLink = ({measurementUid, children}) => {
  let href = `/m/${measurementUid}`

  return (
    <NLink href={href}>
      <StyledViewDetailsLink href={href}>{children}</StyledViewDetailsLink>
    </NLink>
  )
}

ViewDetailsLink.propTypes = {
  measurementUid: PropTypes.string,
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

const getIndicators = ({ test_name, scores = {}, confirmed, anomaly, failure, intl }) => {
  let color = '', tag = null
  if (testsWithStates.includes(test_name)) {
    if (imTests.includes(test_name) && Object.entries(scores).length === 0) {
      return [color, tag]
    }

    const computedMessageIdPrefix = `Search.${test_name}.Results`
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
  input,
  measurement_uid,
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

  const [indicatorColor, tag] = getIndicators({test_name, scores, confirmed, anomaly, failure, intl})
  const testName = testNames[test_name]?.name || test_name

  return (
    <ViewDetailsLink measurementUid={measurement_uid}>
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
                  {dayjs.utc(measurement_start_time).format('YYYY-MM-DD HH:mm [UTC]')}
                </Box>
                <Box width={5/16}>
                  {testName}
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
  input: PropTypes.string,
  measurement_uid: PropTypes.string,
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

const ResultsList = ({ results }) => {
  return (
    <Flex>
      <ResultContainer width={1} data-test-id='results-list'>
        {results.map((msmt, idx) => {
          return <ResultItem key={idx} {...msmt} />
        })}
      </ResultContainer>
    </Flex>
  )
}

ResultsList.propTypes = {
  results: PropTypes.array,
}

export default ResultsList
