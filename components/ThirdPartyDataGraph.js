import { useState, useEffect, useMemo, createContext, useCallback, createElement, useContext, MutableRefObject, MouseEvent, memo } from 'react'
import axios from 'axios'
import { ResponsiveLine } from '@nivo/line'
import { useTooltip } from '@nivo/tooltip'
import { Box, Flex, Text, theme } from 'ooni-components'
import dayjs from 'services/dayjs'
import { useIntl } from 'react-intl'
import SectionHeader from './country/SectionHeader'
import { SimpleBox } from './country/boxes'
import FormattedMarkdown from './FormattedMarkdown'

const iodaLineColors = [theme.colors.blue5, theme.colors.red5, theme.colors.green5, theme.colors.fuchsia5]

const SlicesItem = ({ slice, axis, debug, tooltip, isCurrent, setCurrent }) => {
  const { showTooltipFromEvent, hideTooltip } = useTooltip()

  const handleMouseEnter = useCallback(
    event => {
      showTooltipFromEvent(createElement(tooltip, { slice, axis }), event, 'right')
      setCurrent(slice)
    },
    [showTooltipFromEvent, tooltip, slice]
  )

  const handleMouseMove = useCallback(
    event => {
      showTooltipFromEvent(createElement(tooltip, { slice, axis }), event, 'right')
    },
    [showTooltipFromEvent, tooltip, slice]
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
  const { width, axis, debug, height, tooltip, sliceTooltip, currentSlice, setCurrentSlice, points, enableSlices, debugSlices } = props

  const map = new Map()

  points.forEach(point => {
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

  return slices.map(slice => (
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

const ThirdPartyDataGraph = ({since, until, country, asn, ...props}) => {
  const intl = useIntl()
  const location = country || asn
  const [graphData, setGraphData] = useState([])

  const cloudflareData = useEffect(() => {
    setGraphData([])

    // make sure the date is not in the future to avoid receiving error from CloudFlare
    const to = dayjs(until).isBefore(dayjs(), 'day') ? dayjs.utc(until) : dayjs().subtract(30, 'minute').utc()
    const from = dayjs.utc(since)

    axios({
      method: 'get',
      url: `/api/cloudflare?from=${from.toISOString().split('.')[0]+'Z'}&to=${to.toISOString().split('.')[0]+'Z'}&${asn ? `asn=${asn}` : `country=${country}`}`,
    }).then(({data}) => {
      const ruData = data.timestamps.map((st, i) => {
        return {
          'x': st,
          'y': Number(data.values[i])
        }
      })
      setGraphData((oldVal) => {
        return [...oldVal, {
          'id': intl.formatMessage({id:'ThirdPartyGraph.Label.cloudflare'}),
          'color': theme.colors.yellow5,
          'data': ruData,
        }]
      })
    }).catch(() => {})

    axios({
        method: 'get',
        url: country ? 
          `https://api.ioda.inetintel.cc.gatech.edu/v2/signals/raw/country/${location}?from=${Math.round(from.valueOf()/1000)}&until=${Math.round(to.valueOf()/1000)}&sourceParams=WEB_SEARCH` : 
          `https://api.ioda.inetintel.cc.gatech.edu/v2/signals/raw/asn/${location}?from=${Math.round(from.valueOf()/1000)}&until=${Math.round(to.valueOf()/1000)}&sourceParams=WEB_SEARCH`,
    }).then(({data}) => {
      const graphData2 = data.data[0].map((item, i) => {
        const max = Math.max(...item.values)
        const values = item.values.map((val, i) => {
          const time = dayjs(item.from * 1000).add(item.step * i, 'second').utc().toISOString().split('.')[0]+'Z'
          return {x: time, y: val ? val / max : null}
        })
        return {
          'id': intl.formatMessage({id: `ThirdPartyGraph.Label.${item.datasource}`}),
          'color': iodaLineColors[i],
          'data': values
        }
      })

      setGraphData((oldVal) => {
        return [...oldVal, ...graphData2]
      })
    })
  }, [since, until])

  return (
    <>
      <SectionHeader>
        <SectionHeader.Title name='outages'>
          {intl.formatMessage({id: 'Country.Outages'})}
        </SectionHeader.Title>
      </SectionHeader>
      <SimpleBox>
        <Text fontSize={16}>
          <FormattedMarkdown 
            id='Country.Outages.Description'
            values={{
              'ioda-link': (string) => (`[${string}](https://ioda.inetintel.cc.gatech.edu/country/${country})`),
              'cloudflare-link': (string) => (`[${string}](https://radar.cloudflare.com/${country})`)
            }}
          />
        </Text>
      </SimpleBox>

      <Box style={{width: '100%',height: '500px'}}>
        {!!graphData.length && 
          <ResponsiveLine
            data={graphData}
            margin={{ top: 50, right: 20, bottom: 70, left: 30 }}
            enablePoints={false}
            lineWidth={1}
            xScale={{
              type: 'time',
              format: '%Y-%m-%dT%H:%M:%SZ',
              precision: 'minute',
              useUTC: true,
            }}
            yScale={{
              type: 'linear',
              stacked: false,
              min: 0,
              max: 1
            }}
            // xFormat="time:%Hh"
            axisBottom={{
              format: '%Y-%m-%d',
            }}
            enableSlices='x'
            // debugSlices={true}
            // useMesh={true}
            colors={d => d.color}

            layers={[
              'grid',
              // 'markers',
              'axes',
              // 'areas',
              // 'points',
              'lines',
              // 'mesh',
              'legends',
              'crosshair',
              Slices,
            ]}

            sliceTooltip={(props) => {
              if (props?.slice?.points?.length) {
                const points = props.slice.points
                return (
                  <div
                    style={{
                      background: 'white',
                      padding: '9px 12px',
                      border: '1px solid #ccc',
                    }}
                  >
                    <Text fontWeight='bold' mb={2}>{new Intl.DateTimeFormat(intl.locale, { dateStyle: 'long', timeStyle: 'long', timeZone: 'UTC' }).format(new Date(points[0].data.x))}</Text>
                    {points.map((point) => (
                      <Flex key={point.id} alignItems='center'>
                        <Box
                          key={point.id}
                          style={{
                            backgroundColor: point.serieColor,
                            padding: '3px 0',
                            width: '10px',
                            height: '10px',
                          }}
                        />
                        <Box ml={2}><strong>{point.serieId}</strong> [{Number(point.data.yFormatted).toFixed(4)}]</Box>
                      </Flex>
                    ))}
                  </div>
                )
              }
            }}



            // data={graphData}
            // curve="monotoneX"
            // enableSlices='x'
            // animate={true}
            // margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            // xScale={{ 
            //   type: 'time',
            //   format: '%Y-%m-%d',
            //   useUTC: true,
            //   precision: 'day',
            // }}
            // yScale={{
            //     type: 'linear',
            //     min: 'auto',
            //     max: 'auto',
            //     stacked: false,
            //     reverse: false
            // }}
            // // yFormat=" >-.2f"
            // // axisTop={null}
            // // axisRight={null}
            // axisBottom={{
            //   format: '%Y-%m-%d',
            //   orient: 'bottom',
            //   tickSize: 5,
            //   tickPadding: 5,
            //   tickRotation: 0,
            //   legend: 'date',
            //   legendOffset: 36,
            //   legendPosition: 'middle',
            //   tickValues: 6
            // }}
            // axisLeft={{
            //     orient: 'left',
            //     tickSize: 5,
            //     tickPadding: 5,
            //     tickRotation: 0,
            //     legend: 'count',
            //     legendOffset: -40,
            //     legendPosition: 'middle'
            // }}
            // pointSize={10}
            // pointColor={{ theme: 'background' }}
            // pointBorderWidth={2}
            // pointBorderColor={{ from: 'serieColor' }}
            // pointLabelYOffset={-12}
        
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                // justify: false,
                // translateX: 100,
                translateY: 70,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 140,
                itemHeight: 20,
                // itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                // effects: [{
                //   on: 'hover',
                //   style: {
                //     itemBackground: 'rgba(0, 0, 0, .03)',
                //     itemOpacity: 1
                //   }
                // }]
              }
            ]}
          />
        }
      </Box>
    </>
  )
}

export default memo(ThirdPartyDataGraph)