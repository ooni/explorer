import React, { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'
import { Box, Flex, Link } from 'ooni-components'
import { IoMdGlobe } from 'react-icons/io'
import NLink from 'next/link'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import { colorMap } from './colorMap'
import { generateSearchQuery, CustomTooltipNoLink} from './CustomTooltip'
import { getXAxisTicks } from './timeScaleXAxis'
import { fillRowHoles } from './computations'
import { ChartHeader } from './ChartHeader'
import GridChart, { prepareDataForGridChart } from './GridChart'

const ChartContainer = styled(Flex)`
  position: relative;
  border: 2px solid ${props => props.theme.colors.gray1};
  padding: 16px;
`

const colorFunc = (d) => colorMap[d.id] || '#ccc'

// const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
// const formatDay = d3.timeFormat("%Y-%m-%d")

export const StackedBarChart = ({ data, query }) => {
  const intl = useIntl()
  const [link, setLink] = useState(false)

  const onClick = useCallback(({ data }) => {
    const searchQuery = generateSearchQuery(data, query)
    const queryString = new URLSearchParams(searchQuery).toString()
    const linkLabel = `Show ${query.test_name} measurements for ${data[query.axis_x]} (${intl.formatNumber(data.measurement_count)})`
    setLink(<NLink href={`/search?${queryString}`} passHref><Link> {linkLabel} </Link></NLink>)
  }, [intl, query])

  const chartMeta = useMemo(() => {
    // TODO Move charting related transformations to Charts.js
    if (data) {
      const cols = [
        'anomaly_count',
        'confirmed_count',
        'failure_count',
        'ok_count',
      ]
      let indexBy = query.axis_x ?? ''

      const dataReceived = Array.isArray(data.data.result) ? data.data.result : []
      const dataWithNoHoles = fillRowHoles(dataReceived, query)

      const xAxisTicks = getXAxisTicks(query, 30)

      return {
        data: dataWithNoHoles,
        url: data.url,
        loadTime: data.loadTime,
        cols,
        indexBy,
        xAxisTicks
      }
    } else {
      return null
    }
  }, [data, query])

  if (chartMeta === null) {
    return (<div />)
  }

  const [gridData, rows ] = prepareDataForGridChart(chartMeta.data, query)

  return (
    <ChartContainer flexDirection={['column']}>
      <GridChart
        data={gridData}
        rowKeys={rows}
        rowLabels={[undefined]}
        height={500}
        noLabels={true}
      />
    </ChartContainer>
  )
}

StackedBarChart.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.shape({
      dimension_count: PropTypes.number,
      result: PropTypes.array,
    }),
    loadTime: PropTypes.number,
    url: PropTypes.string
  }),
  query: PropTypes.object
}
