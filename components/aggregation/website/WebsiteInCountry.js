/* global process */

import React from 'react'
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis, VictoryLabel } from 'victory'
import { theme } from 'ooni-components'
import useSWR from 'swr'

// import wdata from './website-data'

import { buildQuery } from './buildQuery'
import VictoryTheme from '../../VictoryTheme'


const AGGREGATION_API = `${process.env.MEASUREMENTS_URL}/api/v1/aggregation?`

const dataFetcher = url => (
  fetch(AGGREGATION_API + url).then(r => r.json())
)

const colorScale = [
  theme.colors.green8,
  theme.colors.gray6,
  theme.colors.yellow9,
  theme.colors.red7,
]

const themeOverride = Object.assign({}, VictoryTheme, {})
themeOverride.axis.style.axis.strokeWidth = 0
themeOverride.axis.style.ticks.size = 0

const WebsiteInCountry = ({ probe_cc = 'IT' }) => {

  const params = {
    'since': '2020-05-26',
    'until': '2020-06-26',
    'axis_x': 'measurement_start_day',
    'test_name': 'web_connectivity',
    'input': 'thepiratebay.org',
    'probe_cc': probe_cc
  }

  const query = buildQuery(params)

  const { data, error } = useSWR(query, dataFetcher)
  // const data = wdata, error = null

  return (
    <VictoryChart
      width={800}
      height={200}
      domainPadding={{ x: 30, y: 20 }}
      theme={themeOverride}
    >
      <VictoryStack colorScale={colorScale}>
        {[ 'measurement_count', 'failure_count', 'anomaly_count', 'confirmed_count'].map(key =>
          <VictoryBar
            key={key}
            name={key}
            data={data.result}
            x='measurement_start_day'
            y={d => {
              if (key === 'measurement_count') {
                return d.measurement_count - (d.anomaly_count + d.failure_count + d.confirmed_count)
              } else {
                return d[key]
              }
            }}
          />
        )}
      </VictoryStack>
      <VictoryAxis
        scale={{ x: 'time' }}
        fixLabelOverlap
        tickLabelComponent={
          <VictoryLabel angle={270} dy={0} textAnchor='end' verticalAnchor='middle' />
        }
      />
    </VictoryChart>
  )
}

export default WebsiteInCountry
