import React from 'react'
import PropTypes from 'prop-types'

import url from 'url'
import moment from 'moment'

import NLink from 'next/link'
import styled from 'styled-components'

import {
  Flex, Box,
  Divider,
  Link
} from 'ooni-components'

import Flag from '../flag'

const StyledResultTag = styled.div`
  margin-top: -4px;
  border-radius: 16px;
  padding: 8px 16px;
  height: 32px;
  line-height: 1;
  font-size: 16px;
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

const ResultTag = ({msmt}) => {
  if (msmt.confirmed === true) {
    return <ResultTagFilled>
      Confirmed
    </ResultTagFilled>
  //} else if (msmt.failure === true) {
  //  return <StyledResultTag>
  //    Failure
  //  </StyledResultTag>
  } else if (msmt.anomaly === true) {
    return <ResultTagHollow>
      Anomaly
    </ResultTagHollow>
  } else {
    return <StyledResultTag>Normal</StyledResultTag>
  }
}


const ASNBox = ({asn}) => {
  const justNumber = asn.split('AS')[1]
  return <Flex column>
    <Box>ASN</Box>
    <Box>{justNumber}</Box>
  </Flex>
}

ASNBox.propTypes = {
  asn: PropTypes.string
}

// XXX add this to the design system
const StyledViewDetailsLink = styled(Link)`
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.blue9};
  }
`

const ViewDetailsLink = ({reportId, input}) => {
  let href = `/measurement?report_id=${reportId}`
  if (input) {
    href += `&input=${input}`
  }
  return (
    <NLink href={href}>
      <StyledViewDetailsLink href={href}>View details</StyledViewDetailsLink>
    </NLink>
  )
}

ViewDetailsLink.propTypes = {
  reportId: PropTypes.string,
  input: PropTypes.string,
}

const StyledColorCode = styled.div`
  height: 80px;
  width: 5px;
  margin-right: 10px;
`

/*
const ColorCodeFailed = styled(StyledColorCode)`
  background-color: ${props => props.theme.colors.orange4};
`
*/

const ColorCodeConfirmed = styled(StyledColorCode)`
  background-color: ${props => props.theme.colors.pink5};
`
const ColorCodeAnomaly = styled(StyledColorCode)`
  background-color: ${props => props.theme.colors.yellow3};
`
const ColorCodeNormal = styled(StyledColorCode)`
  background-color: ${props => props.theme.colors.cyan3};
`

const ColorCode = ({msmt}) => {
  if (msmt.confirmed === true) {
    return <ColorCodeConfirmed />
  //} else if (msmt.failure === true) {
  //  return <ColorCodeFailed />
  } else if (msmt.anomaly === true) {
    return <ColorCodeAnomaly />
  }
  return <ColorCodeNormal />
}

ColorCode.propTypes = {
  msmt: PropTypes.object
}

const ResultRow = styled(Flex)`
  color: ${props => props.theme.colors.gray6};
`
const HTTPSPrefix = styled.span`
  color: ${props => props.theme.colors.green8};
`
const Hostname = styled.span`
  color: ${props => props.theme.colors.black};
`

const ResultInput = styled.div`
  font-size: 16px;
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
    <ResultRow align='center' justify='center'>
      <Box w={1/3}>
        <Flex align='center' justify='center'>
          <Box>
            <ColorCode msmt={msmt} />
          </Box>
          <Box flex='auto'>
            {msmt.probe_cc}
          </Box>
          <Box flex='1 1 auto'>
            <Flag countryCode={msmt.probe_cc} />
          </Box>
          <Box flex='1 1 auto'>
            <ASNBox asn={msmt.probe_asn} />
          </Box>
        </Flex>
      </Box>
      <Box w={2/3}>
        <Flex column>
          <Box>
            {input &&
        <ResultInput>
          {input}
        </ResultInput>}
          </Box>
          <Box>
            <Flex>
              <Box pr={2} w={2/5}>
                {msmt.testName}
              </Box>
              <Box w={1/5}>
                {moment(msmt.measurement_start_time).format('YYYY-MM-DD')}
              </Box>
              <Box w={1/5}>
                <ResultTag msmt={msmt} />
              </Box>
              <Box w={1/5}>
                <ViewDetailsLink reportId={msmt.report_id} input={msmt.input} />
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </ResultRow>
  )
}

ResultItem.propTypes = {
  msmt: PropTypes.object
}

const ResultTable = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  margin: 8px;
  line-height: 1.5;
`

const ResultsList = ({measurements, testNamesKeyed}) => {
  return (
    <ResultTable>
      {measurements.results.map((msmt, idx) => {

        msmt.testName = testNamesKeyed[msmt.test_name]
        return <div key={idx}>
          <Divider />
          <ResultItem msmt={msmt} />
        </div>
      })}
    </ResultTable>
  )
}

ResultsList.propTypes = {
  measurements: PropTypes.array,
  testNamesKeyed: PropTypes.object,
}

export default ResultsList
