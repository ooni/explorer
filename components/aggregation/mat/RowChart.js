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
import { colorMap } from './colorMap'
import { getXAxisTicks } from './timeScaleXAxis'
import CustomStackedBarItem from './CustomStackedBarItem'
import { line } from 'd3-shape'
import { computeXYScalesForSeries } from '@nivo/scales'
import { Axes } from '@nivo/axes'
import { colors } from 'ooni-components'
import { useMATContext } from './MATContext'

const chartMargins = { top: 5, right: 50, bottom: 5, left: 0 }

const lineColor = colors.gray['700']

const Line = (props) => {
  const { bars, xScale, innerWidth, innerHeight, tooltip } = props
  if (bars.length === 0) return null

  const uniqBars = bars
  // .filter(
  //   (bar, index, self) =>
  //     index === self.findIndex((b) => b.data.index === bar.data.index),
  // )
  const maxValue = Math.max(...uniqBars.map((bar) => bar.data.data.count || 0))
  const roundedMaxValue = maxValue // Math.ceil(maxValue / 10) * 10
  const midValue = Math.ceil(roundedMaxValue / 2)
  const tickValues = [0, midValue, roundedMaxValue]

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
      return bar.x + bar.width / 2
      // bar.data.id === 'dns_isp' // this is true for detailed chart, where dns_isp is first bar in the group
      //   ? bar.x + (4 * bar.width) / 2
      //   : bar.x + bar.width / 2
    })
    .y((bar) => {
      return scale.yScale(bar.data.data.count || 0)
    })

  return (
    <>
      {/* {innerHeight > 70 && ( */}
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
          tickValues: innerHeight < 70 ? tickValues : undefined,
          legendPosition: 'middle',
          legendOffset: 68,
          legend: innerHeight > 70 ? 'Measurement count' : undefined,
          format: (e) => (Math.floor(e) === e ? e : ''),
        }}
      />
      {/* )} */}

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
    </>
  )
}

const keys = ['anomaly_count', 'confirmed_count', 'failure_count', 'ok_count']
const v5keys = ['blocked_max']
const loniKeys = ['dns_isp', 'dns_other', 'tls', 'tcp']

const getKeys = (loni, observationKeys) => {
  // if (loni === 'detailed') {
  //   return loniKeys
  // }
  if (loni === 'outcome') {
    return v5keys
  }
  if (loni === 'observations') {
    return observationKeys
  }
  return keys
}

const colorFunc = (d, query, state) => {
  if (state?.colors && query?.loni === 'observations') return state.colors[d.id]
  if (state?.colors && query?.loni === 'outcome')
    return state.colors[d.data.blocked_max_outcome]
  //   if (query?.loni === 'detailed' && d?.data?.outcome_label) {
  //     const label = d.data.outcome_label
  //     const blockingType = label.split('.')[0]

  //     if (blockingType === 'ok') {
  //       if (d.id === 'outcome_blocked') return colorMap.confirmed_count
  //       if (d.id === 'outcome_down') return colorMap.anomaly_count
  //       return colorMap.ok_count
  //     }
  //     if (d.id === 'outcome_blocked') {
  //       return colorMap[`${blockingType}.blocked`] || colorMap.failure_count
  //     }

  //     if (d.id === 'outcome_down') {
  //       return colorMap[`${blockingType}.down`] || colorMap.anomaly_count
  //     }
  //   }
  return colorMap[d.id] || '#ccc'
}

const baseLayers = ['grid', 'axes', 'bars']
const barLayers = (query) => {
  return query?.loni === 'outcome' //|| query?.loni === 'detailed'
    ? ['grid', 'axes', 'markers', 'bars', Line]
    : baseLayers
}

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

const chartProps1D = (query, intl, state) => ({
  colors: (data) => colorFunc(data, query, state),
  indexScale: {
    type: 'band',
    round: false,
  },
  margin: {
    top: 30,
    right: 76,
    bottom: 80,
    left: 42,
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
    legendOffset: -36,
    tickValues: query?.loni === 'outcome' ? 3 : undefined,
    legend: query?.loni === 'outcome' ? 'Analysis outcome' : undefined,
    ...(query?.loni !== 'outcome'
      ? { format: (e) => (Math.floor(e) === e ? e : '') }
      : {}),
  },
  labelSkipWidth: 80,
  labelSkipHeight: 20,
  labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] },
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
  layers: barLayers(query),
})

const chartProps2D = (query, intl, state) => ({
  // NOTE: These dimensions are linked to accuracy of the custom axes rendered in
  // <GridChart />
  // innerPadding: '3px',
  margin: chartMargins,
  padding: 0.3,
  borderColor: { from: 'color', modifiers: [['darker', 1.6]] },
  colors: (data) => colorFunc(data, query, state),
  axisTop: null,
  ...(query?.loni !== 'outcome'
    ? {
        axisRight: {
          enable: true,
          tickSize: 5,
          tickPadding: 5,
          tickValues: 2,
        },
      }
    : {}),
  // axisRight: {
  //   enable: true,
  //   tickSize: 5,
  //   tickPadding: 5,
  //   tickValues: 2,
  // },
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
}) => {
  const intl = useIntl()
  const { dispatch, state } = useMATContext()
  const { query, tooltipIndex } = state

  const { showTooltipFromEvent, hideTooltip } = useTooltip()

  const onClose = useCallback(() => {
    // update MATContext to remove the highlighted border around BarItem
    dispatch({ type: 'setTooltipIndex', payload: [-1, ''] })
    hideTooltip()
  }, [hideTooltip, dispatch])

  const handleClick = useCallback(
    ({ data }) => {
      const column = data[query.axis_x]
      dispatch({ type: 'setTooltipIndex', payload: [rowIndex, column] })
      showTooltipFromEvent(
        createElement(CustomToolTip, {
          data: data,
          onClose,
        }),
        event,
        'top',
      )
    },
    [onClose, query.axis_x, rowIndex, showTooltipFromEvent, dispatch],
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
      ? chartProps1D(query, intl, state)
      : chartProps2D(query, intl, state)
  }, [intl, label, query, state])

  const uniqueFailures = useMemo(
    () => ['other', ...(state.selected ?? [])],
    [state.selected],
  )
  const theme = useMemo(() => {
    if (query?.loni === 'outcome') {
      return {
        ...themeForInvisibleTooltip,
        axis: { ticks: { text: { fontSize: 10 } } },
      }
    }
    return themeForInvisibleTooltip
  }, [query?.loni])

  return (
    <div className="flex items-center relative" style={{ direction: 'ltr' }}>
      {label && <div className="w-[12.5%] overflow-hidden">{label}</div>}
      <div style={{ height, width: '100%' }}>
        <Bar
          data={chartData}
          keys={getKeys(query?.loni, uniqueFailures)}
          indexBy={indexBy}
          tooltip={InvisibleTooltip}
          onClick={handleClick}
          // query?.loni && query?.loni === 'detailed'
          //   ? CustomStackedBarItem
          //   : CustomBarItem
          barComponent={CustomBarItem}
          // query?.loni && query?.loni === 'detailed'
          //   ? 'grouped'
          //   : 'stacked'
          groupMode={'stacked'}
          theme={theme}
          // HACK: To show the tooltip, we hijack the
          // `enableLabel` prop to pass in the tooltip coordinates (row, col_index) from `GridChart`
          // `showTooltip` contains `[rowHasTooltip, columnwithTooltip]` e.g `[true, '2022-02-01']`
          enableLabel={tooltipIndex[0] === rowIndex ? tooltipIndex[1] : false}
          valueScale={{
            type: 'linear',
            ...(query?.loni && query?.loni === 'outcome'
              ? { min: 0, max: 1 }
              : { min: 0, max: 'auto' }),
          }}
          gridYValues={
            query?.loni && query?.loni === 'outcome' ? [0, 0.5, 1] : undefined
          }
          markers={[
            {
              axis: 'y',
              value: 0.5,
              lineStyle: {
                stroke: colors.gray['400'],
                strokeWidth: 2,
              },
              legendOrientation: 'vertical',
            },
          ]}
          {...chartProps}
        />
      </div>
    </div>
  )
}

export default memo(RowChart)
