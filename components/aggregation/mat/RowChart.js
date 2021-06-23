import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'ooni-components'
import { Bar } from '@nivo/bar'

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

const RowChart = ({ data, indexBy, label, height, /* width, first, last */}) => {
  return (
    <Flex alignItems='center' sx={{ borderBottom: '1px solid grey'}}>
      <Box width={2/16}>
        {label}
      </Box>
      <Box>
        <Bar
          data={data}
          keys={keys}
          indexBy={indexBy}
          // NOTE: These dimensions are linked to accuracy of the custom axes rendered in
          // <GridChart />
          width={1000}
          height={height}
          margin={{ top: 4, right: 40, bottom: 4, left: 0 }}
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
          labelSkipWidth={100}
          labelSkipHeight={100}
          labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          legends={[]}
          animate={false}
          motionStiffness={90}
          motionDamping={15}
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