import React, { useMemo } from 'react'
import { Chip } from '@nivo/tooltip'
import { useTheme } from '@nivo/core'
import { Box, Flex, Text, Link, theme } from 'ooni-components'
import NLink from 'next/link'

import { colorMap } from './colorMap'
import { MdClear } from 'react-icons/md'
import { useIntl } from 'react-intl'
import { useMATContext } from './MATContext'

export const themeForInvisibleTooltip = {
  tooltip: {
    container: {
      boxShadow: '',
      background: ''
    }
  }
}

export const InvisibleTooltip = () => <></>

export const barThemeForTooltip = {
  tooltip: {
    container: {
      pointerEvents: 'initial',
      boxShadow: `1px 1px 4px 1px ${theme.colors.gray6}`
    }
  }
}

const urlToDomain = (url) => new URL(url).hostname

export const generateSearchQuery = (data, query) => {
  const { since, until } = query

  let sinceFilter = since
  let untilFilter = until

  // For charts with data indexed by `measurement_start_day`,
  // use that value to limit date range on `/search` page
  if ('measurement_start_day' in data) {
    sinceFilter = data.measurement_start_day
    const untilDateObj = new Date(Date.parse(sinceFilter))
    switch(query.time_grain){
      case 'hour':
        untilDateObj.setUTCHours(untilDateObj.getUTCHours() + 1)
        break
      case 'week':
        untilDateObj.setUTCDate(untilDateObj.getUTCDate() + 7)
        break
      case 'month':
        untilDateObj.setUTCMonth(untilDateObj.getUTCMonth() + 1)
        break
      default:
        untilDateObj.setUTCDate(untilDateObj.getUTCDate() + 1)
        break
    }
    untilFilter = untilDateObj.toISOString().split('.')[0] + 'Z'
  }

  const queryObj = ['probe_cc', 'test_name', 'category_code', 'probe_asn', 'input', 'domain'].reduce((q, k) => {
    if (k in data)
      q[k] = data[k]
    else if (query[k])
      q[k] = query[k]
    return q
  }, {})

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

const CustomToolTip = React.memo(({ data, onClose, title, link = true }) => {
  const theme = useTheme()
  const intl = useIntl()
  const [query] = useMATContext()
  const dataKeysToShow = ['anomaly_count', 'confirmed_count', 'failure_count', 'ok_count']

  const [linkToMeasurements, derivedTitle] = useMemo(() => {
    const searchQuery = generateSearchQuery(data, query)
    const linkObj = {
      pathname: '/search',
      query: {...searchQuery, failure: true}
    }


    const derivedTitle = title ?? `${data[query?.axis_x]} ${query?.axis_y !== '' ? ` - ${data[query.axis_y]}` : ''}`

    return [
      linkObj,
      derivedTitle,
    ]
  }, [data, query, title])

  return (
    <Flex flexDirection='column' style={{...theme.tooltip.container}}>
      <Flex my={1} fontSize={16}>
        <Text fontWeight='bolder' mr='auto'>{derivedTitle}</Text>
        <MdClear title='Close' strokeWidth={2} onClick={onClose} />
      </Flex>
      <Flex flexDirection='column' pr={3} my={1}>
        {dataKeysToShow.map(k => (
          <Box key={k} my={1} fontSize={16}>
            <Flex alignItems='center'>
              <Box mr={3}><Chip color={colorMap[k]} /></Box>
              <Text mr={4}>{intl.formatMessage({id: `MAT.Table.Header.${k}`})}</Text>
              <Text ml='auto'>{intl.formatNumber(Number(data[k] ?? 0))}</Text>
            </Flex>
          </Box>
        ))}
      </Flex>
      {link &&
        <NLink passHref href={linkToMeasurements}>
          <Link target='_blank' my={2} ml='auto' pr={3}>{intl.formatMessage({id: 'MAT.CustomTooltip.ViewMeasurements'})} &gt;</Link>
        </NLink>
      }
    </Flex>
  )
})

CustomToolTip.displayName = 'CustomTooltip'

const CustomTooltipNoLink = React.memo((props) => React.createElement(CustomToolTip, {...props, link: false }))
CustomTooltipNoLink.displayName = 'CustomTooltip'


export { CustomToolTip, CustomTooltipNoLink }
