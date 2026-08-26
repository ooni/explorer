import { type BarDatum, type BarTooltipProps, ResponsiveBar } from '@nivo/bar'
import { colors } from 'ooni-components'
import { useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  type DayBucket,
  FAILURE_FAMILIES,
  familyOf,
  NONE_SERIES,
} from './failures'

// Round up to a clean 1/2/5 x 10^k tick ceiling
const niceCeil = (v: number): number => {
  if (v <= 0) return 1
  const mag = 10 ** Math.floor(Math.log10(v))
  for (const m of [1, 2, 5, 10]) {
    if (m * mag >= v) return m * mag
  }
  return 10 * mag
}

// Stacking order: no-failure observations first so the coloured failures sit
// on top of them
const SERIES_KEYS = [NONE_SERIES.key, ...FAILURE_FAMILIES.map((f) => f.key)]

const colorOf = (key: string): string =>
  key === NONE_SERIES.key
    ? NONE_SERIES.color
    : (FAILURE_FAMILIES.find((f) => f.key === key)?.color ?? colors.gray['300'])

const chartTheme = {
  text: { fontSize: 10, fill: colors.gray['600'] },
  axis: {
    ticks: { line: { stroke: 'transparent' } },
    domain: { line: { stroke: colors.gray['400'] } },
  },
  grid: { line: { stroke: colors.gray['200'] } },
  tooltip: {
    container: { padding: 0, background: 'transparent', boxShadow: '' },
  },
}

export interface FailureChartProps {
  title: React.ReactNode
  buckets: DayBucket[]
  yMax: number // shared across sibling charts so they compare directly
}

const DayTooltip = ({ bucket }: { bucket: DayBucket }) => {
  const intl = useIntl()
  const fmt = (n: number) => intl.formatNumber(n)

  return (
    <div className="bg-white border border-gray-300 rounded shadow-lg px-2.5 py-2 text-xs w-max max-w-[300px]">
      <div className="font-semibold mb-1 tabular-nums">{bucket.day}</div>
      {[...bucket.details.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([failure, count]) => (
          <div key={failure} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-[3px] rounded-sm shrink-0"
              style={{ background: colorOf(familyOf(failure) ?? '') }}
            />
            <strong className="tabular-nums">{fmt(count)}</strong>
            <span className="text-gray-600">{failure}</span>
          </div>
        ))}
      <div className="text-gray-600 mt-1">
        <FormattedMessage
          id="Measurement.Observations.Chart.Totals"
          values={{
            withoutFailure: fmt(bucket.none),
            total: fmt(bucket.total),
          }}
        />
      </div>
    </div>
  )
}

const FailureChart = ({ title, buckets, yMax }: FailureChartProps) => {
  const intl = useIntl()
  const fmt = (n: number) => intl.formatNumber(n)
  const yCeil = niceCeil(yMax)

  // Counts are whole numbers, so drop the midpoint when it isn't one
  const yTicks = Number.isInteger(yCeil / 2)
    ? [0, yCeil / 2, yCeil]
    : [0, yCeil]

  const data = useMemo<BarDatum[]>(
    () =>
      buckets.map((b) => ({
        day: b.day,
        [NONE_SERIES.key]: b.none,
        ...Object.fromEntries(
          FAILURE_FAMILIES.map((f) => [f.key, b.byFamily[f.key]]),
        ),
      })),
    [buckets],
  )

  const bucketByDayKey = useMemo(
    () => new Map(buckets.map((b) => [b.day, b])),
    [buckets],
  )

  // Label roughly every ~5th day so tick labels never collide
  const tickValues = useMemo(() => {
    const every = Math.max(1, Math.ceil(buckets.length / 6))
    return buckets.filter((_, i) => i % every === 0).map((b) => b.day)
  }, [buckets])

  const hasAny = buckets.some((b) => b.total > 0)

  const renderTooltip = ({ indexValue }: BarTooltipProps<BarDatum>) => {
    const bucket = bucketByDayKey.get(String(indexValue))
    if (!bucket || bucket.total === 0) return null
    return <DayTooltip bucket={bucket} />
  }

  return (
    <div>
      <h4 className="text-sm font-semibold mb-1">{title}</h4>
      <div className="relative h-[200px] rounded bg-gray-50">
        <ResponsiveBar
          data={data}
          keys={SERIES_KEYS}
          indexBy="day"
          margin={{ top: 12, right: 8, bottom: 22, left: 44 }}
          padding={0.2}
          innerPadding={1}
          groupMode="stacked"
          valueScale={{ type: 'linear', min: 0, max: yCeil }}
          indexScale={{ type: 'band', round: false }}
          colors={({ id }) => colorOf(String(id))}
          enableLabel={false}
          enableGridX={false}
          gridYValues={yTicks}
          axisTop={null}
          axisRight={null}
          axisLeft={{
            tickSize: 0,
            tickPadding: 6,
            tickValues: yTicks,
            format: (v) => fmt(Number(v)),
          }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 6,
            tickValues,
            format: (v) => String(v).slice(5),
          }}
          theme={chartTheme}
          tooltip={renderTooltip}
          animate={false}
          role="img"
          ariaLabel={typeof title === 'string' ? title : undefined}
        />
        {!hasAny && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-600">
            <FormattedMessage id="Measurement.Observations.Chart.NoObservations" />
          </div>
        )}
      </div>
      <details className="mt-1">
        <summary className="text-xs text-gray-600 cursor-pointer">
          <FormattedMessage id="Measurement.Observations.Chart.ViewAsTable" />
        </summary>
        <div className="max-h-48 overflow-y-auto mt-1">
          <table className="min-w-full text-xs divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-1 pe-3 text-start font-semibold">
                  <FormattedMessage id="Measurement.Observations.Chart.Table.Day" />
                </th>
                <th className="py-1 pe-3 text-start font-semibold">
                  <FormattedMessage id="Measurement.Observations.Chart.Table.Failure" />
                </th>
                <th className="py-1 text-end font-semibold">
                  <FormattedMessage id="Measurement.Observations.Chart.Table.Count" />
                </th>
              </tr>
            </thead>
            <tbody>
              {buckets
                .filter((b) => b.total > 0)
                .flatMap((b) =>
                  [
                    ...(b.none > 0
                      ? [['none', b.none] as [string, number]]
                      : []),
                    ...b.details.entries(),
                  ].map(([failure, count]) => (
                    <tr key={b.day + failure} className="even:bg-gray-50">
                      <td className="py-1 pe-3 tabular-nums">{b.day}</td>
                      <td className="py-1 pe-3">{failure}</td>
                      <td className="py-1 text-end tabular-nums">
                        {fmt(count)}
                      </td>
                    </tr>
                  )),
                )}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

export default FailureChart
