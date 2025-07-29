import { ResponsiveBar as Bar } from '@nivo/bar'
import { useTooltip } from '@nivo/tooltip'
import PropTypes from 'prop-types'
import {
  createElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import { getDirection } from '../../withIntl'
import { CustomBarItem } from './CustomBarItem'
import {
  CustomToolTip,
  InvisibleTooltip,
  themeForInvisibleTooltip,
} from './CustomTooltip'
import { useMATContext } from './MATContext'
import { colorMap } from './colorMap'
import { getXAxisTicks } from './timeScaleXAxis'
import { useRouter } from 'next/router'
import CustomStackedBarItem from './CustomStackedBarItem'
import { line } from 'd3-shape'
import { computeXYScalesForSeries } from '@nivo/scales'
import { Axes } from '@nivo/axes'
import { colors } from 'ooni-components'

const lineColor = colors.gray['700']

const Line = (props) => {
  const { bars, xScale, innerWidth, innerHeight, tooltip } = props

  const uniqBars = bars.filter(
    (bar, index, self) =>
      index === self.findIndex((b) => b.data.index === bar.data.index),
  )

  const scale = computeXYScalesForSeries(
    [
      {
        id: 'only',
        data: uniqBars.map((it) => ({
          x: it.data.index,
          y: it.data.data.count || 0,
        })),
      },
    ],
    { type: 'linear' },
    { type: 'linear' },
    innerWidth,
    innerHeight,
  )

  const lineGenerator = line()
    .x((bar) => {
      return bar.data.id === 'dns_isp' // this is true for detailed chart, where dns_isp is first bar in the group
        ? bar.x + (4 * bar.width) / 2
        : bar.x + bar.width / 2
    })
    .y((bar) => {
      return scale.yScale(bar.data.data.count || 0)
    })

  return (
    <>
      {innerHeight > 70 && (
        <Axes
          yScale={scale.yScale}
          xScale={xScale}
          width={innerWidth}
          height={innerHeight}
          right={{
            ticksPosition: 'after',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            tickOffset: 10,
            // tickValues: 2,
          }}
        />
      )}

      <path
        d={lineGenerator(uniqBars)}
        fill="none"
        stroke={lineColor}
        style={{ pointerEvents: 'none' }}
      />
      {uniqBars.map((bar) => (
        <circle
          key={bar.key}
          cx={
            bar.data.id === 'dns_isp'
              ? bar.x + (4 * bar.width) / 2
              : bar.x + bar.width / 2
          }
          cy={scale.yScale(bar.data.data.count || 0)}
          r={2}
          fill="white"
          stroke={lineColor}
          style={{ pointerEvents: 'none' }}
        />
      ))}
      {/* {bars.map((bar, idx) => (
        <rect
          key={bar.key}
          x={bar.x}
          y={0}
          height={innerHeight}
          width={bar.width}
          fill="transparent"
          // onMouseEnter={(e) => renderTip(e, idx)}
          // onMouseMove={(e) => renderTip(e, idx)}
          // onMouseLeave={tip.hideTooltip}
        />
      ))} */}
    </>
  )
}

const keys = ['anomaly_count', 'confirmed_count', 'failure_count', 'ok_count']
const v5keys = ['outcome_blocked', 'outcome_down', 'outcome_ok']
const loniKeys = ['dns_isp', 'dns_other', 'tls', 'tcp']

const getKeys = (loni, observationKeys) => {
  if (loni === 'detailed') {
    return loniKeys
  }
  if (loni === 'outcome') {
    return v5keys
  }
  if (loni === 'observations') {
    return observationKeys
  }
  return keys
}

const colorFunc = (d, query, colorScheme = []) => {
  if (query.colors) return query.colors[d.id]
  if (query?.loni === 'detailed' && d?.data?.outcome_label) {
    const label = d.data.outcome_label
    const blockingType = label.split('.')[0]

    if (blockingType === 'ok') {
      if (d.id === 'outcome_blocked') return colorMap.confirmed_count
      if (d.id === 'outcome_down') return colorMap.anomaly_count
      return colorMap.ok_count
    }
    if (d.id === 'outcome_blocked') {
      return colorMap[`${blockingType}.blocked`] || colorMap.failure_count
    }

    if (d.id === 'outcome_down') {
      return colorMap[`${blockingType}.down`] || colorMap.anomaly_count
    }
  }
  return colorMap[d.id] || '#ccc'
}

const baseLayers = ['grid', 'axes', 'bars']
const barLayers = (query) => {
  return query?.loni === 'outcome' || query?.loni === 'detailed'
    ? [...baseLayers, Line]
    : baseLayers
}

export const chartMargins = { top: 4, right: 50, bottom: 4, left: 0 }

const formatXAxisValues = (value, query, intl) => {
  if (query.axis_x === 'measurement_start_day' && Date.parse(value)) {
    if (query.time_grain === 'hour') {
      const dateTime = new Date(value)
      return new Intl.DateTimeFormat(intl.locale, {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'UTC',
        hourCycle: 'h23',
      }).format(dateTime)
    }
  } else {
    return value
  }
}

const chartProps1D = (query, intl, colorScheme) => ({
  colors: (data) => colorFunc(data, query, colorScheme),
  indexScale: {
    type: 'band',
    round: false,
  },
  margin: {
    top: 30,
    right: 70,
    bottom: 80,
    left: 70,
  },
  padding: 0.3,
  borderColor: { from: 'color', modifiers: [['darker', 1.6]] },
  axisTop: null,
  axisRight: null,
  axisBottom: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: getDirection(intl.locale) === 'ltr' ? 45 : -315,
    legendPosition: 'middle',
    legendOffset: 70,
    tickValues: getXAxisTicks(query),
    legend: query.axis_x
      ? intl.formatMessage({
          id: `MAT.Form.Label.AxisOption.${query.axis_x}`,
          defaultMessage: '',
        })
      : '',
    format: (values) => formatXAxisValues(values, query, intl),
  },
  axisLeft: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legendPosition: 'middle',
    legendOffset: -60,
  },
  labelSkipWidth: 80,
  labelSkipHeight: 20,
  labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] },
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
  layers: barLayers(query),
})

const chartProps2D = (query, intl, colorScheme) => ({
  // NOTE: These dimensions are linked to accuracy of the custom axes rendered in
  // <GridChart />
  // innerPadding: '3px',
  margin: chartMargins,
  padding: 0.3,
  borderColor: { from: 'color', modifiers: [['darker', 1.6]] },
  colors: (data) => colorFunc(data, query, colorScheme),
  axisTop: null,
  axisRight: {
    enable: true,
    tickSize: 5,
    tickPadding: 5,
    tickValues: 2,
  },
  axisBottom: null,
  axisLeft: null,
  enableGridX: true,
  enableGridY: true,
  indexScale: {
    type: 'band',
    round: false,
  },
  labelSkipWidth: 100,
  labelSkipHeight: 100,
  labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] },
  // We send the `showTooltip` boolean into the barComponent to control visibility of tooltip
  motionConfig: {
    duration: 1,
  },
  animate: false,
  isInteractive: true,
  layers: barLayers(query),
})

const RowChart = ({
  data,
  indexBy,
  label,
  height,
  rowIndex /* width, first, last */,
  colorScheme = [],
}) => {
  const intl = useIntl()
  const { query: routerQuery } = useRouter()
  const [query, updateMATContext] = useMATContext()
  const { tooltipIndex } = query

  const { showTooltipFromEvent, hideTooltip } = useTooltip()

  const onClose = useCallback(() => {
    // update MATContext to remove the highlighted border around BarItem
    updateMATContext({ tooltipIndex: [-1, ''] }, true)
    hideTooltip()
  }, [hideTooltip])

  const handleClick = useCallback(
    ({ data }) => {
      const column = data[query.axis_x]
      updateMATContext({ tooltipIndex: [rowIndex, column] }, true)
      showTooltipFromEvent(
        createElement(CustomToolTip, {
          data: data,
          onClose,
        }),
        event,
        'top',
      )
    },
    [onClose, query.axis_x, rowIndex, showTooltipFromEvent, updateMATContext],
  )

  // Load the chart with an empty data to avoid
  // react-spring from working on the actual data during
  // first render. This forces an update after 1ms with
  // real data, which appears quick enough with animation disabled
  const [chartData, setChartData] = useState([])
  useEffect(() => {
    const animation = setTimeout(() => setChartData(data), 1)

    return () => {
      clearTimeout(animation)
    }
  }, [data])

  const chartProps = useMemo(() => {
    return label === undefined
      ? chartProps1D(query, intl, colorScheme)
      : chartProps2D(query, colorScheme)
  }, [intl, label, query])

  const uniqueFailures = chartData.length
    ? [
        ...new Set(
          chartData.reduce((acc, next) => [...acc, ...Object.keys(next)], []),
        ),
      ].filter(
        (item) => item !== 'measurement_start_day' && item !== 'probe_cc',
      )
    : []

  return (
    <div className="flex items-center relative" style={{ direction: 'ltr' }}>
      {label && <div className="w-[12.5%] overflow-hidden">{label}</div>}
      <div style={{ height, width: '100%' }}>
        <Bar
          data={chartData}
          keys={getKeys(routerQuery?.loni, uniqueFailures)}
          indexBy={indexBy}
          tooltip={InvisibleTooltip}
          onClick={handleClick}
          barComponent={
            routerQuery?.loni && routerQuery?.loni === 'detailed'
              ? CustomStackedBarItem
              : CustomBarItem
          }
          groupMode={
            routerQuery?.loni && routerQuery?.loni === 'detailed'
              ? 'grouped'
              : 'stacked'
          }
          theme={themeForInvisibleTooltip}
          // HACK: To show the tooltip, we hijack the
          // `enableLabel` prop to pass in the tooltip coordinates (row, col_index) from `GridChart`
          // `showTooltip` contains `[rowHasTooltip, columnwithTooltip]` e.g `[true, '2022-02-01']`
          enableLabel={tooltipIndex[0] === rowIndex ? tooltipIndex[1] : false}
          {...chartProps}
          // colors={colorScheme}
        />
      </div>
    </div>
  )
}

RowChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      anomaly_count: PropTypes.number,
      confirmed_count: PropTypes.number,
      failure_count: PropTypes.number,
      input: PropTypes.string,
      measurement_count: PropTypes.number,
      measurement_start_day: PropTypes.string,
      ok_count: PropTypes.number,
    }),
  ),
  height: PropTypes.number,
  indexBy: PropTypes.string,
  label: PropTypes.node,
  rowIndex: PropTypes.number,
}

RowChart.displayName = 'RowChart'

export default memo(RowChart)
