import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { Flex } from 'ooni-components'

import RowChart from './RowChart'
import { defaultRangeExtractor, useVirtual } from 'react-virtual'

const GRID_ROW_CSS_SELECTOR = 'outerListElement'
const ROW_HEIGHT = 70
const retainMountedRows = false

const useKeepMountedRangeExtractor = () => {
  const renderedRef = React.useRef(new Set())

  const rangeExtractor = React.useCallback(range => {
    renderedRef.current = new Set([
      ...renderedRef.current,
      ...defaultRangeExtractor(range)
    ])
    return Array.from(renderedRef.current)
  }, [])

  return rangeExtractor
}

export const VirtualRows = ({ data, rows, rowLabels, gridHeight, indexBy, tooltipIndex }) => {

  const parentRef = React.useRef()
  const keepMountedRangeExtractor = useKeepMountedRangeExtractor()

  const keyExtractor = useCallback((index) => rows[index], [rows])

  const rowVirtualizer = useVirtual({
    size: Object.keys(rows).length,
    parentRef,
    estimateSize: useCallback(() => ROW_HEIGHT, []),
    overscan: 0,
    keyExtractor,
    rangeExtractor: retainMountedRows ? keepMountedRangeExtractor : defaultRangeExtractor
  })

  return (
    <Flex>
      <div
        ref={parentRef}
        className={GRID_ROW_CSS_SELECTOR}
        style={{
          height: gridHeight,
          width: '100%',
          overflow: 'auto'
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: '100%',
            position: 'relative'
          }}
        >
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
                zIndex: tooltipIndex[0] === virtualRow.index ? 1 : 0
              }}
            >
              <RowChart
                key={virtualRow.key}
                rowIndex={virtualRow.index}
                data={data[rows[virtualRow.index]]}
                indexBy={indexBy}
                height={virtualRow.size}
                label={rowLabels[rows[virtualRow.index]]}
              />
            </div>
          ))}
          </div>
        </div>
    </Flex>
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
