import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Text } from 'ooni-components'
import { Bar } from '@nivo/bar'
import { FaGlobe } from 'react-icons/fa'
import styled from 'styled-components'

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

const TooltipRow = ({ color, label, value }) => (
  <Flex alignItems='center'>
    <Box mx={1} sx={{ height: '12px', width: '12px'}} bg={color} />
    <Text mr={2} fontWeight='bold'>{label}</Text>
    <Box ml='auto'>{value}</Box>
  </Flex>
)

const TooltipContainer = styled(Flex)`
  z-index: 10;
  position: absolute;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  border: 1px solid ${props => props.theme.colors.gray1};
  box-shadow: 1px 1px 3px black;
`

const CustomToolTip = ({ data, x, y }) => {
  const left = x - 160
  const top = 0 - 120
  // console.log(x, y)
  return (
    <TooltipContainer flexDirection='column' bg='white' p={2} top={top} left={left}>
      <Text mr={2} fontWeight='bold'>{data['measurement_start_day']}</Text>
      {keys.map((k, index) => (
        <TooltipRow key={index} color={colorMap[k]} label={k} value={data[k]} />
      ))}
      <TooltipRow label='Total' value={data['measurement_count']} />
      <a href='/search'><FaGlobe />Show measurements</a>
      {x} {y}
    </TooltipContainer>
  )
}

const MemoizedTooltip = React.memo(CustomToolTip)

const CustomEmptyTooltip = () => <React.Fragment />

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
      <Box sx={{ borderBottom: '0px solid grey'}}>
        <Bar
          data={data}
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
          legends={[]}
          animate={false}
          motionStiffness={90}
          motionDamping={15}
          onClick={handleClick}
          tooltip={CustomEmptyTooltip}
        />
      </Box>
      {showTooltip && <MemoizedTooltip data={data} x={tooltipPos[0]} y={tooltipPos[1]} />}
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