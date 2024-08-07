import { ResponsiveFunnel } from '@nivo/funnel'
import { colors } from 'ooni-components'

const stateColors = {
  ok: colors.green['800'],
  failure: colors.gray['600'],
  anomaly: colors.yellow['900'],
  confirmed: colors.red['700'],
}

const reshapeData = (data) => {
  return Object.entries(data)
    .map((entry) => ({
      id: entry[0],
      value: entry[1],
      label: `${entry[0].split('_')[0]}`,
    }))
    .sort((a, b) => a.value < b.value)
}

export const FunnelChart = ({ data }) => (
  <ResponsiveFunnel
    data={reshapeData(data)}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    valueFormat=">-.2s"
    colors={(d) => stateColors[d.id.split('_')[0]] ?? colors.blue['500']}
    borderWidth={20}
    labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
    beforeSeparatorLength={100}
    beforeSeparatorOffset={20}
    afterSeparatorLength={100}
    afterSeparatorOffset={20}
    currentPartSizeExtension={10}
    currentBorderWidth={40}
    motionConfig="wobbly"
  />
)
