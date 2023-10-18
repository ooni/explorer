import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { Flex } from 'ooni-components'
import styled from 'styled-components'

import RowChart from './RowChart'
import { defaultRangeExtractor, useVirtual } from 'react-virtual'

const GRID_ROW_CSS_SELECTOR = 'outerListElement'
const ROW_HEIGHT = 70
const retainMountedRows = false

const FlexWithNoScrollbar = styled(Flex)`
  width: 100%;
  overflow-y: auto;
`
const StickyRow = styled.div`
  position: sticky;
  top: 0px;
  background: white;
  z-index: 1;
`

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

export const VirtualRows = ({ data, rows, rowLabels, gridHeight, indexBy, tooltipIndex, xAxis = null }) => {

  const parentRef = React.useRef()
  const keepMountedRangeExtractor = useKeepMountedRangeExtractor()

  const keyExtractor = useCallback((index) => rows[index], [rows])

  const rowVirtualizer = useVirtual({
    size: Object.keys(rows).length,
    parentRef,
    estimateSize: useCallback(() => ROW_HEIGHT, []),
    paddingStart: 62, // for the sticky x-axis
    overscan: 0,
    keyExtractor,
    rangeExtractor: retainMountedRows ? keepMountedRangeExtractor : defaultRangeExtractor
  })

  return (
    <FlexWithNoScrollbar
      ref={parentRef}
      className={GRID_ROW_CSS_SELECTOR}
      style={{
        height: gridHeight,
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {xAxis &&
          <StickyRow>
            {xAxis}
          </StickyRow>
        }
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
              data={data.get(rows[virtualRow.index])}
              indexBy={indexBy}
              height={virtualRow.size}
              label={rowLabels[rows[virtualRow.index]]}
            />
          </div>
        ))}
      </div>
    </FlexWithNoScrollbar>
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
