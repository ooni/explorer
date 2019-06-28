import React from 'react'

import {
  VictoryTooltip,
  VictoryLabel
} from 'victory'

import { theme } from 'ooni-components'

const Tooltip = (props) => (
  <VictoryTooltip
    {...props}
    labelComponent={
      <VictoryLabel
        style={{
          fill: theme.colors.white,
          fontFamily: '"Fira Sans", sans-serif',
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
)

export default Tooltip
