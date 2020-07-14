import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'ooni-components'

import {
  colorNormal,
  colorAnomaly,
  colorConfirmed,
  colorEmpty
} from '../../colors'

const BoxChart = ({
  anomaly_count,
  confirmed_count,
  failure_count,
  measurement_count
}) => {

  const ok_count = measurement_count - (anomaly_count + confirmed_count + failure_count)

  return (
    <Flex>
      <Box width={Number(ok_count / measurement_count)} bg={colorNormal}> &nbsp; </Box>
      <Box width={Number(failure_count / measurement_count)} bg={colorEmpty}> &nbsp; </Box>
      <Box width={Number(anomaly_count / measurement_count)} bg={colorAnomaly}> &nbsp; </Box>
      <Box width={Number(confirmed_count / measurement_count)} bg={colorConfirmed}> &nbsp; </Box>
    </Flex>
  )
}

BoxChart.propTypes = {
  anomaly_count: PropTypes.number,
  confirmed_count: PropTypes.number,
  failure_count: PropTypes.number,
  measurement_count: PropTypes.number,
}

export default BoxChart
