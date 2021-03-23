import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'ooni-components'
import { StatefulToolTip } from 'react-portal-tooltip'
import styled from 'styled-components'

import {
  colorNormal,
  colorAnomaly,
  colorConfirmed,
  colorEmpty
} from '../../colors'

const LegendBox = styled(Box)`
  height: 16px;
  width: 16px;
`

const TooltipRow = ({ color, label, value }) => (
  <Flex flexWrap='nowrap' m={2}>
    <LegendBox bg={color} />
    <Box mx={2}>{label}</Box>
    <Box ml='auto'>{value}</Box>
  </Flex>
)

TooltipRow.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.number
}

const BoxChart = ({
  anomaly_count,
  confirmed_count,
  failure_count,
  measurement_count,
}) => {

  const ok_count = measurement_count - (anomaly_count + confirmed_count + failure_count)

  const chartWithBoxes = (
    <Flex flexWrap='nowrap' my={3} fontSize={3}>
      <Box width={Number(ok_count / measurement_count)} bg={colorNormal}> &nbsp; </Box>
      <Box width={Number(failure_count / measurement_count)} bg={colorEmpty}> &nbsp; </Box>
      <Box width={Number(anomaly_count / measurement_count)} bg={colorAnomaly}> &nbsp; </Box>
      <Box width={Number(confirmed_count / measurement_count)} bg={colorConfirmed}> &nbsp; </Box>
    </Flex>
  )

  return (
    <StatefulToolTip parent={chartWithBoxes} position='bottom' arrow='center'>
      <Flex flexDirection='column'>
        <TooltipRow color={colorNormal} label='ok count' value={ok_count} />
        <TooltipRow color={colorEmpty} label='failure count' value={failure_count} />
        <TooltipRow color={colorAnomaly} label='anomaly count' value={anomaly_count} />
        <TooltipRow color={colorConfirmed} label='confirmed count' value={confirmed_count} />
      </Flex>
    </StatefulToolTip>
  )
}

BoxChart.propTypes = {
  anomaly_count: PropTypes.number,
  confirmed_count: PropTypes.number,
  failure_count: PropTypes.number,
  measurement_count: PropTypes.number,
}

export default BoxChart
