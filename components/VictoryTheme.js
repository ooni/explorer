import { assign } from 'lodash'
import { theme } from 'ooni-components'

const colors = theme.colors
// Color scale
const colorScale = [
  colors.yellow2,
  colors.lime3,
  colors.fuschia4,
  colors.blue5,
  colors.grey6,
  colors.grey7,
  colors.green8
]

const primaryColor = colors.base

// Typography
export const sansSerif = '"Fira Sans", sans-serif'
const letterSpacing = 'normal'
const fontSize = 8

// Layout
const baseProps = {
  colorScale: colorScale,
  overflow: 'visible'
}

// Labels
export const baseLabelStyles = {
  fontFamily: sansSerif,
  fontSize,
  letterSpacing,
  padding: 8,
  fill: colors.black,
  stroke: 'transparent',
}

const centeredLabelStyles = assign({ textAnchor: 'middle' }, baseLabelStyles)

// Strokes
const strokeDasharray = '1, 3'
const strokeLinecap = 'round'
const strokeLinejoin = 'round'

export const axisYStyle = {
  grid: {
    stroke: colors.black,
    strokeOpacity: '0.5',
    strokeDasharray,
    strokeLinecap,
    strokeLinejoin
  },
  axis: {
    fill: 'transparent',
    stroke: 'transparent'
  },
  axisLabel: assign({}, centeredLabelStyles, {padding: 25}),
  ticks: {
    fill: 'transparent',
    stroke: 'transparent'
  },
}

const victoryTheme = {
  area: assign({
    style: {
      data: {
        fill: primaryColor
      },
      labels: centeredLabelStyles
    }
  }, baseProps),

  axis: assign({}, baseProps, {
    style: {
      axis: {
        fill: 'transparent',
        stroke: colors.black,
        strokeWidth: 1,
        strokeLinecap,
        strokeLinejoin
      },
      axisLabel: assign({}, centeredLabelStyles, {padding: 25}),
      grid: {
        fill: 'transparent',
        stroke: 'transparent',
        pointerEvents: 'none'
      },
      ticks: {
        fill: 'transparent',
        size: 5,
        stroke: colors.black
      },
      tickLabels: baseLabelStyles
    }
  }),

  bar: assign({
    style: {
      data: {
        fill: primaryColor,
        padding: 8,
        strokeWidth: 0,
        width: 20
      },
      labels: baseLabelStyles,
    }
  }, baseProps),

  candlestick: assign({
    style: {
      data: {
        stroke: primaryColor,
        strokeWidth: 1
      },
      labels: centeredLabelStyles
    },
    candleColors: {
      positive: '#ffffff',
      negative: primaryColor
    },
  }, baseProps),

  chart: baseProps,

  errorbar: assign({
    style: {
      data: {
        fill: 'transparent',
        stroke: primaryColor,
        strokeWidth: 2
      },
      labels: centeredLabelStyles
    },
  }, baseProps),

  group: assign({
    colorScale: colorScale,
  }, baseProps),

  line: assign({
    style: {
      data: {
        fill: 'transparent',
        stroke: primaryColor,
        strokeWidth: 2
      },
      labels: centeredLabelStyles}
  }, baseProps),

  pie: {
    style: {
      data: {
        padding: 10,
        stroke: 'transparent',
        strokeWidth: 1
      },
      labels: assign({padding: 20}, baseLabelStyles)
    },
    colorScale: colorScale,
    width: 400,
    height: 400,
    padding: 50
  },

  scatter: assign({
    style: {
      data: {
        fill: primaryColor,
        stroke: 'transparent',
        strokeWidth: 0
      },
      labels: centeredLabelStyles
    },
  }, baseProps),

  stack: assign({colorScale: colorScale}, baseProps),

  tooltip: {
    style: assign({}, centeredLabelStyles, {
      padding: 5,
      pointerEvents: 'none'
    }),
    flyoutStyle: {
      stroke: primaryColor,
      strokeWidth: 1,
      pointerEvents: 'none'
    },
    cornerRadius: 5,
    pointerLength: 10
  },

  voronoi: assign ({
    style: {
      data: {
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0
      },
      labels: assign({}, centeredLabelStyles, {
        padding: 5,
        pointerEvents: 'none'
      }),
      flyout: {
        stroke: primaryColor,
        strokeWidth: 1,
        fill: '#f0f0f0',
        pointerEvents: 'none'
      }
    }
  }, baseProps),

  legend: {
    colorScale: colorScale,
    gutter: 10,
    orientation: 'vertical',
    style: {
      data: {
        type: 'circle'
      },
      labels: baseLabelStyles
    },
    symbolSpacer: 8
  }
}
export default victoryTheme
