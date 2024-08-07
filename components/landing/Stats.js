/* global process */
import axios from 'axios'
import { colors } from 'ooni-components'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import useSWR from 'swr'
import {
  createContainer,
  LineSegment,
  VictoryAxis,
  VictoryChart,
  VictoryLegend,
  VictoryLine,
} from 'victory'

import Tooltip from '../country/Tooltip'
import FormattedMarkdown from '../FormattedMarkdown'
import VictoryTheme from '../VictoryTheme'
import { ChartLoader } from './ChartLoader'

const getMaxima = (data) => {
  let maxima
  data.forEach((d) => {
    if (typeof maxima === 'undefined' || maxima < d.value) {
      maxima = d.value
    }
  })
  return maxima
}

const BASE_URL = `${process.env.NEXT_PUBLIC_OONI_API}`

const dataFetcher = (query) => axios.get(BASE_URL + query).then((r) => r.data)

const swrOptions = {
  revalidateOnFocus: false,
}

const getLastMonthData = (collection) => {
  const cc = collection.filter((d) => {
    const dt = new Date(Date.parse(d.date))
    dt.setUTCMonth(dt.getUTCMonth() + 1)
    const today = new Date()
    return (
      dt.getUTCFullYear() === today.getUTCFullYear() &&
      today.getUTCMonth() === dt.getUTCMonth()
    )
  })
  return cc.length === 0 ? 0 : cc[0]?.value ?? 0
}

const CoverageChart = () => {
  const { data, isValidating } = useSWR(
    '/api/_/global_overview_by_month',
    dataFetcher,
    swrOptions,
  )

  const intl = useIntl()

  if (data) {
    const countryCoverage = data.countries_by_month.slice(0, -1)
    const networkCoverage = data.networks_by_month.slice(0, -1)
    const measurementsByMonth = data.measurements_by_month.slice(0, -1)

    // API responses are ordered by date, with most recent month at the end
    const lastMonth = {
      countryCount: getLastMonthData(data.countries_by_month),
      networkCount: getLastMonthData(data.networks_by_month),
      measurementCount: getLastMonthData(data.measurements_by_month),
    }

    // Determine the maximum value for each data set
    // Used to scale the charts on a y-axis shared with other charts
    const countryCoverageMaxima = getMaxima(countryCoverage)
    const networkCoverageMaxima = getMaxima(networkCoverage)
    const measurementMaxima = getMaxima(measurementsByMonth)

    const VictoryCursorVoronoiContainer = createContainer('cursor', 'voronoi')

    return (
      <>
        <div className="flex justify-center text-lg">
          <FormattedMarkdown
            id={'Home.MonthlyStats.SummaryText'}
            values={{
              // Added **'s to format the variables in bold text
              measurementCount: `**${intl.formatNumber(lastMonth.measurementCount)}**`,
              networkCount: `**${intl.formatNumber(lastMonth.networkCount)}**`,
              countryCount: `**${intl.formatNumber(lastMonth.countryCount)}**`,
            }}
          />
        </div>
        <VictoryChart
          height={250}
          width={800}
          theme={VictoryTheme}
          containerComponent={
            <VictoryCursorVoronoiContainer
              cursorComponent={
                <LineSegment
                  style={{
                    strokeDasharray: [6, 6],
                    stroke: colors.gray['500'],
                  }}
                />
              }
              voronoiDimension="x"
              labels={(d) => {
                if (d.childName === 'countryCoverage') {
                  return `${d.date}\n \nCountries: ${d.value}`
                }
                if (d.childName === 'networkCoverage') {
                  return `Networks: ${d.value}`
                }
                if (d.childName === 'measurementsByMonth') {
                  return `Measurements: ${d.value}`
                }
              }}
              labelComponent={<Tooltip />}
            />
          }
          domainPadding={{
            x: 0,
            y: 10,
          }}
        >
          <VictoryLegend
            centerTitle
            x={230}
            y={230}
            orientation="horizontal"
            gutter={40}
            data={[
              {
                name: 'Countries',
                symbol: {
                  type: 'minus',
                  fill: colors.blue['800'],
                },
              },
              {
                name: 'Networks',
                symbol: {
                  type: 'minus',
                  fill: colors.gray['700'],
                },
              },
              {
                name: 'Monthly Measurements',
                symbol: {
                  type: 'minus',
                  fill: colors.yellow['700'],
                },
              },
            ]}
          />
          <VictoryAxis
            tickCount={12}
            tickFormat={(t) => dayjs(t).format("MMM'YY")}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: {
                stroke: colors.blue['700'],
                strokeWidth: 2,
              },
            }}
            tickValues={[0, 0.5, 1]}
            tickFormat={(t) => Math.floor(t * countryCoverageMaxima)}
          />
          <VictoryLine
            name="countryCoverage"
            data={countryCoverage}
            x="date"
            y={(d) => d.value / countryCoverageMaxima}
            scale={{ x: 'time', y: 'linear' }}
            style={{
              data: {
                stroke: colors.blue['800'],
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            offsetX={400}
            style={{
              axis: {
                stroke: colors.gray['700'],
                strokeWidth: 2,
              },
            }}
            tickValues={[0, 0.5, 1]}
            // Hide tick value 0 for the axis in the middle of the chart
            tickFormat={(t) =>
              t > 0 ? Math.floor(t * networkCoverageMaxima) : ''
            }
          />
          <VictoryLine
            name="networkCoverage"
            data={networkCoverage}
            x="date"
            y={(d) => (d.value + 20) / networkCoverageMaxima}
            scale={{ x: 'time', y: 'linear' }}
            style={{
              data: {
                stroke: colors.gray['700'],
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            orientation="right"
            style={{
              axis: {
                stroke: colors.yellow['700'],
                strokeWidth: 2,
              },
            }}
            tickValues={[0, 0.5, 1]}
            tickFormat={(t) =>
              `${Math.round((t * measurementMaxima) / 1000, 2)}k`
            }
          />
          <VictoryLine
            name="measurementsByMonth"
            data={measurementsByMonth}
            x="date"
            y={(d) => (d.value + 20) / measurementMaxima}
            scale={{ x: 'time', y: 'linear' }}
            style={{
              data: {
                stroke: colors.yellow['700'],
              },
            }}
          />
        </VictoryChart>
      </>
    )
  }
  return <ChartLoader />
}

export default CoverageChart
