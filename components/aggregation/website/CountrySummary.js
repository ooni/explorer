import React, { useMemo } from 'react'
import { Flex, Box, Heading, Text, Link } from 'ooni-components'
import styled from 'styled-components'
import { IoCloseCircled } from 'react-icons/lib/io'
import { FaBarChart, FaExclamationCircle } from 'react-icons/lib/fa'
import { MdCheckCircle } from 'react-icons/lib/md'
import NLink from 'next/link'
import { useRouter } from 'next/router'

import {
  colorNormal,
  colorAnomaly,
  colorConfirmed,
} from '../../colors'
import BoxChart from './BoxChart'
import { paramsToQuery } from '../../../components/aggregation/website/queryUtils'

const ICON_SIZE = 30

const BorderedBox = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray4};
`

const CountrySummary = ({ data }) => {
  const {
    anomaly_count,
    confirmed_count,
    failure_count,
    measurement_count,
    probe_cc
  } = data

  const ok_count = measurement_count - (anomaly_count + confirmed_count + failure_count)

  let outcome = {
    color: colorNormal,
    subtext: 'not blocked',
    percent: Number(ok_count / measurement_count * 100).toFixed(0),
    icon: <MdCheckCircle size={ICON_SIZE} />
  }

  if (anomaly_count > ok_count) {
    outcome = {
      color: colorAnomaly,
      subtext: 'high anomaly count',
      percent: Number(anomaly_count / measurement_count * 100).toFixed(0),
      icon: <FaExclamationCircle size={ICON_SIZE} />
    }
  }

  if (confirmed_count > ok_count) {
    outcome = {
      color: colorConfirmed,
      subtext: 'confirmed blocked',
      percent: Number(confirmed_count / measurement_count * 100).toFixed(0),
      icon: <IoCloseCircled size={ICON_SIZE} />
    }
  }

  const router = useRouter()
  const paramsForCountryLink = Object.assign({}, router.query, { probe_cc: probe_cc})
  const query = paramsToQuery(paramsForCountryLink)

  return (
    <BorderedBox>
      <Flex bg={outcome.color} color='white' p={2}>
        <Box my='auto'>
          {outcome.icon}
        </Box>
        <Box ml={2}>
          <Flex flexDirection='column'>
            <Heading h={4} my={0}>
              {probe_cc}
            </Heading>
            <Text>
              {outcome.subtext}
            </Text>
          </Flex>
        </Box>
        <Box my='auto' ml='auto'>
          <NLink href={`/experimental/website/${probe_cc}?${query}`} passHref>
            <Link color='white'>
              <FaBarChart size={36} />
            </Link>
          </NLink>
        </Box>
      </Flex>
      <Flex justifyContent='space-between' p={2} alignItems='center' px={3}>
        <Box width={4/5} style={{
          'wordWrap': 'break-word'
        }}>
          <BoxChart
            anomaly_count={anomaly_count}
            confirmed_count={confirmed_count}
            failure_count={failure_count}
            measurement_count={measurement_count}
          />
        </Box>
        <Box>
          <Text fontSize={3} fontWeight='bold'>{outcome.percent}%</Text>
        </Box>
      </Flex>
    </BorderedBox>
  )
}

export default CountrySummary
