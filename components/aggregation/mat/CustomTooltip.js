import React from 'react'
import { Chip } from '@nivo/tooltip'
import { useTheme } from '@nivo/core'
import { Box, Flex, Text, Link } from 'ooni-components'
import NLink from 'next/link'

import { colorMap } from './colorMap'
import { MdClear } from 'react-icons/md'

const CustomToolTip = React.memo(({ data, onClose }) => {
  const theme = useTheme()
  const dataKeysToShow = ['anomaly_count', 'confirmed_count', 'failure_count', 'ok_count']
  
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
      <Link my={2} ml='auto' pr={3}><NLink href='/search'>view measurements &gt;</NLink></Link>
    </Flex>
  )
})

CustomToolTip.displayName = 'CustomTooltip'

export { CustomToolTip }