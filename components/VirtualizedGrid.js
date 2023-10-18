import React from 'react'
import debounce from 'lodash.debounce'
import styled from 'styled-components'
import NLink from 'next/link'
import { Container, Text, Box, Flex, Link, Heading } from 'ooni-components'
import Head from 'next/head'
import { FormattedMessage } from 'react-intl'
import { List, WindowScroller, AutoSizer, Table, Column } from 'react-virtualized'

const StyledLink = styled(Link)`
&:hover {
  filter: none;
}
`

const StyledName = styled(Text)`
`

const StyledFlex = styled(Flex)`
border: 1px solid ${props => props.theme.colors.gray3};
position: relative;
color: black;
flex-flow: column;

&:hover {
  border-color: ${props => props.theme.colors.blue5};
  ${StyledName} {
    color: ${props => props.theme.colors.blue5};
  }
}
`

export const GridBox = ({ title, count = null, href, tag, multiCount = null }) => {
  const hasCount = Number.isInteger(count)
  return (
    <Box>
      <NLink passHref href={href}>
        <StyledLink>
          <StyledFlex p={3} justifyContent='space-between' minHeight={150}>
            <Box>
              <StyledName fontSize={1} fontWeight={600} >{title}</StyledName>
            </Box>
            {(hasCount || tag) && 
              <Text fontSize={12}>
                {tag && 
                  <Box mb={2}>{tag}</Box>
                }
                {hasCount && 
                  <FormattedMessage
                    id='Network.Summary.Country.Measurements'
                    values={{measurementsTotal: <Text as='span' fontWeight={600} color='blue5'>{count}</Text>}} 
                  />
                }
              </Text>
            }
            {multiCount && 
              <Text fontSize={12}>
                {Object.entries(multiCount).map(([key, value]) => (
                  <Box mb={1} key={key}>
                    <Text as='span' fontWeight={600} color='blue5'>{value} </Text>
                    <FormattedMessage id={`Domain.CountriesBlocking.CountryList.${key}`} />
                  </Box>
                ))}
              </Text>
            }
          </StyledFlex>
        </StyledLink>
      </NLink>
    </Box>
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
                      data.length
                    )
                    let itemsToAdd = []
                    for (let idx = fromIndex; idx < toIndex; idx++) {
                      const item = data[idx]
                      itemsToAdd.push(
                        <GridBox 
                          key={item.id}
                          href={item.href}
                          title={item.title}
                          tag={item.tag}
                          count={item.count} />
                      )
                    }

                    return (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: Array(itemsPerRow).fill('1fr').join(' '),
                          gridGap: 3,
                          marginBottom: 3,
                        }}
                        key={key}
                        style={style}>
                        {itemsToAdd}
                      </Box>
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