import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Bar } from '@nivo/bar'
import { Flex, Box } from 'ooni-components'

import RowChart from './RowChart'
import { getCategoryCodesMap } from '../../utils/categoryCodes'

// all props are passed by the List component
const Row = ({ index, style, data }) => {
  const { reshapedData, rows, rowLabels, indexBy, showTooltipInRow, tooltipIndex, isStaticChart /* yAxis */} = data
  const rowKey = rows[index]
  const rowData = React.useMemo(() => {
    const dataWithHighlights = reshapedData[rowKey].map(d => {
      /* For data points in the hightlighted row and column, enable the highlight flag */
      d.highlight =
      (tooltipIndex[0] === index && Object.keys(d).some(k => `${k}.${d[indexBy]}` === tooltipIndex[1] )) ? (
        true
      ) : (
        false
      )
      return d
    })
    return dataWithHighlights
  }, [index, indexBy, reshapedData, rowKey, tooltipIndex])
  const rowLabel = rowLabels[rowKey]
  // style is passed by the List component to give the correct dimensions to Row component
  return (
    <div style={style} key={index}>
      <RowChart
        key={index}
        rowIndex={index}
        showTooltipInRow={showTooltipInRow}
        showTooltip={tooltipIndex[0] === index}
        first={index === 0}
        last={index === rows.length}
        data={rowData}
        indexBy={indexBy}
        {...style}
        label={rowLabel}
        isStaticChart={isStaticChart}
      />
    </div>
  )
}

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
  const reshapedData = data.reduce((d, groupedRow, i) => {
    rows.push(groupedRow.groupByVal)
    rowLabels[groupedRow.groupByVal] = groupedRow.leafRows[0].original.rowLabel
    return {...d, [groupedRow.groupByVal]: groupedRow.leafRows.map(r => r.original)}
  }, {})

  // 3. If x-axis is `measurment_start_date`, fill will zero values where there is no data
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
  return [reshapedData, rows, rowLabels]
}

const GridChart = ({ data, query }) => {
  const [isStaticChart, setStaticChart] = useState(true)
  
  // [rowIndex, columnKey] for the bar where click was detected
  // and tooltip is to be shown
  const [tooltipIndex, setTooltipIndex] = useState([-1, ''])

  const showTooltipInRow = useCallback((index, column) => {
    setTooltipIndex([index, column])
  }, [setTooltipIndex])

  const [reshapedChartData, rows, rowLabels] = useMemo(() => {
    const t0 = performance.now()
    const [reshapedData, rows, rowLabels] = reshapeChartData(data, query)
    const t1 = performance.now()
    // doneReshaping(t0, t1)
    return [reshapedData, rows, rowLabels]
  }, [data, query])

  // FIX: Use the first row to generate the static xAxis outside the charts.
  //  * it is dependent on the width of the charts which is hard coded in `RowChart.js`
  //  * it may not work well if the first row has little or no data
  const dateSet = [...getDatesBetween(new Date(query.since), new Date(query.until))]

  return (
    <Flex flexDirection='column' >
      <Flex justifyContent='flex-end'>
        <Box><input type='checkbox' name='isStaticChart' checked={isStaticChart} onChange={(e) => setStaticChart(e.target.checked)}/> Static Charts (dev-only) </Box>
      </Flex>
      <Flex flexDirection='column' my={4}>
        {/* Fake axis on top of list. Possible alternative: dummy chart with axis and valid tickValues */}
        <Flex>
          <Box width={2/16}>
          </Box>
          <Flex sx={{ width: '1000px' }} justifyContent='space-between'>
            <Bar
              data={reshapedChartData[rows[0]]}
              indexBy={query.axis_x}
              width={1000}
              height={70}
              margin={{ top: 60, right: 40, bottom: 0, left: 0 }}
              padding={0.3}
              layers={['axes']}
              axisTop={{
                enable: true,
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                tickValues: dateSet
              }}
              xScale={{ type: 'time' }}
              axisBottom={null}
              axisLeft={null}
              axisRight={null}
            />
          </Flex>
        </Flex>
        <Flex sx={{ height: '40vh' }}>
          <AutoSizer>
            {({ width, height }) => (
              <List
                className='outerListElement'
                height={height}
                width={width}
                itemCount={rows.length}
                itemSize={72}
                itemData={{reshapedData: reshapedChartData, rows, rowLabels, indexBy: query.axis_x, yAxis: query.axis_y, tooltipIndex, showTooltipInRow, isStaticChart }}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        </Flex>
      </Flex>
    </Flex>
  )
}

GridChart.propTypes = {
  data: PropTypes.array,
  query: PropTypes.object
}

export {
  GridChart
}