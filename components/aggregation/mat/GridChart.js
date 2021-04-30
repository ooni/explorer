import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import RowChart from './RowChart'
import { Container, Box, Flex } from 'ooni-components'

// import { getHeatMapData } from './HeatMapChart'

const reshapeData = (data, query) => {
  /*
  indexBy = $xAxis
  keys = [']
  [
    {

    }
  ]
  */
  const rows = data.reduce((rows, item) => rows.add(item[query.axis_y]), new Set())

  const keys = [
    'anomaly_count',
    'confirmed_count',
    'failure_count',
    'ok_count',
    'measurement_count'
  ]

  const indexBy = query.axis_x
  const reducedData = []

  for (const [row] of rows.entries()) {
    // console.log(row)
    reducedData.push((data.filter(item => item[query.axis_y] === row)))
  }

  return [
    keys,
    reducedData,
    indexBy
  ]
}

const GridChart = ({ data, query }) => {
  const [keys, reshapedData, indexBy] = useMemo(() => {
    return reshapeData(data, query)
  }, [data, query])

  // console.log(keys, indexBy)
  // console.log(reshapedData)

  return (
    <Container>
      <Flex flexDirection='column'>
        <Box> Size: {data.length} </Box>
        {reshapedData.map((item, index) => (
          <RowChart key={index} data={item} keys={keys} indexBy={indexBy} label={{
            key: query.axis_y,
            value: item[0][query.axis_y]
          }} />
        ))}
      </Flex>
    </Container>
  )
}

GridChart.propTypes = {
  data: PropTypes.array,
  query: PropTypes.object
}

export {
  GridChart
}