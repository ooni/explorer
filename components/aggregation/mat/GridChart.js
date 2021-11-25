import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { FixedSizeList as List, areEqual } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { ResponsiveBar } from '@nivo/bar'
import { Flex, Box } from 'ooni-components'

import RowChart from './RowChart'
import { getCategoryCodesMap } from '../../utils/categoryCodes'
import { useDebugContext } from '../DebugContext'
import { Profiler } from 'components/utils/profiler'
import { defaultRangeExtractor, useVirtual } from 'react-virtual'

const GRID_ROW_CSS_SELECTOR = 'outerListElement'

// all props are passed by the List component
const Row = React.memo(({ index, style, data }) => {
  // console.log(`Rendering Row for row ${index}`)

  const { reshapedData, rows, rowLabels, indexBy, showTooltipInRow, tooltipIndex, isStaticChart /* yAxis */} = data
  const rowKey = rows[index]
  // const rowData = React.useMemo(() => {
  //   console.log(`generating rowData for ${index} to add highlight flag`)
  //   const dataWithHighlights = reshapedData[rowKey].map(d => {
  //     /* For data points in the hightlighted row and column, enable the highlight flag */
  //     d.highlight =
  //     (tooltipIndex[0] === index && Object.keys(d).some(k => `${k}.${d[indexBy]}` === tooltipIndex[1] )) ? (
  //       true
  //     ) : (
  //       false
  //     )
  //     return d
  //   })
  //   return dataWithHighlights
  // }, [index, indexBy, reshapedData, rowKey, tooltipIndex])

  const rowLabel = rowLabels[rowKey]

  const showTooltip = tooltipIndex[0] === index

  // style is passed by the List component to give the correct dimensions to Row component
  return (
    <div style={style} key={index}>
      <Profiler>
      <RowChart
        key={index}
        rowIndex={index}
        showTooltipInRow={showTooltipInRow}
        showTooltip={showTooltip}
        data={reshapedData[rowKey]}
        indexBy={indexBy}
        height={style.height}
        label={rowLabel}
        isStaticChart={isStaticChart}
      />
      </Profiler>
    </div>
  )
}, areEqual)

Row.displayName = 'Row'

Row.propTypes = {
  data: PropTypes.shape({
    indexBy: PropTypes.string,
    reshapedData: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]),
    rowLabels: PropTypes.object,
    rows: PropTypes.array,
  }),
  index: PropTypes.number,
  style: PropTypes.object,
}

const InputRowLabel = ({ input }) => {
  const trucatedInput = input
  return (
    <Box title={input} sx={{
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}>
      {trucatedInput}
    </Box>
  )
}

InputRowLabel.propTypes = {
  input: PropTypes.string,
}

const categoryCodesMap = getCategoryCodesMap()

const getRowLabel = (key, yAxis) => {
  switch (yAxis) {
  case 'probe_cc':
    return countryUtil.territoryNames[key]
  case 'category_code':
    console.log(key, yAxis)
    return categoryCodesMap.get(key)?.name
  case 'input':
    return (<InputRowLabel input={key} />)
  default:
    return key
  }
}

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
  // 3. If x-axis is `measurement_start_day`, fill will zero values where there is no data
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


const GridChart = ({ data, query }) => {
  const { doneChartReshaping } = useDebugContext()

  const [isStaticChart, setStaticChart] = useState(true)
  const onStaticChecked = useCallback((e) => setStaticChart(e.target.checked), [])
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
    return {reshapedData, rows, rowLabels, indexBy: query.axis_x, yAxis: query.axis_y, tooltipIndex, showTooltipInRow, isStaticChart }
  }, [data, doneChartReshaping, isStaticChart, query, showTooltipInRow, tooltipIndex])

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
    overscan: 2,
    rangeExtractor: useKeepMountedRangeExtractor()
  })

  return (
    <Flex flexDirection='column' >
      <Flex justifyContent='flex-end'>
        <Box><input type='checkbox' name='isStaticChart' checked={isStaticChart} onChange={onStaticChecked}/> Static Charts (dev-only) </Box>
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
          className="List"
          style={{
            height: '40vh',
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
                className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                <Row index={virtualRow.index} style={{ width: '100%', height: `${virtualRow.size}px` }} data={itemData} />
                {/* Row {virtualRow.index} */}
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
