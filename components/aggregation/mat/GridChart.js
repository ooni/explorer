import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Container } from 'ooni-components'
import { FixedSizeList as List } from 'react-window'

import RowChart from './RowChart'
import { useDebugContext } from '../DebugContext'

// all props are passed by the List component
const Row = ({ index, style, data }) => {
  const { reshapedData, rows, indexBy, yAxis } = data
  const rowKey = rows[index]
  const rowData = reshapedData[rowKey]
  // style is passed by the List component to give our Row the correct dimensions
  return (
    <div style={style} key={index}>
      <RowChart
        key={index}
        data={rowData}
        indexBy={indexBy}
        label={{
          key: yAxis,
          value: rowKey
        }}
      />
    </div>
  )
}

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
      <List
        height={800}
        width={'100%'}
        itemCount={rows.length}
        itemSize={250}
        itemData={{reshapedData, rows, indexBy: query.axis_x, yAxis: query.axis_y}}
      >
        {Row}
      </List>
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