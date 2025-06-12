import { animated, to } from '@react-spring/web'
import { useCallback, useEffect, useState } from 'react'
import { blockingTypeColors as colors } from './colorMap'

const CustomBarComponent = (props) => {
  const {
    bar: { data, width, ...bar },
    style: {
      borderColor,
      color,
      height,
      // labelColor,
      // labelOpacity,
      // labelX,
      // labelY,
      transform,
      //   width,
      // textAnchor,
    },
    borderRadius,
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
  } = props
  const [extraBorderWidth, setExtraBorderWidth] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const detailedData = data?.data?.loni
  const selectedDateData = detailedData?.[data?.id]

  const heightValue = bar.height
  const heightScalePercentage = heightValue
  const okHeightInPX = selectedDateData?.ok * heightScalePercentage
  const blockedHeightInPX = selectedDateData?.blocked * heightScalePercentage
  const downHeightInPX = selectedDateData?.down * heightScalePercentage

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

  useEffect(() => {
    // We receive tooltip coordinates in `enableLabel`
    // to determine if a tooltip is enabled and if the column should be highlighted.
    if (enableLabel === false) {
      // hideTooltip()
      setExtraBorderWidth(0)
    } else {
      setExtraBorderWidth(enableLabel === data.indexValue ? 0.8 : 0)
    }
  }, [data.indexValue, enableLabel])

  return (
    <animated.g
      stroke={borderColor}
      transform={transform}
      opacity={isHovering ? 0.8 : 1}
      strokeWidth={borderWidth + extraBorderWidth}
      onMouseEnter={isInteractive ? handleMouseEnter : undefined}
      onMouseLeave={isInteractive ? handleMouseLeave : undefined}
      onClick={isInteractive ? handleClick : undefined}
    >
      {/* Blocked - bottom */}
      <animated.rect
        width={to(width, (value) => Math.max(value, 0))}
        height={to(blockedHeightInPX, (value) => Math.max(value, 0))}
        y={to(height, (value) => value - blockedHeightInPX)}
        fill={colors[data.id].blocked}
        data-testid={`bar.item.${data.id}.${data.index}.blocked`}
      />
      {/* Down - middle */}
      <animated.rect
        width={to(width, (value) => Math.max(value, 0))}
        height={to(downHeightInPX, (value) => Math.max(value, 0))}
        y={to(height, (value) => value - (downHeightInPX + blockedHeightInPX))}
        fill={colors[data.id].down}
        data-testid={`bar.item.${data.id}.${data.index}.down`}
      />
      {/* OK - top */}
      <animated.rect
        width={to(width, (value) => Math.max(value, 0))}
        height={to(okHeightInPX, (value) => Math.max(value, 0))}
        y={to(
          height,
          (value) =>
            value - (okHeightInPX + downHeightInPX + blockedHeightInPX),
        )}
        fill={colors[data.id].ok}
        data-testid={`bar.item.${data.id}.${data.index}.ok`}
      />
    </animated.g>
  )
}

export default CustomBarComponent
