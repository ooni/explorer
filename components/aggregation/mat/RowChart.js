import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, theme } from 'ooni-components'
import { ResponsiveBar as Bar } from '@nivo/bar'

import { CustomBarItem } from './CustomBarItem'
import { CustomToolTip } from './CustomTooltip'
import { colorMap } from './colorMap'

const keys = [
  'anomaly_count',
  'confirmed_count',
  'failure_count',
  'ok_count',
]

const colorFunc = (d) => colorMap[d.id] || '#ccc'

const barLayers = ['grid', 'bars']

const barThemeForTooltip = {
  tooltip: {
    container: {
      pointerEvents: 'initial',
      boxShadow: `1px 1px 4px 1px ${theme.colors.gray6}`
    }
  }
}

const RowChart = ({ data, indexBy, label, height, rowIndex, showTooltipInRow, showTooltip, isStaticChart /* width, first, last */}) => {
  const handleClick = useCallback(({ column }) => {
    showTooltipInRow(rowIndex, column)
  }, [rowIndex, showTooltipInRow])

  return (
    <Flex alignItems='center' sx={{ position: 'relative' }}>
      <Box width={2/16}>
        {label}
      </Box>
      <Box sx={{ height: height, width: '100%' }}>
        <Bar
          data={data}
          keys={keys}
          indexBy={indexBy}
          // NOTE: These dimensions are linked to accuracy of the custom axes rendered in
          // <GridChart />
          margin={{ top: 4, right: 100, bottom: 4, left: 0 }}
          padding={0.3}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          colors={colorFunc}
          axisTop={null}
          axisRight={{
            enable: true,
            tickSize: 5,
            tickPadding: 5,
            tickValues: 2
          }}
          xScale={{ type: 'time' }}
          axisBottom={null}
          axisLeft={null}
          enableGridX={true}
          labelSkipWidth={100}
          labelSkipHeight={100}
          labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          tooltip={CustomToolTip}
          onClick={handleClick}
          barComponent={CustomBarItem}
          theme={barThemeForTooltip}
          // We send the `showTooltip` boolean into the barComponent to control visibility of tooltip
          enableLabel={showTooltip}
          animate={false}
          motionConfig={{
            duration: 0
          }}
          isInteractive={!isStaticChart}
          layers={barLayers}
        />
      </Box>
    </Flex>
  )
}

RowChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    anomaly_count: PropTypes.number,
    confirmed_count: PropTypes.number,
    failure_count: PropTypes.number,
    input: PropTypes.string,
    measurement_count: PropTypes.number,
    measurement_start_day: PropTypes.string,
    ok_count: PropTypes.number,
  })),
  height: PropTypes.number,
  indexBy: PropTypes.string,
  label: PropTypes.node,
}

export default React.memo(RowChart)
