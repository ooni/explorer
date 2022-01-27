import React, { useMemo } from 'react'
import { Chip } from '@nivo/tooltip'
import { useTheme } from '@nivo/core'
import { Box, Flex, Text, Link } from 'ooni-components'
import NLink from 'next/link'

import { colorMap } from './colorMap'
import { MdClear } from 'react-icons/md'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'


const urlToDomain = (url) => new URL(url).hostname

export const generateSearchQuery = (data, query) => {
  const { since, until, axis_x, axis_y } = query

  let sinceFilter = since
  let untilFilter = until

  if ('measurement_start_day' in data) {
    sinceFilter = data.measurement_start_day
    const untilPlus1 = new Date(Date.parse(sinceFilter))
    untilPlus1.setUTCDate(untilPlus1.getUTCDate() + 1)
    untilFilter = untilPlus1.toISOString().split('T')[0]
  }

  const queryObj = ['probe_cc', 'test_name', 'category_code', 'probe_asn', 'input'].reduce((q, k) => {
    if (k in data)
      q[k] = data[k]
    else if (k in query)
      q[k] = query[k]
    return q
  }, {})
  if (axis_y === 'input') {
    queryObj.input = urlToDomain(data.input)
  }

  // Filter for anomalies if blocking_type is set
  const isBlockingType = Object.values(query).includes('blocking_type') && 'blocking_type' in data
  if (isBlockingType) {
    queryObj.only = 'anomalies'
  }


  return {
    since: sinceFilter,
    until: untilFilter,
    ...queryObj,
  }
}

const CustomToolTip = React.memo(({ data, onClose, link = true }) => {
  const theme = useTheme()
  const intl = useIntl()
  const { query } = useRouter()
  const dataKeysToShow = ['anomaly_count', 'confirmed_count', 'failure_count', 'ok_count']

  const [linkToMeasurements, title] = useMemo(() => {
    const searchQuery = generateSearchQuery(data, query)
    const linkObj = {
      pathname: '/search',
      query: searchQuery
    }


    const title = `${data[query.axis_x]} ${'axis_y' in query ? ` - ${data[query.axis_y]}` : ''}`

    return [
      linkObj,
      title,
    ]
  }, [data, query])
  
  return (
    <Flex flexDirection='column' style={{...theme.tooltip.container}}>
      <Flex my={1} fontSize={16}>
        <Text fontWeight='bolder' mr='auto'>{title}</Text>
        <MdClear title='Close' strokeWidth={2} onClick={onClose} />
      </Flex>
      <Flex flexDirection='column' pr={3} my={1}>
        {dataKeysToShow.map(k => (
          <Box key={k} my={1} fontSize={16}>
            <Flex alignItems='center'>
              <Box mr={3}><Chip color={colorMap[k]} /></Box>
              <Text mr={4}>{k}</Text>
              <Text ml='auto'>{intl.formatNumber(data[k])}</Text>
            </Flex>
          </Box>
        ))}
      </Flex>
      {link && <NLink passHref href={linkToMeasurements}><Link my={2} ml='auto' pr={3}>view measurements &gt;</Link></NLink>}
    </Flex>
  )
})

CustomToolTip.displayName = 'CustomTooltip'

const CustomTooltipNoLink = React.memo((props) => React.createElement(CustomToolTip, {...props, link: false }))
CustomTooltipNoLink.displayName = 'CustomTooltip'


export { CustomToolTip, CustomTooltipNoLink }