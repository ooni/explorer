import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Container, Flex } from 'ooni-components'

import RowChart from './RowChart'
import { useDebugContext } from '../DebugContext'
import { Box } from 'rebass'


const keys = [
  'anomaly_count',
  'confirmed_count',
  'failure_count',
  'ok_count',
  'measurement_count'
]

const reshapeDataOld = (data, query) => {
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

  return [reducedData, rows]
}

const reshapeData = (data, query) => {
  const reshapedData = {}
  const rows = []
  data.forEach((item) => {
    const key = item[query.axis_y]
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

  const old = 1


  const [reshapedData, rows] = useMemo(() => {
    const t0 = performance.now()
    const [reshapedData, rows] = (old % 2 === 0) ? reshapeDataOld(data, query) : reshapeData(data, query)
    const t1 = performance.now()
    doneReshaping(t0, t1)
    return [reshapedData, rows]
  }, [data, query])

  // const [reshapedDataOld, rowsOld] = useMemo(() => {
  //   return reshapeDataOld(data, query)
  // }, [query, data])

  useEffect(() => {
    doneRendering(performance.now())
  })


  return (
    <Container>
      <details>
        <summary>data</summary>
        <pre>{JSON.stringify(reshapedData, null, 2)}</pre>
      </details>

      {/* Old */}
      {(old % 2 === 0) ? (<Flex flexDirection='column'>
        <div> old </div>
        {reshapedData.map((item, index) => (
          <RowChart key={index} data={item} keys={keys} indexBy={query.axis_x} label={{
            key: query.axis_y,
            value: item[0][query.axis_y]
          }} />
        ))}
      </Flex>)
        :
        (<Flex flexDirection='column'>
          <div> new </div>

          {rows.map((row, index) => (
            <RowChart key={index} data={reshapedData[row]} keys={keys} indexBy={query.axis_x} label={{
              key: query.axis_y,
              value: row
            }} />
          ))}
        </Flex>)}
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