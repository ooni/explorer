import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Container, Flex } from 'ooni-components'

import RowChart from './RowChart'
import { useDebugContext } from '../DebugContext'

const keys = [
  'anomaly_count',
  'confirmed_count',
  'failure_count',
  'ok_count',
]

const reshapeData = (data, query) => {
  const reshapedData = {}
  const rows = []
  data.forEach((item) => {
    const key = item[query.axis_y]
    item['ok_count'] = item.measurement_count - item.confirmed_count - item.anomaly_count
    if (key in reshapedData) {
      reshapedData[key].push(item)
    } else {
      rows.push(key)
      reshapedData[key] = [item]
    }
  })
  return [reshapedData, rows]
}

const GridChart = ({ data, query }) => {
  const { doneReshaping, doneRendering } = useDebugContext()

  const [reshapedData, rows] = useMemo(() => {
    const t0 = performance.now()
    const [reshapedData, rows] = reshapeData(data, query)
    const t1 = performance.now()
    doneReshaping(t0, t1)
    return [reshapedData, rows]
  }, [data, query])

  useEffect(() => {
    doneRendering(performance.now())
  })

  return (
    <Container>
      <Flex flexDirection='column'>
        {rows.map((row, index) => (
          <RowChart key={index} data={reshapedData[row]} keys={keys} indexBy={query.axis_x} label={{
            key: query.axis_y,
            value: row
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