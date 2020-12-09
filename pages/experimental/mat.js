import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import {
  Container,
  Heading,
  Flex, Box,
} from 'ooni-components'

import Layout from '../../components/Layout'
import NavBar from '../../components/NavBar'
import { StackedBarChart } from '../../components/aggregation/mat/Charts'
import { Form } from '../../components/aggregation/mat/Form'

const loadData = async (params) => {
  const response = await axios.get('https://api.ooni.io/api/v1/aggregation', {
    'params': params
  })
  return response
}


const getChartMetadata = async (params) => {
  let cols = [
    'anomaly_count',
    'confirmed_count',
    'failure_count',
    'measurement_count',
  ]
  let indexBy = ''
  cols.push(params['axis_x'])
  indexBy = params['axis_x']
  let resp = await loadData(params)
  return {
    data: resp.data.result,
    dimensionCount: resp.data.dimension_count,
    url: resp.request.responseURL,
    cols,
    indexBy
  }
}

const MeasurementAggregationToolkit = () => {

  const [chartMeta, setChartMeta] = useState(null)
  const [loadTime, setLoadTime] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedAxisX, setAxisX] = useState([
    {'label': 'measurement_start_day', 'value': 'measurement_start_day'}
  ])
  const [selectedAxisY, setAxisY] = useState([]);

  const onSubmit = (data) => {
    setChartMeta(null)
    let params = {}
    for (const p of Object.keys(data)) {
      if (data[p] !== '') {
        params[p] = data[p]
      }
    }
    const startTime = new Date().getTime()
    setLoading(true)
    getChartMetadata(params).then(meta => {
      setLoading(false)
      setLoadTime((new Date().getTime()) - startTime)
      setChartMeta(meta)
    })
  }

  return (
    <Layout>
      <NavBar />
      <Container>
        <Heading h={1} my={4}>OONI Measurement Aggregation Toolkit</Heading>
        <Form onSubmit={onSubmit} />
        <Flex flexWrap='wrap'>
          <Box width={1}>
            {loading && <h2>Loading ...</h2>}
          </Box>
          <Box width={1} style={{height: '80vh'}}>
            {chartMeta && chartMeta.dimensionCount == 1 &&
              <StackedBarChart loadTime={chartMeta.loadTime} data={chartMeta.data} cols={chartMeta.cols} indexBy={chartMeta.indexBy} />
            }
            {chartMeta && chartMeta.dimensionCount > 1 &&
              <div>Multidimensional chart</div>
            }
          </Box>
          <Box width={1}>
            {chartMeta && chartMeta.url}
            {chartMeta && ` (dimensions: ${chartMeta.dimensionCount})`}
          </Box>
          <Box width={1}>
            {loadTime && <span>Load time: {loadTime} ms</span>}
          </Box>
        </Flex>
      </Container>
    </Layout>
  )
}

export default MeasurementAggregationToolkit
