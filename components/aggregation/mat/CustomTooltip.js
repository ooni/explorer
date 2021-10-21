import React, { useMemo } from 'react'
import { Chip } from '@nivo/tooltip'
import { useTheme } from '@nivo/core'
import { Box, Flex, Text, Link } from 'ooni-components'
import NLink from 'next/link'

import { colorMap } from './colorMap'
import { MdClear } from 'react-icons/md'
import { useRouter } from 'next/router'


const urlToDomain = (url) => new URL(url).hostname

const CustomToolTip = React.memo(({ data, onClose }) => {
  const theme = useTheme()
  const { query: { probe_cc, axis_y } } = useRouter()
  const dataKeysToShow = ['anomaly_count', 'confirmed_count', 'failure_count', 'ok_count']

  const linkToMeasurements = useMemo(() => {

    const untilDate = new Date(Date.parse(data.measurement_start_day))
    const untilPlus1 = new Date(untilDate)
    untilPlus1.setUTCDate(untilDate.getUTCDate() + 1)
    const nextDay = untilPlus1.toISOString().split('T')[0]

    const yAxisFilter = axis_y === 'input' ? (
      { domain: urlToDomain(data[axis_y]) }
    ) : (
      { [axis_y]: data[axis_y] }
    )

    let urlObj = {
      pathname: '/search',
      query: {
        probe_cc,
        test_name: 'web_connectivity',
        since: data.measurement_start_day,
        until: nextDay,
        ...yAxisFilter
      }
    }
    return urlObj
  }, [axis_y, data, probe_cc])
  
  return (
    <Flex flexDirection='column' style={theme.tooltip.container}>
      <Flex my={1} fontSize={16}>
        <Text fontWeight='bolder' mr='auto'>{data.measurement_start_day}</Text>
        <MdClear title='Close' strokeWidth={2} onClick={onClose} />
      </Flex>
      <Flex flexDirection='column' pr={3} my={1}>
        {dataKeysToShow.map(k => (
          <Box key={k} my={1} fontSize={16}>
            <Flex alignItems='center'>
              <Box mr={3}><Chip color={colorMap[k]} /></Box>
              <Text mr={4}>{k}</Text>
              <Text ml='auto'>{data[k]}</Text>
            </Flex>
          </Box>
        ))}
      </Flex>
      <NLink passHref href={linkToMeasurements}><Link my={2} ml='auto' pr={3}>view measurements &gt;</Link></NLink>
    </Flex>
  )
})

CustomToolTip.displayName = 'CustomTooltip'

export { CustomToolTip }