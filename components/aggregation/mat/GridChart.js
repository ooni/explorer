import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Bar } from '@nivo/bar'
import countryUtil from 'country-util'
import { Flex, Box } from 'ooni-components'

import RowChart from './RowChart'
import { useDebugContext } from '../DebugContext'
import { getCategoryCodesMap } from '../../utils/categoryCodes'
import TableView from './TableView'

// all props are passed by the List component
const Row = ({ index, style, data }) => {
  const { reshapedData, rows, rowLabels, indexBy, showTooltipInRow, tooltipIndex/* yAxis */} = data
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

const categoryCodesMap = getCategoryCodesMap()

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

const getRowLabel = (key, yAxis) => {
  switch (yAxis) {
  case 'probe_cc':
    return countryUtil.territoryNames[key]
  case 'category_code':
    return categoryCodesMap.get(key).name
  case 'input':
    return (<InputRowLabel input={key} />)
  default:
    return key
  }
}

function getDatesBetween(startDate, endDate) {
  const dateArray = new Set()
  var currentDate = startDate
  while (currentDate <= endDate) {
    dateArray.add(currentDate.toISOString().slice(0, 10))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dateArray
}

const reshapeData = (data, query) => {
  const dateSet = getDatesBetween(new Date(query.since), new Date(query.until))
  const reshapedData = {}
  const rows = []
  const rowLabels = {}
  data.forEach((item) => {
    const key = item[query.axis_y]
    item['ok_count'] = item.measurement_count - item.confirmed_count - item.anomaly_count
    if (key in reshapedData) {
      reshapedData[key].push(item)
    } else {
      rows.push(key)
      reshapedData[key] = [item]
      rowLabels[key] = getRowLabel(key, query.axis_y)
    }
  })

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

  return [reshapedData, rows, rowLabels]
}

const GridChart = ({ data, query }) => {
  const { doneReshaping, doneRendering } = useDebugContext()
  
  // [rowIndex, columnKey] for the bar where click was detected
  // and tooltip is to be shown
  const [tooltipIndex, setTooltipIndex] = useState([-1, ''])

  const showTooltipInRow = useCallback((index, column) => {
    console.log(`Registering: ${index}, ${column} to show tooltip`)
    setTooltipIndex([index, column])
  }, [setTooltipIndex])

  const [reshapedData, rows, rowLabels] = useMemo(() => {
    const t0 = performance.now()
    const [reshapedData, rows, rowLabels] = reshapeData(data, query)
    const t1 = performance.now()
    doneReshaping(t0, t1)
    return [reshapedData, rows, rowLabels]
  }, [data, doneReshaping, query])

  useEffect(() => {
    doneRendering(performance.now())
  })

  // FIX: Use the first row to generate the static xAxis outside the charts.
  //  * it is dependent on the width of the charts which is hard coded in `RowChart.js`
  //  * it may not work well if the first row has little or no data
  const dateSet = [...getDatesBetween(new Date(query.since), new Date(query.until))]

  return (
    <Flex flexDirection='column' >
      <Flex flexDirection='column' my={4}>
        {/* Fake axis on top of list. Possible alternative: dummy chart with axis and valid tickValues */}
        <Flex>
          <Box width={2/16}>
          </Box>
          <Flex sx={{ width: '1000px' }} justifyContent='space-between'>
            <Bar
              data={reshapedData[rows[0]]}
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
                itemData={{reshapedData, rows, rowLabels, indexBy: query.axis_x, yAxis: query.axis_y, tooltipIndex, showTooltipInRow }}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        </Flex>
      </Flex>
      <Flex my={4} sx={{ height: '40vh' }}>
        <TableView data={data} yAxis={query.axis_y} />
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