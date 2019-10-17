import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryVoronoiContainer
} from 'victory'
import { theme } from 'ooni-components'

import { inCountry } from './country-context'
import Tooltip from './tooltip'
import { AppsChartLoader } from './WebsiteChartLoader'

class AppsStatChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      fetching: true
    }
  }

  componentDidMount() {
    this.fetchAppNetworkStats()
  }

  async fetchAppNetworkStats() {
    const { countryCode, app, asn } = this.props
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const result = await client.get('/api/_/im_stats', {
      params: {
        probe_cc: countryCode,
        probe_asn: asn,
        test_name: app
      }
    })

    this.setState({
      data: result.data.results,
      fetching: false
    })
  }

  render() {
    const { data, fetching } = this.state

    if (fetching) {
      return (<AppsChartLoader />)
    }

    const yMax = data.reduce((max, item) => (
      (item.total_count > max) ? item.total_count : max
    ), 0)

    return (
      <React.Fragment>
        <VictoryChart
          scale={{x: 'time'}}
          width={900}
          height={70}
          padding={{
            top: 10,
            bottom: 10,
            left: 40,
            right: 40
          }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension='x'
            />
          }
        >
          <VictoryAxis
            style={{ axis: { stroke: 'none'}}}
            tickFormat={() => {}}
          />
          <VictoryBar
            data={data}
            x='test_day'
            y={() => yMax}
            style={{
              data: {
                fill: theme.colors.gray3,
              }
            }}
          />
          <VictoryBar
            data={data}
            x='test_day'
            y='total_count'
            style={{
              data: {
                fill: theme.colors.gray8
              }
            }}
            labels={(d) => {
              let s = `${new Date(d.test_day).toLocaleDateString()}`
              s += `\n${d.total_count} Total`
              return s
            }}
            labelComponent={<Tooltip fontSize={14} />}
          />
        </VictoryChart>
      </React.Fragment>
    )
  }
}

export default inCountry(AppsStatChart)
