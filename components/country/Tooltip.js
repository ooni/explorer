import { VictoryLabel, VictoryTooltip } from 'victory'

import { colors } from 'ooni-components'
import { firaSans } from '../../pages/_app'

const Tooltip = (props) => (
  <VictoryTooltip
    {...props}
    labelComponent={
      <VictoryLabel
        style={{
          fill: colors.gray['50'],
          fontFamily: `${firaSans.style.fontFamily}, sans-serif`,
          fontSize: props.fontSize || 8,
        }}
      />
    }
    flyoutStyle={{
      strokeWidth: 0,
      fill: colors.gray['800'],
      padding: 2,
      pointerEvents: 'none',
    }}
  />
)

export default Tooltip
