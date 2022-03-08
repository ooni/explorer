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

export const VirtualRows = ({ itemData, tooltipIndex }) => {

  const {reshapedData, rows, rowLabels, gridHeight, indexBy, yAxis } = itemData
  const parentRef = React.useRef()
  const keepMountedRangeExtractor = useKeepMountedRangeExtractor()

  const rowVirtualizer = useVirtual({
    size: itemData.rows.length,
    parentRef,
    estimateSize: useCallback(() => ROW_HEIGHT, []),
    overscan: 0,
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
                rowIndex={virtualRow.index}
                data={reshapedData[rows[virtualRow.index]]}
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