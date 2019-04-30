import React from 'react'
import PropTypes from 'prop-types'
import {
  VictoryTheme,
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryVoronoiContainer
} from 'victory'
import axios from 'axios'
import moment from 'moment'
import { theme } from 'ooni-components'

import SpinLoader from '../vendor/spin-loader'
import Tooltip from '../country/tooltip'

class CoverageChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      fetching: true
    }
  }
  componentDidMount() {
    this.fetchCoverageStats()
  }

  async fetchCoverageStats () {
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const result = await client.get('/api/_/countries_by_month')

    this.setState({
      data: result.data,
      fetching: false
    })
  }

  render() {
    const { data, fetching } = this.state
    if (fetching) {
      return (<SpinLoader />)
    }

    let countryCoverageMaxima

    data.forEach((d) => {
      if (typeof countryCoverageMaxima === 'undefined'
          || countryCoverageMaxima < d.value) {
        countryCoverageMaxima = d.value
      }
    })

    return (
      <VictoryChart
        theme={VictoryTheme.material}
        height={300}
        width={800}
        containerComponent={
          <VictoryVoronoiContainer
            voronoiDimension='x'
            labels={(d) => d.value}
            labelComponent={<Tooltip />}
          />
        }
        domainPadding={20}
      >
        <VictoryAxis
          tickCount={12}
          tickFormat={(t) => moment(t).format('MMM[\']YY')}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => Math.floor(t * countryCoverageMaxima)}
        />
        <VictoryLine
          data={data}
          x='date'
          y={(d) => d.value / countryCoverageMaxima}
          scale={{ x: 'time', y: 'linear' }}
          // labels={(d) => moment(d.date).format('LL')}
          // labelComponent={<Tooltip />}
          style={{
            data: {
              stroke: theme.colors.blue8
            }
          }}
        />
      </VictoryChart>
    )
  }
}

export { CoverageChart }
