import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'ooni-components'
import { ResponsiveBar as Bar } from '@nivo/bar'
import { useTooltip } from '@nivo/tooltip'

import { CustomBarItem } from './CustomBarItem'
import { CustomToolTip, InvisibleTooltip, themeForInvisibleTooltip } from './CustomTooltip'
import { colorMap } from './colorMap'
import { useMATContext } from './MATContext'
import { getXAxisTicks } from './timeScaleXAxis'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'

const keys = [
  'anomaly_count',
  'confirmed_count',
  'failure_count',
  'ok_count',
]

const StyledFlex = styled(Flex)`
  direction: ltr;
`

const colorFunc = (d) => colorMap[d.id] || '#ccc'

const barLayers = ['grid', 'axes', 'bars']
export const chartMargins = { top: 4, right: 50, bottom: 4, left: 0 }

const formatXAxisValues = (value, query, intl) => {
  if (query.axis_x === 'measurement_start_day' && Date.parse(value)) {
    if (query.time_grain === 'hour') {
      const dateTime = new Date(value)
      return new Intl.DateTimeFormat(intl.locale, { dateStyle: 'short', timeStyle: 'short', timeZone: 'UTC', hourCycle: 'h23' }).format(dateTime)
    }
  } else {
    return value
  }
}

const chartProps1D = (query, intl) => ({
  colors: colorFunc,
  indexScale: {
    type: 'band',
    round: false
  },
  margin: {
    top: 50,
    right: 30,
    bottom: 100,
    left: 80
  },
  padding: 0.3,
  borderColor: { from: 'color', modifiers: [ [ 'darker', 1.6 ] ] },
  axisTop: null,
  axisRight: null,
  axisBottom: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 45,
    legendPosition: 'middle',
    legendOffset: 70,
    tickValues: getXAxisTicks(query),
    legend: query.axis_x ? intl.formatMessage({id: `MAT.Form.Label.AxisOption.${query.axis_x}`, defaultMessage: '' }) : '',
    format: (values) => formatXAxisValues(values, query, intl),
  },
  axisLeft: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legendPosition: 'middle',
    legendOffset: -60
  },
  labelSkipWidth: 80,
  labelSkipHeight: 20,
  labelTextColor: { from: 'color', modifiers: [ [ 'darker', 1.6 ] ] },
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
})

const chartProps2D = (query) => ({
  // NOTE: These dimensions are linked to accuracy of the custom axes rendered in
  // <GridChart />
  margin: chartMargins,
  padding: 0.3,
  borderColor: { from: 'color', modifiers: [ [ 'darker', 1.6 ] ] },
  colors: colorFunc,
  axisTop: null,
  axisRight: {
    enable: true,
    tickSize: 5,
    tickPadding: 5,
    tickValues: 2
  },
  axisBottom: null,
  axisLeft: null,
  enableGridX: true,
  enableGridY: true,
  indexScale: {
    type: 'band',
    round: false
  },
  labelSkipWidth: 100,
  labelSkipHeight: 100,
  labelTextColor: { from: 'color', modifiers: [ [ 'darker', 1.6 ] ] },
  // We send the `showTooltip` boolean into the barComponent to control visibility of tooltip
  motionConfig: {
    duration: 1
  },
  animate: false,
  isInteractive: true,
  layers: barLayers,
})

const RowChart = ({ data, indexBy, label, height, rowIndex /* width, first, last */}) => {
  const intl = useIntl()
  const [ query, updateMATContext ] = useMATContext()
  const { tooltipIndex } = query
  const { showTooltipFromEvent, hideTooltip } = useTooltip()

  const onClose = useCallback(() => {
    hideTooltip()
  }, [hideTooltip])

  const handleClick = useCallback(({ data }) => {
    const column = data[query.axis_x]
    updateMATContext({ tooltipIndex: [rowIndex, column]}, true)
    showTooltipFromEvent(
      React.createElement(CustomToolTip, {
        data: data,
        onClose
      }),
      event,
      'top'
    )

  }, [onClose, query.axis_x, rowIndex, showTooltipFromEvent, updateMATContext])

  // Load the chart with an empty data to avoid
  // react-spring from working on the actual data during
  // first render. This forces an update after 1ms with
  // real data, which appears quick enough with animation disabled
  const [chartData, setChartData] = useState([])
  useEffect(() => {
    let animation = setTimeout(() => setChartData(data), 1)

    return () => {
      clearTimeout(animation)
    }
  }, [data])


  const chartProps = useMemo(() => {
    return label === undefined ? chartProps1D(query, intl) : chartProps2D(query)
  }, [intl, label, query])

  return (
    <StyledFlex alignItems='center' sx={{ position: 'relative' }}>
      {label && <Box width={2/16}>
        {label}
      </Box>}
      <Box sx={{ height: height, width: '100%' }}>
        <Bar
          data={chartData}
          keys={keys}
          indexBy={indexBy}
          tooltip={InvisibleTooltip}
          onClick={handleClick}
          barComponent={CustomBarItem}
          theme={themeForInvisibleTooltip}
          // HACK: To show the tooltip, we hijack the 
          // `enableLabel` prop to pass in the tooltip coordinates (row, col_index) from `GridChart`
          // `showTooltip` contains `[rowHasTooltip, columnwithTooltip]` e.g `[true, '2022-02-01']`
          enableLabel={tooltipIndex[0] === rowIndex ? tooltipIndex[1] : false}
          {...chartProps}
        />
      </Box>
    </StyledFlex>
  )
}

RowChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    anomaly_count: PropTypes.number,
    confirmed_count: PropTypes.number,
    failure_count: PropTypes.number,
    input: PropTypes.string,
    measurement_count: PropTypes.number,
    measurement_start_day: PropTypes.string,
    ok_count: PropTypes.number,
  })),
  height: PropTypes.number,
  indexBy: PropTypes.string,
  label: PropTypes.node,
  rowIndex: PropTypes.number,
}

RowChart.displayName = 'RowChart'

export default React.memo(RowChart)
