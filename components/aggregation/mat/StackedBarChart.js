import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'

import { colorMap } from './colorMap'

const colorFunc = (d) => colorMap[d.id] || '#ccc'

// const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
// const formatDay = d3.timeFormat("%Y-%m-%d")

export const StackedBarChart = ({ data, query }) => {
  const chartMeta = useMemo(() => {
    // TODO Move charting related transformations to Charts.js
    if (data) {
      let cols = [
        'anomaly_count',
        'confirmed_count',
        'failure_count',
        'ok_count',
      ]
      let indexBy = ''
      indexBy = query['axis_x']
      let reshapedData = Array.isArray(data.data.result) ? data.data.result.map(d => {
        d['ok_count'] = d.measurement_count - d.confirmed_count - d.anomaly_count
        return d
      }) : data.data.result
      return {
        data: reshapedData,
        dimensionCount: data.data.dimension_count,
        url: data.url,
        loadTime: data.loadTime,
        cols,
        indexBy
      }
    } else {
      return null
    }
  }, [data, query])

  if (chartMeta === null) {
    return (<div />)
  }

  return (
    <ResponsiveBar
      data={chartMeta.data}
      keys={chartMeta.cols}
      indexBy={chartMeta.indexBy}
      margin={{ top: 50, right: 130, bottom: 100, left: 80 }}
      padding={0.3}
      colors={colorFunc}
      borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 45,
        legend: `axis_x: ${chartMeta.indexBy}`,
        legendPosition: 'start',
        legendOffset: 32
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'measurement count',
        legendPosition: 'middle',
        legendOffset: -60
      }}
      labelSkipWidth={80}
      labelSkipHeight={20}
      labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
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
