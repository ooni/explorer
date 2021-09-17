import React, { createElement, useCallback, useMemo } from 'react'
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

  const onClose = () => {
    hideTooltip()
  }

  const renderTooltip = useMemo(
    // eslint-disable-next-line react/display-name
    () => () => createElement(tooltip, { ...bar, ...data, onClose }),
    [tooltip, bar, data]
  )

  const handleClick = useCallback(
    (event) => {
      onClick?.({ color: bar.color, ...data }, event)
      showTooltipAt(
        renderTooltip(),
        [bar.x + bar.width / 2, bar.y],
        event.clientY > 250 ? 'top' : 'bottom'
      )

    },
    [bar, data, onClick]
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
        strokeWidth={borderWidth}
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

