import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTooltip
} from 'victory'
import { theme } from 'ooni-components'

import { inCountry } from './country-context'
import SpinLoader from '../vendor/spin-loader'

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
      return (<SpinLoader />)
    }

    const yMax = data.reduce((max, item) => (
      (item.total_count > max) ? item.total_count : max
    ), 0)

    return (
      <React.Fragment>
        <VictoryChart
          scale={{x: 'time'}}
          height={150}
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
                fill: theme.colors.green8
              }
            }}
            labels={(d) => d.total_count}
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>
      </React.Fragment>
    )
  }
}

export default inCountry(AppsStatChart)
