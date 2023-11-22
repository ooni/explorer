import React, { useMemo } from 'react'
import { Chip } from '@nivo/tooltip'
import { useTheme } from '@nivo/core'
import { Box, Flex, Text, Link, theme } from 'ooni-components'
import NLink from 'next/link'
import dynamic from 'next/dynamic'

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
    const untilPlus1 = new Date(Date.parse(sinceFilter))
    untilPlus1.setUTCDate(untilPlus1.getUTCDate() + 1)
    untilFilter = untilPlus1.toISOString().split('T')[0]
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


const ReactJson = dynamic(
  () => import('react-json-view'),
  { ssr: false }
)


const formatLoNI = (data) => {
  let loni_down_map = {}
  let loni_blocked_map = {}
  Object.keys(data['loni_down_map']).forEach((orig_key) => {
    const key = orig_key.split(".").slice(0, 2).join(".")
    loni_down_map[key] = loni_down_map[key] | 0
    loni_down_map[key] += data['loni_down_map'][orig_key]
  })
  console.log(data)
  Object.keys(data['loni_blocked_map']).forEach((orig_key) => {
    const key = orig_key.split(".").slice(0, 2).join(".")
    loni_blocked_map[key] = loni_blocked_map[key] | 0
    loni_blocked_map[key] += data['loni_blocked_map'][orig_key]
  })

  return (
  <div>
    <div>observation count: {data['observation_count']}</div>
    <div>vp count: {data['vantage_point_count']}</div>
    <div>down: {data['loni_down_value']}</div>
    <div>ok: {data['loni_ok_value']}</div>
    <div>blocked: {data['loni_blocked_value']}</div>
    <div>down_map: <ReactJson collapsed={true} src={loni_down_map} name={null} indentWidth={2} /></div>
    <div>blocked_map: <ReactJson collapsed={true} src={loni_blocked_map} name={null} indentWidth={2} /></div>
  </div>
  )
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
        <Box fontSize={16}>
          {formatLoNI(data)}
        </Box>
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
