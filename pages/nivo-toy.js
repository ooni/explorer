/* global process */
import styled from 'styled-components'
import React from 'react'
import { useState, useEffect } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import MultiSelect from 'react-multi-select-component'
import { useForm } from 'react-hook-form'
import * as d3 from 'd3'
import axios from 'axios'

import Layout from '../components/Layout'
import {
  Container,
  Heading,
  Text, Hero,
  Flex, Box,
  Label
} from 'ooni-components'

const colorMap = {
  'confirmed_count': '#f03e3e', // red7,
  'anomaly_count': '#fab005', // yellow6
  'failure_count': '#ced4da', // gray4
  'measurement_count': '#51cf66' // green5
  // 'http-failure': '#e8590c', // orange8
}

const StyledLabel = styled(Label)`
  color: ${props => props.theme.colors.blue5};
  padding-top: 10px;
`
const colorFunc = (d) => colorMap[d.id] || '#ccc'

const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
const formatDay = d3.timeFormat("%Y-%m-%d")

const loadData = async (params) => {
  const response = await axios.get('https://api.ooni.io/api/v1/aggregation', {
    'params': params
  })
  return response
}

const StackedBarChart = ({data, cols, indexBy}) => (
    <ResponsiveBar
      data={data}
      keys={cols}
      indexBy={indexBy}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      colors={colorFunc}
      borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'day',
        legendPosition: 'middle',
        legendOffset: 32
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'msmt count',
        legendPosition: 'middle',
        legendOffset: -40
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
)

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
  console.log(resp)
  return {
    data: resp.data.result,
    dimensionCount: resp.data.dimension_count,
    url: resp.request.responseURL,
    cols,
    indexBy
  }
}
const Chart = () => {
    const optionsAxis = [
      'measurement_start_day',
      'domain',
      'category_code',
      'probe_cc',
      'probe_asn',
      ''
    ]

    const [chartMeta, setChartMeta] = useState(null)
    const [loadTime, setLoadTime] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedAxisX, setAxisX] = useState([
      {'label': 'measurement_start_day', 'value': 'measurement_start_day'}
    ])
    const [selectedAxisY, setAxisY] = useState([]);
    const { register, handleSubmit, watch, errors } = useForm()

    const onSubmit = (data) => {
      setChartMeta(null)
      console.log(data)
      let indexBy = 'measurement_start_day'
      let test_name = 'web_connectivity'
      let probe_cc = 'IT'
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
        <Container>
          <form onSubmit={handleSubmit(onSubmit)} class="form-container">
            <Flex flexWrap='wrap'>
              <Box width={1/3}>
                <StyledLabel>
                  probe_cc
                </StyledLabel>
                <input name="probe_cc" ref={register} />
              </Box>
              <Box width={1/3}>
                <StyledLabel>
                  probe_asn
                </StyledLabel>
                <input name="probe_asn" ref={register} />
              </Box>
              <Box width={1/3}>
                <StyledLabel>
                  test_name
                </StyledLabel>
                <input name="test_name" defaultValue='web_connectivity' ref={register} />
              </Box>
              <Box width={1/3}>
                <StyledLabel>
                  since
                </StyledLabel>
              <input name="since" defaultValue='2020-05-01' ref={register} />
              </Box>
              <Box width={1/3}>
                <StyledLabel>
                  until 
                </StyledLabel>
                <input name="until" defaultValue='2020-06-01' ref={register} />
              </Box>
              <Box width={1/3}>
                <StyledLabel>
                  domain
                </StyledLabel>
                <input name="domain" ref={register} />
              </Box>
              <Box width={1/3}>
                <StyledLabel>
                  category_code
                </StyledLabel>
                <input name="category_code" ref={register} />
              </Box>
              <Box width={1/3}>
                <StyledLabel>
                  axis_x
                </StyledLabel>
              <select name="axis_x" ref={register} defaultValue='measurement_start_day'>
                {optionsAxis.map(option => (<option value={option}>{option}</option>))}
              </select>
              </Box>
              <Box width={1/3}>
                <StyledLabel>
                  axis_y
                </StyledLabel>
              <select name="axis_y" ref={register} defaultValue=''>
                {optionsAxis.map(option => (<option value={option}>{option}</option>))}
              </select>
              </Box>
              <Box width={1/3}>
              <input type="submit" />
              </Box>
            </Flex>

          </form>
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

export default Chart