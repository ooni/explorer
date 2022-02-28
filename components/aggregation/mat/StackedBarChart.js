import React, { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'
import { Box, Flex, Heading, Link } from 'ooni-components'
import { IoMdGlobe } from 'react-icons/io'
import NLink from 'next/link'
import { useIntl } from 'react-intl'
import OONILogo from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochrome.svg'

import { colorMap } from './colorMap'
import { generateSearchQuery, CustomTooltipNoLink} from './CustomTooltip'
import CountryNameLabel from './CountryNameLabel'

const colorFunc = (d) => colorMap[d.id] || '#ccc'

// const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S")
// const formatDay = d3.timeFormat("%Y-%m-%d")

export const StackedBarChart = ({ data, query }) => {
  const intl = useIntl()
  const [link, setLink] = useState(false)

  const onClick = useCallback(({ data }) => {
    const searchQuery = generateSearchQuery(data, query)
    const queryString = new URLSearchParams(searchQuery).toString()
    const linkLabel = `Show ${query.test_name} measurements for ${data[query.axis_x]} (${intl.formatNumber(data.measurement_count)})`
    setLink(<NLink href={`/search?${queryString}`} passHref><Link> {linkLabel} </Link></NLink>)
  }, [intl, query])

  const chartMeta = useMemo(() => {
    // TODO Move charting related transformations to Charts.js
    if (data) {
      let cols = [
        'anomaly_count',
        'confirmed_count',
        'failure_count',
        'ok_count',
      ]
      let indexBy = ''
      indexBy = query['axis_x']
      return {
        data: data.data.result,
        dimensionCount: data.data.dimension_count,
        url: data.url,
        loadTime: data.loadTime,
        cols,
        indexBy
      }
    } else {
      return null
    }
  }, [data, query])

  if (chartMeta === null) {
    return (<div />)
  }

  return (
    <Flex flexDirection={['column']} height={'100%'} sx={{ position: 'relative' }}>
      <Flex justifyContent='space-between' alignItems='center'>
        <Heading h={3}><CountryNameLabel countryCode={query.probe_cc} /></Heading>
        <Box>
          {link ? (
          <Flex alignItems='center'>
            <Box mx={1}>
              <IoMdGlobe size={18} />
            </Box>
            <Box>
              {link}
            </Box>
          </Flex>
          ): (
            <div />
            // <Box> Click on a bar to explore the measurements aggregated in the column </Box>
          )}
        </Box>
      </Flex>
      <Box height={'100%'}>
        <ResponsiveBar
          data={chartMeta.data}
          keys={chartMeta.cols}
          indexBy={chartMeta.indexBy}
          margin={{ top: 50, right: 80, bottom: 100, left: 80 }}
          padding={0.3}
          colors={colorFunc}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 45,
            legend: `${chartMeta.indexBy}`,
            legendPosition: 'middle',
            legendOffset: 60
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'measurement count',
            legendPosition: 'middle',
            legendOffset: -60
          }}
          labelSkipWidth={80}
          labelSkipHeight={20}
          labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 100,
              itemsSpacing: 2,
              itemWidth: 200,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              onClick: (d, e) => { alert(`Toggle ${JSON.stringify(d)}`)},
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          tooltip={CustomTooltipNoLink}
          onClick={onClick}
        />
      </Box>
      <Box sx={{ position: 'absolute', opacity: 0.8, bottom: -70, right: 0 }}>
        <OONILogo height='32px' />
      </Box>
    </Flex>
  )
}

StackedBarChart.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.shape({
      dimension_count: PropTypes.number,
      result: PropTypes.array,
    }),
    loadTime: PropTypes.number,
    url: PropTypes.string
  }),
  query: PropTypes.object
}
