import React from 'react'
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis, VictoryLabel } from 'victory'
import { theme } from 'ooni-components'

import VictoryTheme from '../../VictoryTheme'

const colorScale = [
  theme.colors.green8,
  theme.colors.gray6,
  theme.colors.yellow9,
  theme.colors.red7,
]

const themeOverride = Object.assign({}, VictoryTheme, {})
themeOverride.axis.style.axis.strokeWidth = 0
themeOverride.axis.style.ticks.size = 0

const WebsiteInCountry = ({ data }) => {
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
            data={data}
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
