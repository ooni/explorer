import React from 'react'
import { ResponsiveFunnel } from '@nivo/funnel'
import { theme } from 'ooni-components'

const stateColors = {
  'ok': theme.colors.green8,
  'failure': theme.colors.gray6,
  'anomaly': theme.colors.yellow9,
  'confirmed': theme.colors.red7,
}

const reshapeData = (data) => {
  const withOKMsmts = {
    ...data
  }
  return Object.entries(withOKMsmts).map((entry) => ({
    'id': entry[0],
    'value': entry[1],
    'label': `${entry[0].split('_')[0]}`
  })).sort((a,b) => a.value < b.value)
}

export const FunnelChart = ({ data }) => (
  <ResponsiveFunnel
    data={reshapeData(data)}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    valueFormat=">-.2s"
    colors={d => stateColors[d.id.split('_')[0]] ?? theme.colors.blue5}
    borderWidth={20}
    labelColor={{ from: 'color', modifiers: [ [ 'darker', 3 ] ] }}
    beforeSeparatorLength={100}
    beforeSeparatorOffset={20}
    afterSeparatorLength={100}
    afterSeparatorOffset={20}
    currentPartSizeExtension={10}
    currentBorderWidth={40}
    motionConfig="wobbly"
  />
)