import PropTypes from 'prop-types'
import { useCallback, useRef } from 'react'

import { useVirtualizer } from '@tanstack/react-virtual'
import RowChart from './RowChart'

const GRID_ROW_CSS_SELECTOR = 'outerListElement'
const ROW_HEIGHT = 70

export const VirtualRows = ({
  data,
  rows,
  rowLabels,
  gridHeight,
  indexBy,
  tooltipIndex,
  xAxis = null,
}) => {
  const parentRef = useRef(null)
  const rowVirtualizer = useVirtualizer({
    count: Object.keys(rows).length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => ROW_HEIGHT, []),
    paddingStart: 62, // for the sticky x-axis
    overscan: 0,
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
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {xAxis && <div className="bg-white sticky z-[1] top-0">{xAxis}</div>}
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
              zIndex: tooltipIndex[0] === virtualItem.index ? 1 : 0,
            }}
          >
            <RowChart
              key={virtualItem.key}
              rowIndex={virtualItem.index}
              data={data.get(rows[virtualItem.index])}
              indexBy={indexBy}
              height={virtualItem.size}
              label={rowLabels[rows[virtualItem.index]]}
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
