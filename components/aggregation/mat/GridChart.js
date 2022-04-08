import React, { useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { TooltipProvider, Tooltip } from '@nivo/tooltip'
import { Container } from '@nivo/core'
import { Heading, Flex, Box } from 'ooni-components'

import RowChart, { chartMargins } from './RowChart'
import { sortRows, fillDataHoles } from './computations'
import { getXAxisTicks } from './timeScaleXAxis'
import { useMATContext } from './MATContext'
import { ChartHeader } from './ChartHeader'
import { getRowLabel } from './labels'
import { VirtualRows } from './VirtualRows'
import { XAxis } from './XAxis'
import { barThemeForTooltip } from './CustomTooltip'

const ROW_HEIGHT = 70
const XAXIS_HEIGHT = 62
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

export const prepareDataForGridChart = (data, query) => {
  const rows = []
  const rowLabels = {}
  let reshapedData = {}

  data.forEach((item) => {
    // Convert non-string keys (e.g `probe_asn`) to string
    // because they get casted to strings during Object transformations
    const key = String(item[query.axis_y])
    if (key in reshapedData) {
      reshapedData[key].push(item)
    } else {
      rows.push(key)
      reshapedData[key] = [item]
      rowLabels[key] = getRowLabel(key, query.axis_y)
    }
  })

  const reshapedDataWithoutHoles = fillDataHoles(reshapedData, query)

  rows.sort((a,b) => sortRows(a, b, query.axis_y))

  return [reshapedDataWithoutHoles, rows, rowLabels]
}

/**
 * Renders the collection of RowCharts. This is either passed down from
 * TableView or from other components like `<Chart>` (`components/dashboard/Charts.js`)
 *
 * data - A Map where each key represents a row in the Grid and
 *        the value is an array of data objects (from aggregation API response) for the row
 *
 * rowKeys - has the full set of keys available when filtering by selectedRows
 * 
 * rowLabels - Labels to render along with the chart in a row
 * 
 * selectedRows - a subset of `rowKeys` representing which rows to render in the grid
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
const GridChart = ({ data, rowKeys, rowLabels, isGrouped = true, height = 'auto', header, selectedRows = null, noLabels = false }) => {

  // Fetch query state from context instead of router
  // because some params not present in the URL are injected in the context
  const [ query ] = useMATContext()
  const { tooltipIndex } = query
  const indexBy = query.axis_x
  const tooltipContainer = useRef(null)

  const rowsToRender = useMemo(() => {
    if (!selectedRows) {
      return rowKeys
    }

    if (selectedRows.length > 0) {
      return selectedRows
    }
  }, [rowKeys, selectedRows])

  let gridHeight = height
  if (height === 'auto') {
    const rowCount = selectedRows?.length ?? rowKeys.length
    gridHeight = Math.min( XAXIS_HEIGHT + (rowCount * ROW_HEIGHT), GRID_MAX_HEIGHT)
  }

  if (data.size < 1) {
    return (
      <Flex flexDirection='column' justifyContent='center' sx={{ height: '100%' }}>
        <Heading h={5}> No enough data for charts </Heading>
        <Heading h={6}> Check browser console to inspect received data.</Heading>
      </Flex>
    )
  }

  const xAxisTickValues = getXAxisTicks(query, 30)
  const xAxisMargins = {...chartMargins, top: 60, bottom: 0}
  const axisTop = {
    enable: true,
    tickSize: 5,
    tickPadding: 5,
    tickRotation: -45,
    tickValues: xAxisTickValues
  }

  // To correctly align with the rows, generate a data row with only x-axis values
  // e.g [ {measurement_start_day: '2022-01-01'}, {measurement_start_day: '2022-01-02'}... ]
  const xAxisData = data.get(rowKeys[0]).map(d => ({ [query.axis_x]: d[query.axis_x]}))

  const rowHeight = noLabels ? 500 : ROW_HEIGHT

  return (
    <Container theme={barThemeForTooltip}>
      <TooltipProvider container={tooltipContainer}>
        <Flex ref={tooltipContainer} flexDirection='column'>
          <Flex flexDirection='column'>
            <ChartHeader options={header} />
            {/* Fake axis on top of list. Possible alternative: dummy chart with axis and valid tickValues */}
            {/* Use a virtual list only for higher count of rows */}
            {rowsToRender.length < 10 ? (
              <Flex
                className='outerListElement'
                flexDirection='column'
                style={{
                  height: gridHeight
                }}
              >
                {!noLabels && <XAxis data={xAxisData} />}
                {rowsToRender.map((rowKey, index) => 
                  <RowChart
                    key={rowKey}
                    rowIndex={index}
                    data={data.get(rowKey)}
                    indexBy={indexBy}
                    height={rowHeight}
                    label={rowLabels[rowKey]}
                  />
                )}
              </Flex>
            ) : (
              <VirtualRows
                xAxis={!noLabels && <XAxis data={xAxisData} />}
                data={data}
                rows={rowsToRender}
                rowLabels={rowLabels}
                gridHeight={gridHeight}
                indexBy={indexBy}
                tooltipIndex={tooltipIndex}
              />
            )}
          </Flex>
        </Flex>
        <Tooltip />
      </TooltipProvider>
    </Container>
  )
}

GridChart.propTypes = {
  data: PropTypes.objectOf(PropTypes.array).isRequired,
  rowKeys: PropTypes.arrayOf(PropTypes.string),
  rowLabels: PropTypes.objectOf(PropTypes.string),
  selectedRows: PropTypes.arrayOf(PropTypes.string),
  isGrouped: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  header: PropTypes.element,
  noLabels: PropTypes.bool
}

export default React.memo(GridChart)
