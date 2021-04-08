import React from 'react'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { Flex, Box } from 'ooni-components'
import data from './data'

export const Heatmap = () => (
  <Flex flexDiection='column'>
    <Box width={1/2}>
      <h1>Nivo basic demo</h1>
      <div style={{ height: '300px' }}>
        <ResponsiveHeatMap
          data={data}
          keys={[
            'hot dog',
            'burger',
            'sandwich',
            'kebab',
            'fries',
            'donut',
            'junk',
            'sushi',
            'ramen',
            'curry',
            'udon'
          ]}
          indexBy='country'
          margin={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }}
          axisBottom={{
            tickSize: 5
          }}
        />
      </div>
    </Box>
  </Flex>
)
