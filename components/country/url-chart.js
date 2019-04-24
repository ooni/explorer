import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Flex, Box } from 'ooni-components'
import {
  VictoryChart,
  VictoryStack,
  VictoryBar,
  VictoryAxis,
  VictoryVoronoiContainer
} from 'victory'

import { theme } from 'ooni-components'
import styled from 'styled-components'

import {
  colorNormal,
  colorError,
  colorConfirmed,
  colorAnomaly
} from '../colors'

import Tooltip from './tooltip'

import SpinLoader from '../vendor/spin-loader'

const Circle = styled.div`
  position: relative;
  top: 0;
  right: 0;
  background-color: ${props => props.theme.colors.gray3};
  padding: 6px;
  border-radius: 50%;
  :hover {
    background-color: ${props => props.theme.colors.gray4};
  }
`
/* CSS Triangle from CSS-Tricks: https://css-tricks.com/snippets/css/css-triangle/#article-header-id-1 */
// TOOD: Improve toggle using transforms and animation
const Triangle = styled.div`
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: ${props => props.down ? '12px solid ' + props.theme.colors.gray7 : 'none'};
  border-bottom: ${props => !props.down ? '12px solid ' + props.theme.colors.gray7 : 'none'};
`

const ToggleMinimizeButton = ({ minimized, onToggle }) => (
  <Circle onClick={onToggle}><Triangle down={minimized} /></Circle>
)

const defaultState = {
  data: null,
  minimized: true,
  fetching: true
}

class URLChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = defaultState
    this.onToggleMinimize = this.onToggleMinimize.bind(this)
  }

  onToggleMinimize() {
    this.setState((state) => ({
      minimized: !state.minimized
    }))
  }

  componentDidMount() {
    this.fetchURLChartData()
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.data === null) {
      this.fetchURLChartData()
    }
  }

  async fetchURLChartData() {
    const { metadata, network, countryCode } = this.props
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const result = await client.get('/api/_/website_stats', {
      params: {
        probe_cc: countryCode,
        probe_asn: network,
        input: metadata.input
      }
    })
    this.setState({
      data: result.data.results,
      fetching: false
    })
  }

  static getDerivedStateFromProps(props, state) {
    if (props.metadata.input !== state.prevTestUrl) {
      return {
        prevTestUrl: props.metadata.input,
        ...defaultState
      }
    }
    return null
  }

  render() {
    const { metadata } = this.props
    const { data, minimized, fetching } = this.state
    const dataColorMap = {
      total_count: colorNormal,
      confirmed_count: colorConfirmed,
      anomaly_count: colorAnomaly,
      failure_count: colorError
    }

    if (fetching) {
      return (<SpinLoader />)
    }

    return (
      <Flex flexWrap='wrap' justifyContent='space-between'>
        <Box width={15/16}>
          <Flex alignItems='center'>
            <Box width={1/4}>
              {metadata.input}
              {/* TODO: Show percentages
                <Flex flexDirection='column'>
                  <FormattedMessage id='Country.Websites.URLCharts.Legend.Label.Blocked' />
                  <FormattedMessage id='Country.Websites.URLCharts.Legend.Label.Anomaly' />
                  <FormattedMessage id='Country.Websites.URLCharts.Legend.Label.Accessible' />
                </Flex>
              */}
            </Box>
            <Box width={3/4}>
              {
                data &&
                <VictoryChart
                  // theme={VictoryTheme.material}
                  scale={{x: 'time'}}
                  height={150}
                  containerComponent={
                    <VictoryVoronoiContainer
                      responsive={false}
                      voronoiDimension='x'
                    />
                  }
                >
                  <VictoryAxis
                    style={{ axis: { stroke: 'none'}}}
                    tickFormat={() => {}}
                  />
                  <VictoryStack>
                    <VictoryBar
                      labels={(d) => {
                        let s = `${new Date(d.test_day).toLocaleDateString()}`
                        if (d.confirmed_count > 0) {
                          s += `\n${d.confirmed_count} Confirmed`
                        }
                        if (d.anomaly_count > 0) {
                          s += `\n${d.anomaly_count} Anomalies`
                        }
                        if (d.failure_count > 0) {
                          s += `\n${d.failure_count} Failures`
                        }
                        s += `\n${d.total_count} Total`
                        return s
                      }}
                      labelComponent={<Tooltip width={100} />}
                      data={data}
                      x='test_day'
                      y={(d) => (d.total_count - d.confirmed_count - d.anomaly_count - d.failure_count)}
                      style={{
                        data: {
                          fill: dataColorMap.total_count,
                        }
                      }}
                    />
                    {
                      ['confirmed_count', 'anomaly_count', 'failure_count'].map((type, index) => (
                        <VictoryBar
                          key={index}
                          data={data}
                          x='test_day'
                          y={type}
                          style={{
                            data: {
                              fill: dataColorMap[type],
                              strokeWidth: (d, active) => active ? 4 : 1
                            }
                          }}
                        />
                      ))
                    }
                  </VictoryStack>
                </VictoryChart>
              }
            </Box>
          </Flex>
        </Box>
        {/*
          <Box mt={4}>
          <ToggleMinimizeButton minimized={minimized} onToggle={this.onToggleMinimize} />
          </Box>
        */}
      </Flex>
    )
  }
}

export default URLChart
