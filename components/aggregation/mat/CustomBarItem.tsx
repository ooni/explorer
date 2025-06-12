// Based on BarItem.tsx in @nivo/bar @v0.99.0
// https://github.com/plouc/nivo/blob/aa19899518a8cd2c386581d0c6d37093d53f66d2/packages/bar/src/BarItem.tsx

import { type MouseEvent, useCallback, useState, useEffect } from 'react'
import { animated, to } from '@react-spring/web'
import type { BarDatum, BarItemProps } from '@nivo/bar'

type CustomBarItemProps<D extends BarDatum> = Omit<
  BarItemProps<D>,
  'enableLabel'
> & {
  enableLabel: string | false
}

export const CustomBarItem = <D extends BarDatum>({
  bar: { data, ...bar },
  style: {
    borderColor,
    color,
    height,
    // labelColor,
    // labelOpacity,
    // labelX,
    // labelY,
    transform,
    width,
    // textAnchor,
  },
  // borderRadius,
  borderWidth,
  enableLabel,
  //   label,
  //   shouldRenderLabel,
  isInteractive,
  onClick,
  onMouseEnter,
  onMouseLeave,
  //   tooltip,
  isFocusable,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaDisabled,
  ariaHidden,
}: CustomBarItemProps<D>) => {
  const [extraBorderWidth, setExtraBorderWidth] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // We receive tooltip coordinates in `enableLabel`
    // to determine if a tooltip is enabled and if the column should be highlighted.
    if (enableLabel === false) {
      // hideTooltip()
      setExtraBorderWidth(0)
    } else {
      setExtraBorderWidth(enableLabel === data.indexValue ? 1.8 : 0)
    }
  }, [data.indexValue, enableLabel])

  const handleClick = useCallback(
    (event: MouseEvent<SVGRectElement>) => {
      onClick?.({ color: bar.color, ...data }, event)
    },
    [bar, data, onClick],
  )

  const handleMouseEnter = useCallback(
    (event: MouseEvent<SVGRectElement>) => {
      onMouseEnter?.(data, event)
      setIsHovering(true)
      //   showTooltipFromEvent(renderTooltip(), event)
    },
    [data, onMouseEnter],
    // [data, onMouseEnter, showTooltipFromEvent, renderTooltip],
  )

  const handleMouseLeave = useCallback(
    (event: MouseEvent<SVGRectElement>) => {
      onMouseLeave?.(data, event)
      setIsHovering(false)
      //   hideTooltip()
    },
    [data, onMouseLeave],
    // [data, hideTooltip, onMouseLeave],
  )

  return (
    <animated.g transform={transform}>
      <animated.rect
        width={to(width, (value) => Math.max(value, 0))}
        height={to(height, (value) => Math.max(value, 0))}
        // rx={borderRadius}
        // ry={borderRadius}
        fill={data.fill ?? color}
        opacity={isHovering ? 0.8 : 1}
        strokeWidth={borderWidth + extraBorderWidth}
        // strokeWidth={borderWidth}
        stroke={borderColor}
        focusable={isFocusable}
        tabIndex={isFocusable ? 0 : undefined}
        aria-label={ariaLabel ? ariaLabel(data) : undefined}
        aria-labelledby={ariaLabelledBy ? ariaLabelledBy(data) : undefined}
        aria-describedby={ariaDescribedBy ? ariaDescribedBy(data) : undefined}
        aria-disabled={ariaDisabled ? ariaDisabled(data) : undefined}
        aria-hidden={ariaHidden ? ariaHidden(data) : undefined}
        onMouseEnter={isInteractive ? handleMouseEnter : undefined}
        // onMouseMove={isInteractive ? handleTooltip : undefined}
        onMouseLeave={isInteractive ? handleMouseLeave : undefined}
        onClick={isInteractive ? handleClick : undefined}
        // onFocus={isInteractive && isFocusable ? handleFocus : undefined}
        // onBlur={isInteractive && isFocusable ? handleBlur : undefined}
        data-testid={`bar.item.${data.id}.${data.index}`}
      />
      {/* {shouldRenderLabel && (
        <Text
          x={labelX}
          y={labelY}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fillOpacity={labelOpacity}
          style={{
            ...theme.labels.text,
            // We don't want the label to intercept mouse events
            pointerEvents: 'none',
            fill: labelColor,
          }}
        >
          {label}
        </Text>
      )} */}
    </animated.g>
  )
}
