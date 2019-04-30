import React from 'react'
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryLegend
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
      countryCoverage: null,
      networkCoverage: null,
      fetching: true
    }
  }
  componentDidMount() {
    this.fetchCoverageStats()
  }

  async fetchCoverageStats () {
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const [countryCoverage, networkCoverage] = await Promise.all([
      client.get('/api/_/countries_by_month'),
      client.get('/api/_/asn_by_month')
    ])

    this.setState({
      countryCoverage: countryCoverage.data,
      networkCoverage: networkCoverage.data,
      fetching: false
    })
  }

  render() {
    const { countryCoverage, networkCoverage, fetching } = this.state
    if (fetching) {
      return (<SpinLoader />)
    }

    let countryCoverageMaxima, networkCoverageMaxima

    countryCoverage.forEach((d) => {
      if (typeof countryCoverageMaxima === 'undefined'
          || countryCoverageMaxima < d.value) {
        countryCoverageMaxima = d.value
      }
    })
    networkCoverage.forEach((d) => {
      if (typeof networkCoverageMaxima === 'undefined'
          || networkCoverageMaxima < d.value) {
        networkCoverageMaxima = d.value
      }
    })

    return (
      <VictoryChart
        height={300}
        width={800}
        containerComponent={
          <VictoryVoronoiContainer
            voronoiDimension='x'
            labels={(d) => {
              if (d.childName === 'countryCoverage') {
                return `${d.date}\n \nCountries: ${d.value}`
              } else if (d.childName === 'networkCoverage') {
                return `Networks: ${d.value}`
              }
            }}
            labelComponent={<Tooltip />}
          />
        }
        domainPadding={20}
      >
        <VictoryLegend
          centerTitle
          x={300}
          y={280}
          orientation='horizontal'
          gutter={40}
          data={[
            { name: 'Countries',
              symbol: {
                type: 'minus', fill: theme.colors.blue8
              }
            },
            {
              name: 'Networks',
              symbol: {
                type: 'minus', fill: theme.colors.blue4
              }
            }
          ]}
        />
        <VictoryAxis
          tickCount={12}
          tickFormat={(t) => moment(t).format('MMM[\']YY')}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => Math.floor(t * countryCoverageMaxima)}
        />
        <VictoryLine
          name='countryCoverage'
          data={countryCoverage}
          x='date'
          y={(d) => d.value / countryCoverageMaxima}
          scale={{ x: 'time', y: 'linear' }}
          style={{
            data: {
              stroke: theme.colors.blue8
            }
          }}
        />
        <VictoryAxis
          dependentAxis
          orientation='right'
          tickFormat={(t) => Math.floor(t * networkCoverageMaxima)}
        />
        <VictoryLine
          name='networkCoverage'
          data={networkCoverage}
          x='date'
          y={(d) => (d.value + 20) / networkCoverageMaxima}
          scale={{ x: 'time', y: 'linear' }}
          style={{
            data: {
              stroke: theme.colors.blue4
            }
          }}
        />
      </VictoryChart>
    )
  }
}

export { CoverageChart }
