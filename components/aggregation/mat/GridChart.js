import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'
import { Heading, Flex, Box, Text } from 'ooni-components'
import OONILogo from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochrome.svg'

import RowChart, { chartMargins } from './RowChart'
import { useDebugContext } from '../DebugContext'
import { defaultRangeExtractor, useVirtual } from 'react-virtual'
import { fillDataInMissingDates, getDatesBetween } from './computations'
import { getXAxisTicks } from './timeScaleXAxis'
import { useMATContext } from './MATContext'
import { ChartHeader } from './ChartHeader'
import { getRowLabel } from './labels'
import { VirtualRows } from './VirtualRows'

const ROW_HEIGHT = 70
const GRID_MAX_HEIGHT = 600

const reshapeChartData = (data, query, isGrouped) => {
  const rows = []
  const rowLabels = {}
  let reshapedData = {}

  const t0 = performance.now()

  // Flat arrays need to be converted to collection grouped by `axis_y`
  if (isGrouped) {
    reshapedData = data.reduce((d, groupedRow, i) => {
      rows.push(groupedRow.groupByVal)
      rowLabels[groupedRow.groupByVal] = groupedRow.leafRows[0].original.rowLabel
      return {...d, [groupedRow.groupByVal]: groupedRow.leafRows.map(r => r.original)}
    }, {})
  } else {
    data.forEach((item) => {
      const key = item[query.axis_y]
      if (key in reshapedData) {
        reshapedData[key].push(item)
      } else {
        rows.push(key)
        reshapedData[key] = [item]
        rowLabels[key] = getRowLabel(key, query.axis_y)
      }
    })
  }

  const t1 = performance.now()

  let reshapedDataWithoutHoles = {}

  // 3. If x-axis is `measurement_start_day`, fill with zero values where there is no data
  if (query.axis_x === 'measurement_start_day') {
    const dateSet = getDatesBetween(new Date(query.since), new Date(query.until))

    // Object transformation, works like Array.map
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries#object_transformations
    reshapedDataWithoutHoles = Object.fromEntries(
      Object.entries(reshapedData)
        .map(([ key, rowData ]) => [ key, fillDataInMissingDates(rowData, query.since, query.until, dateSet) ])
    )
  } else {
    reshapedDataWithoutHoles = reshapedData
  }
  const t2 = performance.now()
  console.debug(`ReshapeChartData: Step 2 took: ${(t2-t1)}ms` )
  return [reshapedDataWithoutHoles, rows, rowLabels]
}


const GridChart = ({ data, isGrouped = true, height = 'auto' }) => {
  // development-only flags for debugging/tweaking etc
  const { doneChartReshaping } = useDebugContext()

  const [ query ] = useMATContext()
  const { tooltipIndex } = query

  const itemData = useMemo(() => {
    const t0 = performance.now()
    const [reshapedData, rows, rowLabels] = reshapeChartData(data, query, isGrouped)
    
    let gridHeight = height
    if (height === 'auto') {
      gridHeight = Math.min( 20 + (rows.length * ROW_HEIGHT), GRID_MAX_HEIGHT)
    }
    
    const t1 = performance.now()
    console.debug(`Charts reshaping: ${t1} - ${t0} = ${t1-t0}ms`)
    doneChartReshaping(t0, t1)
    return {reshapedData, rows, rowLabels, gridHeight, indexBy: query.axis_x, yAxis: query.axis_y }
  }, [data, doneChartReshaping, height, isGrouped, query])

  const xAxisTickValues = getXAxisTicks(query.since, query.until, 30)

  const xAxisData = itemData.reshapedData[itemData.rows[0]]
  const xAxisMargins = {...chartMargins, top: 60, bottom: 0}
  const axisTop = {
    enable: true,
    tickSize: 5,
    tickPadding: 5,
    tickRotation: -45,
    tickValues: xAxisTickValues
  }

  const {reshapedData, rows, rowLabels, gridHeight, indexBy, yAxis } = itemData

  if (data.length < 1) {
    return (
      <Flex flexDirection='column' justifyContent='center' sx={{ height: '100%' }}>
        <Heading h={5}> No enough data for charts </Heading>
        <Heading h={6}> Check browser console to inspect received data.</Heading>
      </Flex>
    )
  }

  return (
    <Flex flexDirection='column' sx={{ position: 'relative' }}>
      <Box alignSelf='flex-end' sx={{ position: 'absolute', opacity: 0.8, top: 16, left: 16 }}>
        <OONILogo height='32px' />
      </Box>
      <Flex flexDirection='column'>
        {/* Fake axis on top of list. Possible alternative: dummy chart with axis and valid tickValues */}
        <Flex justifyContent={'center'}>
          <Box width={2/16}>
          </Box>
          <ChartHeader />

        </Flex>
        <Flex>
          <Box width={2/16}>
          </Box>
          <Box className='xAxis' sx={{ width: '100%', height: '62px' }}>
            <ResponsiveBar
              data={xAxisData}
              indexBy={query.axis_x}
              margin={xAxisMargins}
              padding={0.3}
              layers={['axes']}
              axisTop={axisTop}
              axisBottom={null}
              axisLeft={null}
              axisRight={null}
              animate={false}
            />
          </Box>
        </Flex>
        <VirtualRows
          itemData={itemData}
          tooltipIndex={tooltipIndex}
        />
      </Flex>
    </Flex>
  )
}

GridChart.propTypes = {
  data: PropTypes.array,
  query: PropTypes.object
}

export default React.memo(GridChart)
