import { ResponsiveLine } from '@nivo/line'
import { colors } from 'ooni-components'
import type { Changepoint } from 'components/alerts/list'
import { scaleUtc } from 'd3-scale'

type AnalysisResult = {
  measurement_start_day: string
  loni: {
    dns_blocked?: number
    dns_down?: number
    dns_ok?: number
    tcp_blocked?: number
    tcp_down?: number
    tcp_ok?: number
    tls_blocked?: number
    tls_down?: number
    tls_ok?: number
    [key: string]: number | string | string[] | undefined
  }
  [key: string]: unknown
}

type ChartDataPoint = {
  x: string
  y: number
}

type ChartSeries = {
  id: string
  data: ChartDataPoint[]
}

/**
 * Transforms an array of analysis results into chart data format for nivo line charts
 * @param results Array of analysis result objects
 * @param metrics Optional array of metric keys to extract from loni object. If not provided, extracts all numeric metrics.
 * @returns Array of chart series objects with id and data arrays
 */
export const transformAnalysisToChartData = (
  results: AnalysisResult[],
  metrics?: string[],
): ChartSeries[] => {
  if (!results || results.length === 0) {
    return []
  }

  // If metrics not specified, extract all numeric metrics from loni object
  const metricsToExtract =
    metrics ||
    Object.keys(results[0]?.loni || {}).filter(
      (key) =>
        typeof results[0]?.loni?.[key] === 'number' &&
        !key.includes('outcome') &&
        key !== 'blocked_max',
    )
  console.log(metricsToExtract)
  // Group data by metric
  const seriesMap = new Map<string, ChartDataPoint[]>()

  for (const result of results) {
    const { measurement_start_day, loni } = result

    if (!loni || !measurement_start_day) {
      continue
    }

    for (const metric of metricsToExtract) {
      const value = loni[metric]

      if (typeof value === 'number') {
        if (!seriesMap.has(metric)) {
          seriesMap.set(metric, [])
        }

        const dataPoints = seriesMap.get(metric)
        if (dataPoints) {
          dataPoints.push({
            x: measurement_start_day,
            y: value,
          })
        }
      }
    }
  }

  // Convert map to array format
  return Array.from(seriesMap.entries()).map(([id, data]) => ({
    id,
    data: data.sort((a, b) => a.x.localeCompare(b.x)), // Sort by date
  }))
}

const ChangepointLines = ({
  changepoints,
  innerHeight,
  // marginTop,
  innerWidth,
  series,
}: {
  changepoints: Changepoint[] | undefined
  innerHeight: number
  // marginTop: number
  innerWidth: number
  series: ReadonlyArray<{ data: ReadonlyArray<{ data: { x: string | Date } }> }>
}) => {
  if (
    !changepoints ||
    changepoints.length === 0 ||
    !series ||
    series.length === 0
  ) {
    return null
  }

  // Get all x values from the series to determine the domain
  const allXValues = series.flatMap((s) =>
    s.data.map((point: { data: { x: string | Date } }) => point.data.x),
  )
  if (allXValues.length === 0) {
    return null
  }

  // Parse dates and find min/max for the scale domain
  const dates = allXValues.map((x) => {
    // Handle both date strings and Date objects
    if (typeof x === 'string') {
      return new Date(x.endsWith('Z') ? x : `${x}T00:00:00Z`)
    }
    return x instanceof Date ? x : new Date(x)
  })

  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))

  // Create a UTC time scale matching the chart's configuration
  const xScale = scaleUtc().domain([minDate, maxDate]).range([0, innerWidth])

  return (
    <g>
      {changepoints.map((changepoint) => {
        const startDate = new Date(changepoint.start_time)

        const x = xScale(startDate)

        if (Number.isNaN(x) || x < 0 || x > innerWidth) {
          return null
        }

        return (
          <line
            key={changepoint.id}
            x1={x}
            y1={0}
            x2={x}
            y2={innerHeight}
            stroke={
              changepoint.change_dir === 'up'
                ? colors.red['700']
                : colors.green['700']
            }
            strokeWidth={2}
            strokeDasharray="4 4"
            opacity={0.7}
          />
        )
      })}
    </g>
  )
}

const Chart = ({
  data,
  changepoints,
}: { data: ChartSeries[]; changepoints: Changepoint[] | undefined }) => {
  const colorMap: Record<string, string> = {
    tls_blocked: colors.fuchsia['600'],
    dns_blocked: colors.orange['600'],
    tcp_blocked: colors.cyan['500'],
  }

  const getColor = (series: ChartSeries) => {
    return colorMap[series.id] || '#888'
  }

  return (
    <div className="w-full h-[500px]">
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 70, left: 30 }}
        enablePoints={false}
        lineWidth={2}
        colors={getColor}
        xScale={{
          type: 'time',
          format: '%Y-%m-%dT%H:%M:%SZ',
          precision: 'hour',
          useUTC: true,
        }}
        yScale={{
          type: 'linear',
          stacked: false,
          min: 0,
          max: 1,
        }}
        axisBottom={{
          format: '%Y-%m-%d',
        }}
        enableSlices="x"
        layers={[
          'grid',
          'axes',
          'lines',
          ({ innerHeight, innerWidth, series }) => (
            <ChangepointLines
              changepoints={changepoints}
              innerHeight={innerHeight}
              // marginTop={margin.top ?? 0}
              innerWidth={innerWidth}
              series={series}
            />
          ),
          'slices',
          'legends',
          'crosshair',
        ]}
        sliceTooltip={(props) => {
          if (props?.slice?.points?.length) {
            const points = props.slice.points
            const date = new Date(points[0].data.x)
            return (
              <div
                style={{
                  background: 'white',
                  padding: '9px 12px',
                  border: '1px solid #ccc',
                  minWidth: '300px',
                }}
              >
                <div className="mb-2 font-bold">
                  {date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC',
                    timeZoneName: 'short',
                  })}
                </div>
                {points.map((point) => (
                  <div className="flex items-center" key={point.id}>
                    <div
                      key={point.id}
                      style={{
                        backgroundColor: point.seriesColor,
                        padding: '3px 0',
                        width: '10px',
                        height: '10px',
                      }}
                    />
                    <div className="ml-2">
                      <strong>{point.seriesId}</strong> [
                      {Number(point.data.yFormatted).toFixed(4)}]
                    </div>
                  </div>
                ))}
              </div>
            )
          }
          return null
        }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle',
            itemTextColor: '#777',
          },
        ]}
      />
    </div>
  )
}

const AlertChart = ({
  analysis,
  changepoints,
}: {
  analysis: AnalysisResult | AnalysisResult[]
  changepoints: []
}) => {
  // console.log(changepoints)
  const resultsArray = Array.isArray(analysis) ? analysis : [analysis]
  const chartData = transformAnalysisToChartData(resultsArray, [
    'dns_blocked',
    'tcp_blocked',
    'tls_blocked',
  ])

  return (
    <div>
      <Chart data={chartData} changepoints={changepoints} />
      {/* <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-sm">
        {JSON.stringify(chartData, null, 2)}
      </pre> */}
    </div>
  )
}

export default AlertChart
