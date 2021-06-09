import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

import RowChart from './RowChart'
import { useDebugContext } from '../DebugContext'
import { Flex, Box } from 'ooni-components'
import { getCategoryCodesMap } from '../../utils/categoryCodes'
import countryUtil from 'country-util'

// all props are passed by the List component
const Row = ({ index, style, data }) => {
  const { reshapedData, rows, rowLabels, indexBy, /* yAxis */} = data
  const rowKey = rows[index]
  const rowData = reshapedData[rowKey]
  const rowLabel = rowLabels[rowKey]
  // style is passed by the List component to give the correct dimensions to Row component
  return (
    <div style={style} key={index}>
      <RowChart
        key={index}
        first={index === 0}
        last={index === rows.length}
        data={rowData}
        indexBy={indexBy}
        {...style}
        label={rowLabel}
      />
    </div>
  )
}

Row.propTypes = {
  data: PropTypes.shape({
    indexBy: PropTypes.string,
    reshapedData: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]),
    rowLabels: PropTypes.object,
    rows: PropTypes.array,
  }),
  index: PropTypes.number,
  style: PropTypes.object,
}

const categoryCodesMap = getCategoryCodesMap()

const InputRowLabel = ({ input }) => {
  const trucatedInput = input
  return (
    <Box title={input} sx={{
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}>
      {trucatedInput}
    </Box>
  )
}

InputRowLabel.propTypes = {
  input: PropTypes.string,
}

const getRowLabel = (key, yAxis) => {
  switch (yAxis) {
  case 'probe_cc':
    return countryUtil.territoryNames[key]
  case 'category_code':
    return categoryCodesMap.get(key).name
  case 'input':
    return (<InputRowLabel input={key} />)
  default:
    return key
  }
}

const reshapeData = (data, query) => {
  const reshapedData = {}
  const rows = []
  const rowLabels = {}
  data.forEach((item) => {
    const key = item[query.axis_y]
    item['ok_count'] = item.measurement_count - item.confirmed_count - item.anomaly_count
    if (key in reshapedData) {
      reshapedData[key].push(item)
    } else {
      rows.push(key)
      reshapedData[key] = [item]
      rowLabels[key] = getRowLabel(key, query.axis_y)
    }
  })
  return [reshapedData, rows, rowLabels]
}

const GridChart = ({ data, query }) => {
  const { doneReshaping, doneRendering } = useDebugContext()

  const [reshapedData, rows, rowLabels] = useMemo(() => {
    const t0 = performance.now()
    const [reshapedData, rows, rowLabels] = reshapeData(data, query)
    const t1 = performance.now()
    doneReshaping(t0, t1)
    return [reshapedData, rows, rowLabels]
  }, [data, query])

  useEffect(() => {
    doneRendering(performance.now())
  })

  // FIX: Use the first row to generate the static xAxis outside the charts.
  //  * it is dependent on the width of the charts which is hard coded in `RowChart.js`
  //  * it may not work well if the first row has little or no data
  const sampleRow = reshapedData[rows[0]]

  return (
    <Flex flexDirection='column' sx={{ height: '100%'}}>
      {/* Fake axis on top of list. Possible alternative: dummy chart with axis and valid tickValues */}
      <Flex>
        <Box width={2/16}>
        </Box>
        <Flex pb={2} sx={{ width: '1000px', borderBottom: '1px solid black' }} justifyContent='space-between'>
          <Box>
            {sampleRow[0]['measurement_start_day']}
          </Box>
          <Box>
            {sampleRow[Math.floor(sampleRow.length/2)]['measurement_start_day']}
          </Box>
          <Box>
            {sampleRow[sampleRow.length-1]['measurement_start_day']}
          </Box>
        </Flex>
      </Flex>
      <AutoSizer>
        {({ width, height }) => (
          <List
            height={height}
            width={width}
            itemCount={rows.length}
            itemSize={72}
            itemData={{reshapedData, rows, rowLabels, indexBy: query.axis_x, yAxis: query.axis_y}}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </Flex>
  )
}

GridChart.propTypes = {
  data: PropTypes.array,
  query: PropTypes.object
}

export {
  GridChart
}