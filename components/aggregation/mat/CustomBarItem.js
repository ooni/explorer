// Based on BarItem.tsx in @nivo/bar @v0.73.1
// https://github.com/plouc/nivo/blob/7ff0e72ebf823231cc341d8fc0d544768a9a458b/packages/bar/src/BarItem.tsx

import React, { createElement, useCallback, useEffect } from 'react'
import { animated, to } from '@react-spring/web'
import { useTheme } from '@nivo/core'
import { useTooltip } from '@nivo/tooltip'

export const CustomBarItem = ({
  bar: { data, ...bar },

  style: {
    borderColor,
    color,
    height,
    labelColor,
    labelOpacity,
    labelX,
    labelY,
    transform,
    width,
  },

  borderRadius,
  borderWidth,
  enableLabel,
  label,
  shouldRenderLabel,

  isInteractive,
  onClick,
  onMouseEnter,
  onMouseLeave,

  tooltip,
}) => {
  const theme = useTheme()
  const { showTooltipAt, hideTooltip } = useTooltip()
  const extraBorderWidth = data.data.highlight ? 2 : 0
  
  const onClose = useCallback(() => {
    hideTooltip()
  }, [hideTooltip])

  useEffect(() => {
    // We hijack `enableLabel` to pass down whether the bar component should hide the tooltip or not.
    if (enableLabel === false) {
      hideTooltip()
    }
  }, [enableLabel, hideTooltip])

  const renderTooltip = useCallback(() =>
    // eslint-disable-next-line react/display-name
    createElement(tooltip, { ...bar, ...data, onClose }),
  [tooltip, bar, data, onClose])

  const handleClick = useCallback(
    (event) => {
      onClick?.({ color: bar.color, column: bar.key, ...data }, event)
      // If the clicked bar is located near the upper edge of the react-window container,
      // then anchor the tooltip to the bottom of the bar
      const outerListElement = event.currentTarget.closest('.outerListElement')
      if (!outerListElement) {
        return
      }
      const {y: chartContainerY} = outerListElement.getBoundingClientRect()
      const nearTopEdge = (event.clientY - chartContainerY) < 200
      showTooltipAt(
        renderTooltip(),
        nearTopEdge ? [bar.x + bar.width / 2, bar.y + bar.height] :[bar.x + bar.width / 2, bar.y],
        nearTopEdge ? 'bottom' : 'top'
      )
    },
    [bar.color, bar.height, bar.key, bar.width, bar.x, bar.y, data, onClick, renderTooltip, showTooltipAt]
  )
  // Disable events upon mouse movement events
  // const handleTooltip = useCallback(
  //   (event) =>
  //     showTooltipFromEvent(createElement(tooltip, { ...bar, ...data }), event),
  //   [bar, data, showTooltipFromEvent, tooltip]
  // )
  // const handleMouseEnter = useCallback(
  //   (event) => {
  //     onMouseEnter?.(data, event)
  //     showTooltipFromEvent(createElement(tooltip, { ...bar, ...data }), event)
  //   },
  //   [bar, data, onMouseEnter, showTooltipFromEvent, tooltip]
  // )
  // const handleMouseLeave = useCallback(
  //   (event) => {
  //     onMouseLeave?.(data, event)
  //     hideTooltip()
  //   },
  //   [data, hideTooltip, onMouseLeave]
  // )

  return (
    <animated.g transform={transform}>
      <animated.rect
        width={to(width, value => Math.max(value, 0))}
        height={to(height, value => Math.max(value, 0))}
        rx={borderRadius}
        ry={borderRadius}
        fill={data.fill ?? color}
        strokeWidth={borderWidth + extraBorderWidth}
        stroke={borderColor}
        // onMouseEnter={isInteractive ? handleMouseEnter : undefined}
        // onMouseMove={isInteractive ? handleTooltip : undefined}
        // onMouseLeave={isInteractive ? handleMouseLeave : undefined}
        onClick={isInteractive ? handleClick : undefined}
      />
      {shouldRenderLabel && (
        <animated.text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="central"
          fillOpacity={labelOpacity}
          style={{
            ...theme.labels.text,
            pointerEvents: 'none',
            fill: labelColor,
          }}
        >
          {label}
        </animated.text>
      )}
    </animated.g>
  )
}

