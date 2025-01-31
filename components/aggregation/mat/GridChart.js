import { Container } from '@nivo/core'
import { Tooltip, TooltipProvider } from '@nivo/tooltip'
import { ChartSpinLoader } from 'components/Chart'
import PropTypes from 'prop-types'
import { memo, useMemo, useRef } from 'react'
import { ChartHeader } from './ChartHeader'
import { barThemeForTooltip } from './CustomTooltip'
import { useMATContext } from './MATContext'
import { NoCharts } from './NoCharts'
import RowChart from './RowChart'
import { VirtualRows } from './VirtualRows'
import { XAxis } from './XAxis'
import { fillDataHoles, sortRows } from './computations'
import { getRowLabel } from './labels'

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

export const prepareDataForGridChart = (data, query, locale) => {
  const rows = []
  const rowLabels = {}
  const reshapedData = {}

  for (const item of data) {
    // Convert non-string keys (e.g `probe_asn`) to string
    // because they get casted to strings during Object transformations
    const key = String(item[query.axis_y])
    if (key in reshapedData) {
      reshapedData[key].push(item)
    } else {
      rows.push(key)
      reshapedData[key] = [item]
      rowLabels[key] = getRowLabel(key, query.axis_y, locale)
    }
  }

  const reshapedDataWithoutHoles = fillDataHoles(reshapedData, query)

  const sortedRowKeys = rows.sort((a, b) =>
    sortRows(rowLabels[a], rowLabels[b], query.axis_y, locale),
  )

  return [reshapedDataWithoutHoles, sortedRowKeys, rowLabels]
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
 * height - uses a specific height provided by the container (e.g ResizableBox)
 * If not speicied, it calculates a height based on the number of rows, capped
 * at GRID_MAX_HEIGHT, which allows <VirtualRows> to render a subset of the data
 * at a time.
 *
 * header - an element showing some summary information on top of the charts
}
*/
const GridChart = ({
  data,
  rowKeys,
  rowLabels,
  height = 'auto',
  header,
  selectedRows = null,
  noLabels = false,
}) => {
  // Fetch query state from context instead of router
  // because some params not present in the URL are injected in the context
  const [query] = useMATContext()
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
    gridHeight = Math.min(XAXIS_HEIGHT + rowCount * ROW_HEIGHT, GRID_MAX_HEIGHT)
  }

  // To correctly align with the rows, generate a data row with only x-axis values
  // e.g [ {measurement_start_day: '2022-01-01'}, {measurement_start_day: '2022-01-02'}... ]
  const xAxisData = data?.size
    ? data.get(rowKeys[0]).map((d) => ({ [query.axis_x]: d[query.axis_x] }))
    : null

  const rowHeight = noLabels ? 500 : ROW_HEIGHT

  return (
    <Container theme={barThemeForTooltip}>
      <TooltipProvider container={tooltipContainer}>
        <div className="flex flex-col" ref={tooltipContainer}>
          <div className="flex flex-col">
            <ChartHeader
              options={{ ...header, logo: !!data?.size, legend: !!data?.size }}
            />
            {!data && <ChartSpinLoader />}
            {data?.size === 0 && <NoCharts />}
            {data?.size > 0 && (
              // Fake axis on top of list. Possible alternative: dummy chart with axis and valid tickValues
              // Use a virtual list only for higher count of rows
              <>
                {rowsToRender.length < 10 ? (
                  <div
                    className="outerListElement flex flex-col"
                    style={{
                      height: gridHeight,
                    }}
                  >
                    {!noLabels && <XAxis data={xAxisData} />}
                    {rowsToRender.map((rowKey, index) => (
                      <RowChart
                        key={rowKey}
                        rowIndex={index}
                        data={data.get(rowKey)}
                        indexBy={indexBy}
                        height={rowHeight}
                        label={rowLabels[rowKey]}
                      />
                    ))}
                  </div>
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
              </>
            )}
          </div>
        </div>
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
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  header: PropTypes.element,
  noLabels: PropTypes.bool,
}

export default memo(GridChart)
