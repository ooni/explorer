import React from 'react'

import {
  VictoryLabel,
  VictoryTooltip
} from 'victory'

import { theme } from 'ooni-components'
import { firaSans } from '../../pages/_app'

const Tooltip = (props) => (
  <VictoryTooltip
    {...props}
    labelComponent={
      <VictoryLabel
        style={{
          fill: theme.colors.white,
          fontFamily: `${firaSans.style.fontFamily}, sans-serif`,
          fontSize: props.fontSize || 8
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
