import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'ooni-components'
import { Bar, ResponsiveBar } from '@nivo/bar'

const RowChart = ({ data, keys, indexBy, label }) => {
  return (
    <Box p={3} sx={{ }}>
      {`${label.key}: ${label.value}`}
      <Bar
        width={960}
        height={130}
        data={data}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 10, right: 0, bottom: 60, left: 80 }}
        padding={0.3}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        xScale={{ type: 'time' }}
        axisBottom={{
          tickSize: 5,
          tickRotation: 45,
          format: value => value
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickValues: 2
        }}
        labelSkipWidth={100}
        labelSkipHeight={100}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />

    </Box>
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
  }))
}

export default RowChart