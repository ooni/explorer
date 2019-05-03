import React from 'react'
import PropTypes from 'prop-types'

import url from 'url'
import moment from 'moment'

import NLink from 'next/link'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import {
  Flex, Box,
  Link,
  Text,
  Divider
} from 'ooni-components'

import {
  colorNormal,
  colorError,
  colorConfirmed,
  colorAnomaly
} from '../colors'

import Flag from '../flag'

const StyledResultTag = styled.div`
  border-radius: 16px;
  padding: 8px 16px;
  height: 32px;
  line-height: 1;
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
  'whatsapp',
  'facebook_messenger',
  'telegram',
  'http_header_field_manipulation',
  'http_invalid_request_line'
]

const ResultTag = ({msmt}) => {
  if (testsWithStates.indexOf(msmt.test_name) > -1) {
    const testName = msmt.testName.replace(/ /gi, '')
    const computedMessageIdPrefix = `Search.${testName}.Results`
    if (msmt.confirmed === true) {
      return <ResultTagFilled>
        <FormattedMessage id={`${computedMessageIdPrefix}.Blocked`} />
      </ResultTagFilled>
    } else if (msmt.failure === true) {
      return <StyledResultTag>
        <FormattedMessage id={`${computedMessageIdPrefix}.Error`} />
      </StyledResultTag>
    } else if (msmt.anomaly === true) {
      return <ResultTagHollow>
        <FormattedMessage id={`${computedMessageIdPrefix}.Anomaly`} />
      </ResultTagHollow>
    } else {
      return <StyledResultTag>
        <FormattedMessage id={`${computedMessageIdPrefix}.Reachable`} />
      </StyledResultTag>
    }
  } else {
    return null
  }
}


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
    href += `?input=${input}`
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
}

const StyledColorCode = styled.div`
  height: 100%;
  width: 5px;
  margin-right: 10px;
`

const ColorCodeConfirmed = styled(StyledColorCode)`
  background-color: ${colorConfirmed};
`
const ColorCodeAnomaly = styled(StyledColorCode)`
  background-color: ${colorAnomaly};
`
const ColorCodeNormal = styled(StyledColorCode)`
  background-color: ${colorNormal};
`
const ColorCodeFailed = styled(StyledColorCode)`
  background-color: ${colorError};
`
// For tests without a result
const NoColorCode = styled(StyledColorCode)``

const ColorCode = ({msmt}) => {
  if (testsWithStates.indexOf(msmt.test_name) > -1) {
    if (msmt.confirmed === true) {
      return <ColorCodeConfirmed />
    } else if (msmt.failure === true) {
      return <ColorCodeFailed />
    } else if (msmt.anomaly === true) {
      return <ColorCodeAnomaly />
    }
    return <ColorCodeNormal />
  } else {
    return <NoColorCode />
  }
}

ColorCode.propTypes = {
  msmt: PropTypes.object
}

const ResultRow = styled(Flex)`
  color: ${props => props.theme.colors.gray7};
  background-color: #ffffff;
  &:hover {
    background-color: ${props => props.theme.colors.gray0};
  }
  border-bottom: 1px solid ${props => props.theme.colors.gray4};
  cursor: pointer;
`
const HTTPSPrefix = styled.span`
  color: ${props => props.theme.colors.green8};
`
const Hostname = styled.span`
  color: ${props => props.theme.colors.black};
`

const ResultInput = styled.div`
  color: ${props => props.theme.colors.gray5};
`

const ResultItem = ({msmt}) => {
  const pathMaxLen = 10
  let input = msmt.input
  if (input) {
    const p = url.parse(input)
    let path = p.path
    if (path && path.length > pathMaxLen) {
      path = `${path.substr(0, pathMaxLen)}…`
    }
    if (p.protocol && p.protocol === 'http:') {
      input = <span><Hostname>{p.host}</Hostname>{path}</span>
    } else if (p.protocol && p.protocol === 'https:') {
      input = <span><HTTPSPrefix>https</HTTPSPrefix>{'://'}<Hostname>{p.host}</Hostname>{path}</span>
    }
  }
  return (
    <ViewDetailsLink reportId={msmt.report_id} input={msmt.input}>
      <ResultRow flexWrap='wrap' alignItems='stretch'>
        <Box width={1/32}>
          <ColorCode msmt={msmt} />
        </Box>
        <Box width={31/32} py={3}>
          <Flex flexDirection={['column', 'row']}>
            <Box width={[1, 3/5]}>
              <Flex alignItems='center'>
                <Box width={1/16}>
                  <Text bold color='gray8'>{msmt.probe_cc}</Text>
                </Box>
                <Box width={2/16}>
                  <Flag countryCode={msmt.probe_cc} size={32} />
                </Box>
                <Box width={3/16}>
                  <ASNBox asn={msmt.probe_asn} />
                </Box>
                <Box width={4/16}>
                  {moment(msmt.measurement_start_time).format('YYYY-MM-DD')}
                </Box>
                <Box width={6/16}>
                  {msmt.testName}
                </Box>
              </Flex>
            </Box>

            <Box width={[1, 2/5]}>
              <Flex justifyContent='space-between' alignItems='center'>
                <Box>
                  {input &&
                    <ResultInput>
                      {input}
                    </ResultInput>}
                </Box>
                <Box>
                  <ResultTag msmt={msmt} />
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
  msmt: PropTypes.object
}

const LegendColorBox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color};
  float: left;
  margin-right: 10px;
`

const StyledLegendItem = styled.div`
  float: left;
  margin-right: 20px;
`

const LegendItem = ({color, children}) => {
  return <StyledLegendItem>
    <LegendColorBox color={color}/> {children}
  </StyledLegendItem>
}

const LegendContainer = styled(Box)`
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 10px;
`

const ResultContainer = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray4};
  border-radius: 5px;
  overflow: hidden;
`

const ResultsList = ({results, testNamesKeyed}) => {
  return (
    <Flex flexWrap='wrap'>
      <LegendContainer>
        <LegendItem color={colorNormal}>
          <FormattedMessage id='Search.Bullet.Reachable' />
        </LegendItem>
        <LegendItem color={colorAnomaly}>
          <FormattedMessage id='Search.Bullet.Anomaly' />
        </LegendItem>
        <LegendItem color={colorConfirmed}>
          <FormattedMessage id='Search.Bullet.Blocked' />
        </LegendItem>
        <LegendItem color={colorError}>
          <FormattedMessage id='Search.Bullet.Error' />
        </LegendItem>
      </LegendContainer>
      <ResultContainer my={4} width={1}>
        {results.map((msmt, idx) => {
          msmt.testName = testNamesKeyed[msmt.test_name]
          return <ResultItem key={idx} msmt={msmt} />
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
