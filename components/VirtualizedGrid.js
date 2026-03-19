import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { AutoSizer, List, WindowScroller } from 'react-virtualized'

export const GridBox = ({
  title,
  count = null,
  href,
  tag,
  multiCount = null,
}) => {
  const hasCount = Number.isInteger(count)

  return (
    <Link href={href} prefetch={false}>
      <div className="flex flex-col group p-3 justify-between min-h-[150px] border border-gray-300 hover:border-blue-500 relative text-black ">
        <div className="font-bold group-hover:text-blue-500">{title}</div>
        <div className="text-xs">
          {(hasCount || tag) && (
            <>
              {tag && <div className="mb-2">{tag}</div>}
              {hasCount && (
                <FormattedMessage
                  id="Network.Summary.Country.Measurements"
                  values={{
                    measurementsTotal: (
                      <span className="font-bold text-blue-500">{count}</span>
                    ),
                  }}
                />
              )}
            </>
          )}

          {multiCount && (
            <>
              {Object.entries(multiCount).map(([key, value]) => (
                <div className="mb-1" key={key}>
                  <span className="font-bold text-blue-500">{value} </span>
                  <FormattedMessage
                    id={`Domain.CountriesBlocking.CountryList.${key}`}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

const VirtualizedGrid = ({ data }) => {
  return (
    <WindowScroller>
      {({ height, onChildScroll, scrollTop, registerChild, isScrolling }) => (
        <AutoSizer disableHeight>
          {({ width }) => {
            const itemsPerRow = width > 767 ? 4 : 2
            const rowCount = Math.ceil(data.length / itemsPerRow)
            return (
              <div ref={registerChild}>
                <List
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  rowCount={rowCount}
                  rowHeight={166}
                  rowRenderer={({ key, index, style }) => {
                    const fromIndex = index * itemsPerRow
                    const toIndex = Math.min(
                      fromIndex + itemsPerRow,
                      data.length,
                    )
                    const itemsToAdd = []
                    for (let idx = fromIndex; idx < toIndex; idx++) {
                      const item = data[idx]
                      itemsToAdd.push(
                        <GridBox
                          key={item.id}
                          href={item.href}
                          title={item.title}
                          tag={item.tag}
                          count={item.count}
                        />,
                      )
                    }

                    return (
                      <div
                        className="grid gap-4 mb-4"
                        style={{
                          gridTemplateColumns: Array(itemsPerRow)
                            .fill('1fr')
                            .join(' '),
                          ...style,
                        }}
                        key={key}
                      >
                        {itemsToAdd}
                      </div>
                    )
                  }}
                  scrollTop={scrollTop}
                  width={width}
                />
              </div>
            )
          }}
        </AutoSizer>
      )}
    </WindowScroller>
  )
}

export default VirtualizedGrid
