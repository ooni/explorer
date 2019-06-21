import React from 'react'

import {
  VictoryTooltip,
  VictoryLabel
} from 'victory'

import { theme } from 'ooni-components'

const Tooltip = (props) => {
  const { x, scale } = props
  const range = scale.y.range()
  return (
    <g>
      <VictoryTooltip
        {...props}
        labelComponent={
          <VictoryLabel
            style={{
              fill: theme.colors.white,
              fontSize: 8
            }}
          />
        }
        flyoutStyle={{
          strokeWidth: 0,
          fill: theme.colors.gray8,
          padding: 2,
          pointerEvents: 'none'
        }}
      />
      <line
        style={{
          stroke: 'black',
          strokeWidth: 1
        }}
        x1={x}
        x2={x}
        y1={Math.max(...range)}
        y2={Math.min(...range)}
      />
    </g>
  )
}

export default Tooltip
