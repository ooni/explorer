import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'
import { Heading, Flex, Box, Text } from 'ooni-components'
import OONILogo from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochrome.svg'

import RowChart, { chartMargins } from './RowChart'
import { fillDataHoles } from './computations'
import { getXAxisTicks } from './timeScaleXAxis'
import { useMATContext } from './MATContext'
import { ChartHeader } from './ChartHeader'
import { getRowLabel } from './labels'
import { VirtualRows } from './VirtualRows'

const ROW_HEIGHT = 70
const GRID_MAX_HEIGHT = 600

/** Transforms data received by GridChart into an collection of arrays each of
 * which is used to generate a RowChart
 * {
 *  "YAxisValue1": [{}, {},...],
 *  "YAxisValue2": [{}, {},...],
 *  ...
 * }
 *
 * Each item in array looks like this:
 * {
    "anomaly_count": 4999,
    "category_code": "HUMR",
    "confirmed_count": 528,
    "failure_count": 1093,
    "measurement_count": 122795,
    "measurement_start_day": "2022-02-26",
    "ok_count": 116175,
    "rowLabel": "Human Rights Issues"
   }
 *
*/

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

  let reshapedDataWithoutHoles = fillDataHoles(reshapedData, query)


  const t2 = performance.now()
  console.debug(`ReshapeChartData: Step 2 took: ${(t2-t1)}ms` )
  return [reshapedDataWithoutHoles, rows, rowLabels]
}

/**
 * Renders the collection of RowCharts. This is either passed down from
 * TableView or from other components like `<Chart>` (`components/dashboard/Charts.js`)
 *
 * data - This is either an array of data points as received from the API response
 * or an array containing groups of data points produced as a result of using
 * `useGroupBy` in `useTable()` in `TableView`
 *
 * isGrouped - Whether the data is already grouped by y-axis value
 * If `false`, `reshapeChartData()` will group the data as required
 *
 * height - uses a specific height provided by the container (e.g ResizableBox)
 * If not speicied, it calculates a height based on the number of rows, capped
 * at GRID_MAX_HEIGHT, which allows <VirtualRows> to render a subset of the data
 * at a time.
 *
 * header - an element showing some summary information on top of the charts
}
*/
const GridChart = ({ data, isGrouped = true, height = 'auto', header }) => {
  // Fetch query state from context instead of router
  // because some params not present in the URL are injected in the context
  const [ query ] = useMATContext()
  const { tooltipIndex } = query
  
  const itemData = useMemo(() => {
    const [reshapedData, rows, rowLabels] = reshapeChartData(data, query, isGrouped)
    
    let gridHeight = height
    if (height === 'auto') {
      gridHeight = Math.min( 20 + (rows.length * ROW_HEIGHT), GRID_MAX_HEIGHT)
    }
    
    return {reshapedData, rows, rowLabels, gridHeight, indexBy: query.axis_x, yAxis: query.axis_y }
  }, [data, height, isGrouped, query])

  const xAxisTickValues = getXAxisTicks(query, 30)

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
      <Flex flexDirection='column'>
        <ChartHeader options={header} />
        {/* Fake axis on top of list. Possible alternative: dummy chart with axis and valid tickValues */}
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
        {/* Use a virtual list only for higher count of rows */}
        {rows.length < 10 ? (
          <Flex
            className='outerListElement'
            flexDirection='column'
            style={{
              height: gridHeight
            }}
          >
            {rows.map((row, index) => 
              <RowChart
                key={row}
                rowIndex={index}
                data={reshapedData[row]}
                indexBy={indexBy}
                height={70}
                label={rowLabels[row]}
              />
            )}
          </Flex>
        ) : (
          <VirtualRows
            itemData={itemData}
            tooltipIndex={tooltipIndex}
          />
        )}
      </Flex>
    </Flex>
  )
}

GridChart.propTypes = {
  data: PropTypes.array.isRequired,
  isGrouped: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  header: PropTypes.element
}

export default React.memo(GridChart)
