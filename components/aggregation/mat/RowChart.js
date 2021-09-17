import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Text } from 'ooni-components'
import { Bar } from '@nivo/bar'
import { FaGlobe } from 'react-icons/fa'
import styled from 'styled-components'
import { BasicTooltip, TableTooltip, Chip } from '@nivo/tooltip'

import { CustomBarItem } from './CustomBarItem'

const keys = [
  'anomaly_count',
  'confirmed_count',
  'failure_count',
  'ok_count',
]

const colorMap = {
  'confirmed_count': '#f03e3e', // red7,
  'anomaly_count': '#fab005', // yellow6
  'failure_count': '#ced4da', // gray4
  'ok_count': '#51cf66' // green5
}

const colorFunc = (d) => colorMap[d.id] || '#ccc'

const TooltipHeader = React.memo(({ date, onClose }) => (
  <Flex justifyContent='space-between' alignItems='center'>
    <Text fontWeight='bold'>{date}</Text>
    <button onClick={onClose}>X</button>
  </Flex>
))

TooltipHeader.displayName = 'TooltipHeader'

const CustomToolTip = React.memo(({ data, onClose }) => {
  const rows = useMemo(() => {
    const dataKeysToShow = ['anomaly_count', 'confirmed_count', 'failure_count', 'ok_count']
    return dataKeysToShow.map(k => [
      <Chip key={k} color={colorMap[k]} />,
      k,
      data[k]]
    )
  }, [])
  return (
    <TableTooltip title={<TooltipHeader date={data.measurement_start_day} onClose={onClose} />} rows={rows} style={{ zIndex: 200 }} />
  )
})
CustomToolTip.displayName = 'CustomTooltip'

const RowChart = ({ data, indexBy, label, height, rowIndex, showTooltipInRow, showTooltip /* width, first, last */}) => {
  const [tooltipPos, setTooltipPos] = useState([-1, -1])

  const handleClick = useCallback((d, e) => {
    console.log(e)
    console.log(e.clientX, e.clientY)
    setTooltipPos([e.clientX, e.clientY])
    showTooltipInRow(rowIndex)
  }, [rowIndex, showTooltipInRow])

  return (
    <Flex alignItems='center' sx={{ position: 'relative' }}>
      <Box width={2/16}>
        {label}
      </Box>
      <Box>
        <Bar
          data={data}
          rowIndex={rowIndex}
          keys={keys}
          indexBy={indexBy}
          // NOTE: These dimensions are linked to accuracy of the custom axes rendered in
          // <GridChart />
          width={1000}
          height={height}
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
          barComponent={CustomBarItem}
          theme={{
            tooltip: {
              container: {
                pointerEvents: 'initial',
              }
            }
          }}
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

export default RowChart