import React from 'react'
import PropTypes from 'prop-types'
import { HeatMap } from '@nivo/heatmap'
import { Box, Heading } from 'ooni-components'

import { Debug } from '../Debug'
import {
  colorNormal,
  colorAnomaly,
  colorConfirmed,
  colorError
} from '../../colors'

const getHeatMapData = (data, yAxis) => {
  /*
    'IT': {
      probe_cc: 'IT',
      '2021-03-01': {
        anomaly_count: 111,
        measurement_count: 200,
        confirmed_count: 10
      },
      '2021-03-02': {
        anomaly_count: 12,
        ...
      }
    }
  */
  const keys = new Set()
  const indexBy = yAxis // probe_cc or input
  const groupByXAxis = data.reduce((acc, item) => {
    const { measurement_start_day, ...restOfItem } = item
    const key = item[yAxis]
    const value = restOfItem
    const date = measurement_start_day // xAxis
    keys.add(date)

    if (!(key in acc)) {
      // Add a new (day,count) to that
      acc[key] = {}
      acc[key][yAxis] = key
    }
    acc[key][date] = value

    return acc
  }, {})
  const reducedData = Object.keys(groupByXAxis).map(k => groupByXAxis[k])
  return [
    [...keys],
    reducedData,
    indexBy
  ]
}

const CustomHeatMapCell = ({
  // data,
  value,
  x,
  y,
  width,
  height,
  // color,
  opacity,
  borderWidth,
  borderColor,
  textColor,
  // enableLabel,
  // onClick,
  onHover,
  onLeave,
  // theme
}) => {
  const barsData = [
    ['ok_count', colorNormal],
    ['failure_count', colorError],
    ['confirmed_count', colorConfirmed],
    ['anomaly_count', colorAnomaly],
  ]

  let prevHeight = 0

  return (
    <g transform={`translate(${x}, ${y}) scale(1, -1)`} onMouseOver={onHover} onMouseLeave={onLeave}>
      {value !== undefined && barsData.map(([barLabel, barColor], index) => {
        const barHeight = height * (value[barLabel] / value['measurement_count']) // ((index + 1) / 10)
        const barY = prevHeight === 0 ? (height * -0.5) : (height * -0.5) + prevHeight
        prevHeight = prevHeight + barHeight
        return (
          <rect
            key={index}
            x={width * -0.5}
            y={barY}
            width={width}
            height={barHeight}
            fillOpacity="0.85"
            strokeWidth={borderWidth}
            stroke={borderColor}
            strokeOpacity={opacity}
            fill={barColor}
          />
        )
      })}
      {value === undefined && (
        <text
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fill: textColor, transform: 'scaleY(-1)' }}
        >
          {'❤️'}
        </text>
      )}
    </g>
  )
}

CustomHeatMapCell.propTypes = {
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  height: PropTypes.number,
  onHover: PropTypes.func,
  onLeave: PropTypes.func,
  opacity: PropTypes.number,
  textColor: PropTypes.string,
  value: PropTypes.any,
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
}

const HeatMapCell = React.memo(CustomHeatMapCell)

const HEIGHT_MULTIPLIER = 30

export const HeatmapChart = ({ data, query }) => {
  // console.log(getHeatMapData(sData, yAxis))
  const yAxis = query.axis_y
  const [keys, shapedData, indexBy] = getHeatMapData(data, yAxis)
  return (
    <Box>
      <HeatMap
        width={960}
        height={ Math.max(shapedData.length * HEIGHT_MULTIPLIER, 500) }
        data={shapedData}
        keys={keys}
        indexBy={indexBy}
        margin={{
          top: 100,
          bottom: 100,
          left: 50,
          right: 10
        }}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -90
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 10,
          legend: yAxis,
          legendPosition: 'middle',
          legendOffset: -60
        }}
        padding={5}
        enableGridY={false}
        cellShape={CustomHeatMapCell}
        tooltipFormat={value =>
          `\n Total - ${value.measurement_count}\n Anomalies - ${value.anomaly_count}\n Confirmed - ${value.confirmed_count}\n Ok - ${value.ok_count}\n Failures - ${value.failure_count}`
        }
        forceSquare={true}
        isInteractive={true}
        animate={false}
      />
      <Debug params={query}>
        <Box>
          <Heading h={4}>Processed Data</Heading>
          <pre>
            {JSON.stringify(shapedData, null, 2)}
          </pre>
          <Heading h={4}>API Response Data</Heading>
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        </Box>
      </Debug>
    </Box>
  )
}
HeatmapChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      anomaly_count: PropTypes.number,
      confirmed_count: PropTypes.number,
      failure_count: PropTypes.number,
      measurement_count: PropTypes.number,
      ok_count:  PropTypes.number,
      measurement_start_day: PropTypes.string,
      probe_cc: PropTypes.string
    })
  ),
  query: PropTypes.shape({
    axis_x: PropTypes.string,
    axis_y: PropTypes.string,
    since: PropTypes.string,
    until: PropTypes.string,
    test_name: PropTypes.string,
    input: PropTypes.string,
    probe_cc: PropTypes.string,
    category_code: PropTypes.string,
  })
}
