// Based on BarItem.tsx in @nivo/bar @v0.79.1
// https://github.com/plouc/nivo/blob/f0a673005e918b2e2d3e635c6f214aa088bac5e1/packages/bar/src/BarItem.tsx

import { createElement, useCallback, useMemo, useEffect } from 'react'
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

  isFocusable,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
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
    [bar, data, onClick, renderTooltip, showTooltipAt]
  )
  // Disable events upon mouse movement events
  // const handleTooltip = useCallback(
  //   (event) => showTooltipFromEvent(renderTooltip(), event),
  //   [showTooltipFromEvent, renderTooltip]
  // )
  // const handleMouseEnter = useCallback(
  //   (event) => {
  //     onMouseEnter?.(data, event)
  //     showTooltipFromEvent(renderTooltip(), event)
  //   },
  //   [data, onMouseEnter, showTooltipFromEvent, renderTooltip]
  // )
  // const handleMouseLeave = useCallback(
  //   (event) => {
  //     onMouseLeave?.(data, event)
  //     hideTooltip()
  //   },
  //   [data, hideTooltip, onMouseLeave]
  // )

  // extra handlers to allow keyboard navigation
  const handleFocus = useCallback(() => {
      showTooltipAt(renderTooltip(), [bar.absX + bar.width / 2, bar.absY])
  }, [showTooltipAt, renderTooltip, bar])
  const handleBlur = useCallback(() => {
      hideTooltip()
  }, [hideTooltip])

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
        focusable={isFocusable}
        tabIndex={isFocusable ? 0 : undefined}
        aria-label={ariaLabel ? ariaLabel(data) : undefined}
        aria-labelledby={ariaLabelledBy ? ariaLabelledBy(data) : undefined}
        aria-describedby={ariaDescribedBy ? ariaDescribedBy(data) : undefined}
        // onMouseEnter={isInteractive ? handleMouseEnter : undefined}
        // onMouseMove={isInteractive ? handleTooltip : undefined}
        // onMouseLeave={isInteractive ? handleMouseLeave : undefined}
        onClick={isInteractive ? handleClick : undefined}
        onFocus={isInteractive && isFocusable ? handleFocus : undefined}
        onBlur={isInteractive && isFocusable ? handleBlur : undefined}
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
