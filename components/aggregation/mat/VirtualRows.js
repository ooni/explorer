import PropTypes from 'prop-types'
import { useCallback, useRef } from 'react'

import { defaultRangeExtractor, useVirtual } from 'react-virtual'
import RowChart from './RowChart'

const GRID_ROW_CSS_SELECTOR = 'outerListElement'
const ROW_HEIGHT = 70
const retainMountedRows = false

const useKeepMountedRangeExtractor = () => {
  const renderedRef = useRef(new Set())

  const rangeExtractor = useCallback((range) => {
    renderedRef.current = new Set([
      ...renderedRef.current,
      ...defaultRangeExtractor(range),
    ])
    return Array.from(renderedRef.current)
  }, [])

  return rangeExtractor
}

export const VirtualRows = ({
  data,
  rows,
  rowLabels,
  gridHeight,
  indexBy,
  tooltipIndex,
  xAxis = null,
}) => {
  const parentRef = useRef()
  const keepMountedRangeExtractor = useKeepMountedRangeExtractor()

  const keyExtractor = useCallback((index) => rows[index], [rows])

  const rowVirtualizer = useVirtual({
    size: Object.keys(rows).length,
    parentRef,
    estimateSize: useCallback(() => ROW_HEIGHT, []),
    paddingStart: 62, // for the sticky x-axis
    overscan: 0,
    keyExtractor,
    rangeExtractor: retainMountedRows
      ? keepMountedRangeExtractor
      : defaultRangeExtractor,
  })

  return (
    <div
      ref={parentRef}
      className={`flex w-full overflow-y-auto ${GRID_ROW_CSS_SELECTOR}`}
      style={{
        height: gridHeight,
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {xAxis && <div className="bg-white sticky z-[1] top-0">{xAxis}</div>}
        {rowVirtualizer.virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
              zIndex: tooltipIndex[0] === virtualRow.index ? 1 : 0,
            }}
          >
            <RowChart
              key={virtualRow.key}
              rowIndex={virtualRow.index}
              data={data.get(rows[virtualRow.index])}
              indexBy={indexBy}
              height={virtualRow.size}
              label={rowLabels[rows[virtualRow.index]]}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
VirtualRows.propTypes = {
  data: PropTypes.objectOf(PropTypes.array).isRequired,
  gridHeight: PropTypes.number.isRequired,
  indexBy: PropTypes.string.isRequired,
  rowLabels: PropTypes.objectOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.string).isRequired,
  tooltipIndex: PropTypes.array.isRequired,
}
