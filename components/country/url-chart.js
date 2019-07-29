import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Flex, Box, Link } from 'ooni-components'
import {
  VictoryChart,
  VictoryStack,
  VictoryBar,
  VictoryAxis,
  VictoryVoronoiContainer
} from 'victory'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import moment from 'moment'

import {
  colorNormal,
  colorError,
  colorConfirmed,
  colorAnomaly,
  colorEmpty
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

const WrappedText = styled.div`
  overflow-wrap: break-word;
  min-height: 2em;
`

const TruncatedURL = ({ url }) => {
  const MAX_URL_LENGTH = 60
  try {
    const urlObj = new URL(url)
    const domain = urlObj.origin
    const path = urlObj.pathname
    let endOfPath = path.split('/').pop()
    if (domain.length + endOfPath.length > MAX_URL_LENGTH) {
      endOfPath = endOfPath.substring(0, MAX_URL_LENGTH - domain.length) + '...'
    }
    return (
      <WrappedText>
        <abbr title={url}>
          {`${domain}${endOfPath.length > 5 ? '/...' : ''}/${endOfPath}`}
        </abbr>
      </WrappedText>
    )
  } catch (e) {
    return (
      <abbr title={url}>{url}</abbr>
    )
  }
}

const StyledChartRow = styled(Flex)`
  border: 1px solid ${props => props.theme.colors.gray3};
  border-radius: 5px;
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
    const { metadata, countryCode, network } = this.props
    const { data, minimized, fetching } = this.state
    const dataColorMap = {
      total_count: colorNormal,
      confirmed_count: colorConfirmed,
      anomaly_count: colorAnomaly,
      failure_count: colorError,
      empty: colorEmpty
    }

    if (fetching) {
      return (<SpinLoader />)
    }

    const today = moment().format('YYYY-MM-DD')
    const since30days = moment().subtract(30, 'days').format('YYYY-MM-DD')

    return (
      <StyledChartRow flexWrap='wrap' justifyContent='space-between' bg='gray0' my={3}>
        <Box width={16/16}>
          <Flex alignItems='center' flexWrap='wrap'>
            <Box width={[1, 1/4]} p={3}>
              <TruncatedURL url={metadata.input} />
              <Link
                href={`/search?test_name=web_connectivity&probe_cc=${countryCode}&probe_asn=${network}&input=${metadata.input}&since=${since30days}&until=${today}`}
              >
                <FormattedMessage id='Country.Websites.URLCharts.ViewMeasurements' />
              </Link>
              {/* TODO: Show percentages
                <Flex flexDirection='column'>
                  <FormattedMessage id='Country.Websites.URLCharts.Legend.Label.Blocked' />
                  <FormattedMessage id='Country.Websites.URLCharts.Legend.Label.Anomaly' />
                  <FormattedMessage id='Country.Websites.URLCharts.Legend.Label.Accessible' />
                </Flex>
              */}
            </Box>
            <Box width={[1, 3/4]}>
              {
                data &&
                <VictoryChart
                  // theme={VictoryTheme.material}
                  width={876}
                  height={70}
                  padding={{
                    left: 50,
                    right: 50,
                    top: 10,
                    bottom: 10
                  }}
                  scale={{x: 'time'}}
                  containerComponent={
                    <VictoryVoronoiContainer
                      voronoiDimension='x'
                    />
                  }
                >
                  <VictoryAxis
                    style={{
                      axis: { stroke: 'none' },
                      grid: { stroke: dataColorMap.empty }
                    }}
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
                      labelComponent={<Tooltip fontSize={14} />}
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
                              strokeWidth: (d, active) => active ? 4 : 0
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
      </StyledChartRow>
    )
  }
}

export default URLChart
