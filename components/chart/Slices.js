import { useCallback, createElement } from 'react'
import { useTooltip } from '@nivo/tooltip'

const SlicesItem = ({ slice, axis, debug, tooltip, isCurrent, setCurrent }) => {
  const { showTooltipFromEvent, hideTooltip } = useTooltip()

  const handleMouseEnter = useCallback(
    (event) => {
      showTooltipFromEvent(
        createElement(tooltip, { slice, axis }),
        event,
        'right',
      )
      setCurrent(slice)
    },
    [showTooltipFromEvent, tooltip, slice],
  )

  const handleMouseMove = useCallback(
    (event) => {
      showTooltipFromEvent(
        createElement(tooltip, { slice, axis }),
        event,
        'right',
      )
    },
    [showTooltipFromEvent, tooltip, slice],
  )

  const handleMouseLeave = useCallback(() => {
    hideTooltip()
    setCurrent(null)
  }, [hideTooltip])

  return (
    <rect
      x={slice.x0}
      y={slice.y0}
      width={slice.width}
      height={slice.height}
      stroke="red"
      strokeWidth={debug ? 1 : 0}
      strokeOpacity={0.75}
      fill="red"
      fillOpacity={isCurrent && debug ? 0.35 : 0}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  )
}

const Slices = (props) => {
  const {
    width,
    axis,
    debug,
    height,
    tooltip,
    sliceTooltip,
    currentSlice,
    setCurrentSlice,
    points,
    enableSlices,
    debugSlices,
  } = props

  const map = new Map()

  points.forEach((point) => {
    if (point.data.x === null || point.data.y === null) return
    if (new Date(point.data.x).getMinutes() !== 0) return
    if (!map.has(point.x)) map.set(point.x, [point])
    else map.get(point.x).push(point)
  })

  const slices = Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([x, slicePoints], i, slices) => {
      const prevSlice = slices[i - 1]
      const nextSlice = slices[i + 1]

      let x0
      if (!prevSlice) x0 = x
      else x0 = x - (x - prevSlice[0]) / 2

      let sliceWidth
      if (!nextSlice) sliceWidth = width - x0
      else sliceWidth = x - x0 + (nextSlice[0] - x) / 2

      return {
        id: x,
        x0,
        x,
        y0: 0,
        y: 0,
        width: sliceWidth,
        height,
        points: slicePoints.reverse(),
      }
    })

  return slices.map((slice) => (
    <SlicesItem
      key={slice.id}
      slice={slice}
      axis={enableSlices}
      debug={debugSlices}
      height={height}
      tooltip={sliceTooltip}
      sliceTooltip={sliceTooltip}
      setCurrent={setCurrentSlice}
      isCurrent={currentSlice !== null && currentSlice?.id === slice?.id}
    />
  ))
}

export default Slices
