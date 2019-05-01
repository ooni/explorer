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
import { Flex, Heading, Text, theme } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import SpinLoader from '../vendor/spin-loader'
import Tooltip from '../country/tooltip'
import FormattedMarkdown from '../formatted-markdown'

const getMaxima = (data) => {
  let maxima
  data.forEach((d) => {
    if (typeof maxima === 'undefined'
        || maxima < d.value) {
      maxima = d.value
    }
  })
  return maxima
}

class CoverageChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      countryCoverage: null,
      networkCoverage: null,
      runsByMonth: null,
      fetching: true
    }
  }
  componentDidMount() {
    this.fetchCoverageStats()
  }

  async fetchCoverageStats () {
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const [countryCoverage, networkCoverage, runsByMonth] = await Promise.all([
      client.get('/api/_/countries_by_month'),
      client.get('/api/_/asn_by_month'),
      client.get('/api/_/runs_by_month')
    ])

    this.setState({
      countryCoverage: countryCoverage.data,
      networkCoverage: networkCoverage.data,
      runsByMonth: runsByMonth.data,
      fetching: false
    })
  }

  render() {
    const { countryCoverage, networkCoverage, runsByMonth, fetching } = this.state
    if (fetching) {
      return (<SpinLoader />)
    }

    // API responses are ordered by date, with most recent month at the end
    const lastMonth = {
      countryCount: countryCoverage[countryCoverage.length - 1].value,
      networkCount: networkCoverage[networkCoverage.length - 1].value,
      runCount: runsByMonth[runsByMonth.length - 1].value
    }

    // Determine the maximum value for each data set
    // Used to scale the charts on a y-axis shared with other charts
    const countryCoverageMaxima = getMaxima(countryCoverage)
    const networkCoverageMaxima = getMaxima(networkCoverage)
    const runsMaxima = getMaxima(runsByMonth)

    return (
      <React.Fragment>
        <Flex justifyContent='center' my={3}>
          <Heading h={2} color='blue7'>
            <FormattedMessage id={'Home.MonthlyStats.Title'} />
          </Heading>
        </Flex>
        <Flex justifyContent='center'>
          <Text fontSize={18}>
            <FormattedMarkdown id={'Home.MonthlyStats.SummaryText'}
              values={{
                runCount: lastMonth.runCount,
                networkCount: lastMonth.networkCount,
                countryCount: lastMonth.countryCount
              }}
            />
          </Text>
        </Flex>
        <VictoryChart
          height={250}
          width={800}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension='x'
              labels={(d) => {
                if (d.childName === 'countryCoverage') {
                  return `${d.date}\n \nCountries: ${d.value}`
                } else if (d.childName === 'networkCoverage') {
                  return `Networks: ${d.value}`
                } else if (d.childName === 'runsByMonth') {
                  return `Runs: ${d.value}`
                }
              }}
              labelComponent={<Tooltip />}
            />
          }
          domainPadding={{
            x: 0, y: 10
          }}
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
                  type: 'minus', fill: theme.colors.gray7
                }
              },
              {
                name: 'Monthly Runs',
                symbol: {
                  type: 'minus', fill: theme.colors.yellow7
                }
              }
            ]}
          />
          <VictoryAxis
            tickCount={12}
            tickFormat={(t) => moment(t).format('MMM[\']YY')}
            style={{
              tickLabels: {
                fontFamily: 'Fira Sans'
              }
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: {
                stroke : theme.colors.blue7,
                strokeWidth: 2
              },
              tickLabels: {
                fontFamily: 'Fira Sans'
              }
            }}
            tickValues={[0, 0.5, 1]}
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
            offsetX={400}
            style={{
              axis: {
                stroke : theme.colors.gray7,
                strokeWidth: 2
              },
              tickLabels: {
                fontFamily: 'Fira Sans'
              }
            }}
            tickValues={[0, 0.5, 1]}
            // Hide tick value 0 for the axis in the middle of the chart
            tickFormat={(t) => t > 0 ? Math.floor(t * networkCoverageMaxima) : ''}
          />
          <VictoryLine
            name='networkCoverage'
            data={networkCoverage}
            x='date'
            y={(d) => (d.value + 20) / networkCoverageMaxima}
            scale={{ x: 'time', y: 'linear' }}
            style={{
              data: {
                stroke: theme.colors.gray7
              }
            }}
          />
          <VictoryAxis
            dependentAxis
            orientation='right'
            style={{
              axis: {
                stroke : theme.colors.yellow7,
                strokeWidth: 2
              },
              tickLabels: {
                fontFamily: 'Fira Sans'
              }
            }}
            tickValues={[0, 0.5, 1]}
            tickFormat={(t) => `${Math.round(t * runsMaxima/1000, 2)}k`}
          />
          <VictoryLine
            name='runsByMonth'
            data={runsByMonth}
            x='date'
            y={(d) => (d.value + 20) / runsMaxima}
            scale={{ x: 'time', y: 'linear' }}
            style={{
              data: {
                stroke: theme.colors.yellow7
              }
            }}
          />
        </VictoryChart>
      </React.Fragment>
    )
  }
}

export { CoverageChart }
