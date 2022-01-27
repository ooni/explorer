import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'
import { Heading, Flex, Box } from 'ooni-components'
import OONILogo from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochrome.svg'

import RowChart from './RowChart'
import { useDebugContext } from '../DebugContext'
import { defaultRangeExtractor, useVirtual } from 'react-virtual'

const GRID_ROW_CSS_SELECTOR = 'outerListElement'

export function getDatesBetween(startDate, endDate) {
  const dateArray = new Set()
  var currentDate = startDate
  while (currentDate <= endDate) {
    dateArray.add(currentDate.toISOString().slice(0, 10))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dateArray
}

const reshapeChartData = (data, query) => {
  const rows = []
  const rowLabels = {}
  const t0 = performance.now()
  const reshapedData = data.reduce((d, groupedRow, i) => {
    rows.push(groupedRow.groupByVal)
    rowLabels[groupedRow.groupByVal] = groupedRow.leafRows[0].original.rowLabel
    return {...d, [groupedRow.groupByVal]: groupedRow.leafRows.map(r => r.original)}
  }, {})
  const t1 = performance.now()
  console.log(`ReshapeChartData: Step 1 took: ${(t1-t0)}ms` )
  // 3. If x-axis is `measurement_start_day`, fill with zero values where there is no data
  if (query.axis_x === 'measurement_start_day') {
    const dateSet = getDatesBetween(new Date(query.since), new Date(query.until))
    for (const y in reshapedData) {
      const datesInRow = reshapedData[y].map(i => i.measurement_start_day)
      const missingDates = [...dateSet].filter(x => !datesInRow.includes(x))

      // Add empty datapoints for dates where measurements are not available
      missingDates.forEach((date) => {
        // use any (first) column data to popuplate yAxis value e.g `input` | `probe_cc`
        // and then overwrite with zero-data for that missing date
        reshapedData[y].splice([...dateSet].indexOf(date), 0, {
          ...reshapedData[y][0],
          measurement_start_day: date,
          anomaly_count: 0,
          confirmed_count: 0,
          failure_count: 0,
          measurement_count: 0,
          ok_count: 0,
        })
      })
    }
  }
  const t2 = performance.now()
  console.log(`ReshapeChartData: Step 2 took: ${(t2-t1)}ms` )
  return [reshapedData, rows, rowLabels]
}

const useKeepMountedRangeExtractor = () => {
  const renderedRef = React.useRef(new Set())

  const rangeExtractor = React.useCallback(range => {
    renderedRef.current = new Set([
      ...renderedRef.current,
      ...defaultRangeExtractor(range)
    ])
    return Array.from(renderedRef.current)
  }, [])

  return rangeExtractor
}


const GridChart = ({ data, query, height }) => {
  // development-only flags for debugging/tweaking etc
  const { doneChartReshaping } = useDebugContext()
  const [overScanValue, setOverScanValue] = useState(0)
  const [enableAnimation, setEnableAnimation] = useState(false)
  const [keepMountedRows, setKeepMountedRows] = useState(false)
  const keepMountedRangeExtractor = useKeepMountedRangeExtractor()

  // [rowIndex, columnKey] for the bar where click was detected
  // and tooltip is to be shown
  const [tooltipIndex, setTooltipIndex] = useState([-1, ''])

  const showTooltipInRow = useCallback((index, column) => {
    setTooltipIndex([index, column])
  }, [setTooltipIndex])

  const itemData = useMemo(() => {
    const t0 = performance.now()
    const [reshapedData, rows, rowLabels] = reshapeChartData(data, query)
    const t1 = performance.now()
    console.debug(`Charts reshaping: ${t1} - ${t0} = ${t1-t0}ms`)
    doneChartReshaping(t0, t1)
    return {reshapedData, rows, rowLabels, indexBy: query.axis_x, yAxis: query.axis_y }
  }, [data, doneChartReshaping, query])

  // FIX: Use the first row to generate the static xAxis outside the charts.
  //  * it is dependent on the width of the charts which is hard coded in `RowChart.js`
  //  * it may not work well if the first row has little or no data
  const xAxisData = itemData.reshapedData[itemData.rows[0]]
  const xAxisMargins = { top: 60, right: 0, bottom: 0, left: 0 }
  const axisTop = {
    enable: true,
    tickSize: 5,
    tickPadding: 5,
    tickRotation: -45,
    tickValues: 'every 5 days'
  }

  const parentRef = React.useRef()

  const rowVirtualizer = useVirtual({
    size: itemData.rows.length,
    parentRef,
    estimateSize: React.useCallback(() => 70, []),
    overscan: overScanValue,
    rangeExtractor: keepMountedRows ? keepMountedRangeExtractor : defaultRangeExtractor
  })

  const {reshapedData, rows, rowLabels, indexBy, yAxis } = itemData

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
      <Box alignSelf='flex-end' sx={{ position: 'absolute', opacity: 0.8, bottom: -8, right: 16 }}>
        <OONILogo height='32px' />
      </Box>
      <Flex bg='red1' p={2} justifyContent='space-around'>
        <Box><input type='checkbox' name='keepMountedRows' checked={keepMountedRows} onChange={(e) => setKeepMountedRows(e.target.checked)}/> Keep Mounted Rows </Box>
        <Box><input type='checkbox' name='enableAnimation' checked={enableAnimation} onChange={(e) => setEnableAnimation(e.target.checked)}/> Enable animation (duration:1) </Box>
        <Box>Virtualizer Overscan<input type='number' min={0} max={itemData.rows.length} name='overScanValue' value={overScanValue} onChange={(e) => setOverScanValue(e.target.value)}/></Box>
      </Flex>
      <Flex flexDirection='column' my={4}>
        {/* Fake axis on top of list. Possible alternative: dummy chart with axis and valid tickValues */}
        <Flex>
          <Box width={2/16}>
          </Box>
          <Box className='xAxis' sx={{ width: '100%', height: '70px' }}>
            <ResponsiveBar
              data={xAxisData}
              indexBy={query.axis_x}
              margin={xAxisMargins}
              padding={0.3}
              layers={['axes']}
              axisTop={axisTop}
              xScale={{ type: 'time', format: '%Y-%m-%d', precision: 'day' }}
              axisBottom={null}
              axisLeft={null}
              axisRight={null}
              animate={false}
            />
          </Box>
        </Flex>
        <Flex>
          <div
            ref={parentRef}
            className={GRID_ROW_CSS_SELECTOR}
            style={{
              height: height,
              width: '100%',
              overflow: 'auto'
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.totalSize}px`,
                width: '100%',
                position: 'relative'
              }}
            >
              {rowVirtualizer.virtualItems.map((virtualRow) => (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    zIndex: tooltipIndex[0] === virtualRow.index ? 1 : 0
                  }}
                >
                  <RowChart
                    rowIndex={virtualRow.index}
                    showTooltipInRow={showTooltipInRow}
                    showTooltip={tooltipIndex[0] === virtualRow.index}
                    data={reshapedData[rows[virtualRow.index]]}
                    indexBy={indexBy}
                    height={virtualRow.size}
                    label={rowLabels[rows[virtualRow.index]]}
                  />
                </div>
              ))}
              </div>
            </div>
        </Flex>
      </Flex>
    </Flex>
  )
}

GridChart.propTypes = {
  data: PropTypes.array,
  query: PropTypes.object
}

export default React.memo(GridChart)
