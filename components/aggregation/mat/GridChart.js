import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Container, Flex } from 'ooni-components'

import RowChart from './RowChart'
import { useDebugContext } from '../DebugContext'

const reshapeData = (data, query) => {
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
    reducedData.push((data.filter(item => item[query.axis_y] === row)))
  }

  return [
    keys,
    reducedData,
    indexBy
  ]
}

const GridChart = ({ data, query }) => {
  const { doneReshaping, doneRendering } = useDebugContext()

  const [keys, reshapedData, indexBy] = useMemo(() => {
    const t0 = performance.now()
    const reshapedData = reshapeData(data, query)
    const t1 = performance.now()
    doneReshaping(t0, t1)
    return reshapedData
  }, [data, query])

  useEffect(() => {
    doneRendering(performance.now())
  })

  return (
    <Container>
      <Flex flexDirection='column'>
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