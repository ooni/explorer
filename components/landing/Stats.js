/* global process */
import axios from 'axios'
import { colors } from 'ooni-components'
import { useIntl } from 'react-intl'
import useSWR from 'swr'
import { ResponsiveLine } from '@nivo/line'

import FormattedMarkdown from '../FormattedMarkdown'
import { ChartLoader } from './ChartLoader'

import { scaleLinear } from 'd3-scale'

const chartColors = {
  countries_by_month: colors.blue['800'],
  networks_by_month: colors.gray['700'],
  measurements_by_month: colors.yellow['700'],
}

const chartLabels = {
  countries_by_month: 'Countries',
  networks_by_month: 'Networks',
  measurements_by_month: 'Monthly Measurements',
}

export const MultiAxisLayer = ({ innerWidth, innerHeight, data }) => {
  const countriesMax = Math.max(...data[0].data.map((d) => d.value))
  const networksMax = Math.max(...data[1].data.map((d) => d.value))
  const measurementsMax = Math.max(...data[2].data.map((d) => d.value))

  // Scales for the 3 axes
  const yCountries = scaleLinear()
    .domain([0, countriesMax])
    .range([innerHeight, 0])
  const yNetworks = scaleLinear()
    .domain([0, networksMax])
    .range([innerHeight, 0])
  const yMeasurements = scaleLinear()
    .domain([0, measurementsMax])
    .range([innerHeight, 0])

  // Helper to draw a simple custom axis anywhere
  const renderAxis = (
    scale,
    { x, color = '#666', format = (v) => v, labelPosition = 'right', maxValue },
  ) => {
    // Manually define the 3 tick values
    const tickValues = [0, Math.round(maxValue / 2), maxValue]

    return (
      <g transform={`translate(${x},0)`} style={{ pointerEvents: 'none' }}>
        <line
          x1={0}
          x2={0}
          y1={0}
          y2={innerHeight}
          stroke={color}
          strokeWidth={2}
        />

        {tickValues.map((t) => (
          <g key={t} transform={`translate(0,${scale(t)})`}>
            <text
              x={labelPosition === 'left' ? -9 : 9}
              dy="0.32em"
              fontSize={11}
              fill="black"
              textAnchor={labelPosition === 'left' ? 'end' : 'start'}
            >
              {format(t)}
            </text>
          </g>
        ))}
      </g>
    )
  }

  return (
    <g>
      {/* Left axis: countries */}
      {renderAxis(yCountries, {
        x: 0,
        color: chartColors.countries_by_month,
        labelPosition: 'left',
        maxValue: countriesMax,
      })}

      {/* Middle axis: networks  */}
      {renderAxis(yNetworks, {
        x: innerWidth / 2,
        color: chartColors.networks_by_month,
        labelPosition: 'left',
        maxValue: networksMax,
      })}

      {/* Right axis: measurements */}
      {renderAxis(yMeasurements, {
        x: innerWidth,
        color: chartColors.measurements_by_month,
        format: (v) => `${Math.round(v / 1000)}k`,
        maxValue: measurementsMax,
      })}
    </g>
  )
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
  return cc.length === 0 ? 0 : (cc[0]?.value ?? 0)
}

const CoverageChart = () => {
  const { data, isValidating } = useSWR(
    '/api/_/global_overview_by_month',
    dataFetcher,
    swrOptions,
  )

  const intl = useIntl()

  if (data) {
    const chartData = [
      'countries_by_month',
      'networks_by_month',
      'measurements_by_month',
    ].map((key) => ({
      id: key,
      data: data[key].slice(0, -1).map((d) => ({
        x: d.date.split('T')[0],
        y: d.value / Math.max(...data[key].map((item) => item.value)),
        value: d.value,
      })),
    }))

    // API responses are ordered by date, with most recent month at the end
    const lastMonth = {
      countryCount: getLastMonthData(data.countries_by_month),
      networkCount: getLastMonthData(data.networks_by_month),
      measurementCount: getLastMonthData(data.measurements_by_month),
    }

    return (
      <>
        <div className="flex justify-center text-lg">
          <FormattedMarkdown
            id={'Home.MonthlyStats.SummaryText'}
            values={{
              measurementCount: `**${intl.formatNumber(lastMonth.measurementCount)}**`,
              networkCount: `**${intl.formatNumber(lastMonth.networkCount)}**`,
              countryCount: `**${intl.formatNumber(lastMonth.countryCount)}**`,
            }}
          />
        </div>
        <div className="w-full h-[350px]">
          <ResponsiveLine
            data={chartData}
            layers={[
              'axes',
              'crosshair',
              'lines',
              'slices',
              'legends',
              MultiAxisLayer,
            ]}
            colors={(d) => chartColors[d.id]}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{
              type: 'time',
              format: '%Y-%m-%d',
              precision: 'day',
              useUTC: true,
            }}
            xFormat="time:%Y-%m-%d"
            axisLeft={null}
            axisBottom={{
              format: "%b'%y",
              tickPadding: 20,
              tickSize: 0,
            }}
            legends={[
              {
                data: chartData.map((d) => ({
                  id: d.id,
                  label: chartLabels[d.id],
                  color: chartColors[d.id],
                })),
                anchor: 'bottom',
                direction: 'row',
                itemWidth: 170,
                itemHeight: 20,
                itemsSpacing: 4,
                symbolSize: 10,
                symbolShape: 'circle',
                itemTextColor: '#777',
                translateY: 54,
              },
            ]}
            enableSlices="x"
            sliceTooltip={({ slice }) => {
              return (
                <div className="text-white text-xs bg-gray-800 p-2 rounded-md font-light">
                  <div>{slice.points[0].data.xFormatted}</div>
                  {slice.points
                    .slice()
                    .reverse()
                    .map((point) => (
                      <div key={point.id}>
                        {chartLabels[point.serieId]}: {point.data.value}
                      </div>
                    ))}
                </div>
              )
            }}
          />
        </div>
      </>
    )
  }
  return <ChartLoader />
}

export default CoverageChart
