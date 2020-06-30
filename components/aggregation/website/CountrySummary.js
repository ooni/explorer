import React, { useMemo } from 'react'
import { Flex, Box, Heading, Text, theme } from 'ooni-components'
import { VictoryChart, VictoryBar } from 'victory'
import styled from 'styled-components'
import { IoCloseCircled as Close } from 'react-icons/lib/io'
import { FaBarChart } from 'react-icons/lib/fa'

import {
  colorNormal,
  colorAnomaly,
  colorConfirmed,
  colorError,
  colorEmpty
} from '../../colors'

const BorderedBox = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray4};
  cursor: pointer;
  &:hover {
    border: 1px solid ${props => props.theme.colors.gray6};
  }
`

const CountrySummary = ({ data }) => {
  const {
    anomaly_count,
    confirmed_count,
    failure_count,
    measurement_count
  } = data

  const ok_count = measurement_count - (anomaly_count + confirmed_count + failure_count)

  let outcome = {
    color: colorNormal,
    subtext: 'not blocked',
    percent: Number(ok_count / measurement_count * 100).toFixed(0)
  }

  if (anomaly_count > ok_count) {
    outcome = {
      color: colorAnomaly,
      subtext: 'high anomaly count',
      percent: Number(anomaly_count / measurement_count * 100).toFixed(0)
    }
  }

  if (confirmed_count > ok_count) {
    outcome = {
      color: colorConfirmed,
      subtext: 'confirmed blocked',
      percent: Number(confirmed_count / measurement_count * 100).toFixed(0)
    }
  }

  return (
    <BorderedBox>
      <Flex bg={outcome.color} color='white' px={2}>
        <Box my='auto'>
          <Close size={30} color='white' />
        </Box>
        <Box ml={2}>
          <Flex flexDirection='column'>
            <Heading h={4} my={0}>
              {data.probe_cc}
            </Heading>
            <Text>
              {outcome.subtext}
            </Text>
          </Flex>
        </Box>
        <Box my='auto' ml='auto'>
          <FaBarChart size={36} />
        </Box>
      </Flex>
      <Flex justifyContent='space-between' p={2}>
        <Box width={4/5} style={{
          'word-wrap': 'break-word'
        }}>
          <p>
            {JSON.stringify(data)}
          </p>
        </Box>
        <Box>
          <Text fontSize={20} fontWeight='bold'>{outcome.percent}%</Text>
        </Box>
      </Flex>
    </BorderedBox>
  )
}

export default CountrySummary
