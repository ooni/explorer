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
    const untilPlus1 = new Date(Date.parse(sinceFilter))
    untilPlus1.setUTCDate(untilPlus1.getUTCDate() + 1)
    untilFilter = untilPlus1.toISOString().split('T')[0]
  }

  const queryObj = [
    'probe_cc',
    'test_name',
    'category_code',
    'probe_asn',
    'input',
    'domain',
    'only',
    'failure'].reduce((q, k) => {
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

const getDataKeyLink = (data, matQuery, keyQuery) => {
  const mergeQuery = {...matQuery, ...keyQuery}
  const query = generateSearchQuery(data, mergeQuery)
  
  return {
    pathname: '/search',
    query
  }
}

const CustomToolTip = React.memo(({ data, onClose, title, link = true }) => {
  const theme = useTheme()
  const intl = useIntl()
  const [query] = useMATContext()

  const dataKeysToShow = useMemo(() => {
    return {
      'anomaly_count': getDataKeyLink(data, query, {only: 'anomalies'}),
      'confirmed_count': getDataKeyLink(data, query, {only: 'confirmed'}),
      'failure_count': getDataKeyLink(data, query, {failure: true}),
      'ok_count': getDataKeyLink(data, query)
    }
  }, [data, query])
  
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
        {Object.entries(dataKeysToShow).map(([k, v]) => (
          <Box key={k} my={1} fontSize={16}>
            <Flex alignItems='center'>
              <Box mr={3}><Chip color={colorMap[k]} /></Box>
              <NLink passHref href={v}>
                <Link target='_blank'>
                  <Text mr={4}>{k}</Text>
                </Link>
              </NLink>
                <Text ml='auto'>{intl.formatNumber(Number(data[k] ?? 0))}</Text>
            </Flex>
          </Box>
        ))}
      </Flex>
      {link &&
        <NLink passHref href={linkToMeasurements}>
          <Link target='_blank' my={2} ml='auto' pr={3}>view measurements &gt;</Link>
        </NLink>
      }
    </Flex>
  )
})

CustomToolTip.displayName = 'CustomTooltip'

const CustomTooltipNoLink = React.memo((props) => React.createElement(CustomToolTip, {...props, link: false }))
CustomTooltipNoLink.displayName = 'CustomTooltip'


export { CustomToolTip, CustomTooltipNoLink }
