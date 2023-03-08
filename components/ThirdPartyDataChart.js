import { useState, useEffect, memo } from 'react'
import axios from 'axios'
import { ResponsiveLine } from '@nivo/line'
import { Box, Flex, Text, Heading, theme } from 'ooni-components'
import dayjs from 'services/dayjs'
import { useIntl } from 'react-intl'
import SectionHeader from './country/SectionHeader'
import { SimpleBox } from './country/boxes'
import FormattedMarkdown from './FormattedMarkdown'
import Slices from 'components/chart/Slices'

const iodaLineColors = {
  gtr: theme.colors.blue5,
  'merit-nt': theme.colors.red5,
  bgp: theme.colors.green5,
  'ping-slash24': theme.colors.fuchsia5
}


const SectionText = ({location, asn, country}) => (
  <FormattedMarkdown 
    id='Country.Outages.Description'
    values={{
      'ioda-link': (string) => (`[${string}](https://ioda.inetintel.cc.gatech.edu/${country ? 'country' : 'asn'}/${location})`),
      'cloudflare-link': (string) => (`[${string}](https://radar.cloudflare.com/${asn ? 'as' : ''}${location})`)
    }}
  />
)
const ThirdPartyDataChart = ({since, until, country, asn, ...props}) => {
  const intl = useIntl()
  const location = country || asn
  const [graphData, setGraphData] = useState([])

  const cloudflareData = useEffect(() => {
    if (!since && !until) return 
    
    setGraphData([])

    // make sure the date is not in the future to avoid receiving error from CloudFlare
    const to = dayjs(until).isBefore(dayjs(), 'day') ? 
      dayjs.utc(until).toISOString() : 
      dayjs().subtract(30, 'minute').utc().toISOString()
    const from = dayjs.utc(since).toISOString()

    Promise.all([
      axios.get(`/api/cloudflare?from=${from}&to=${to}&${asn ? `asn=${asn}` : `country=${country}`}`),
      axios.get(`/api/ioda?from=${from}&to=${to}&${asn ? `asn=${asn}` : `country=${country}`}`)
    ]).then(([{data : cloudflareData}, {data: iodaData}]) => {
      const cloudflareChartData = {
        'id': intl.formatMessage({id:'ThirdPartyChart.Label.cloudflare'}),
        'color': theme.colors.yellow5,
        'data': cloudflareData,
      }
      const iodaChartData = iodaData.map((item) => {
        return {
          'id': intl.formatMessage({id: `ThirdPartyChart.Label.${item.datasource}`}),
          'color': iodaLineColors[item.datasource],
          'data': item.values
        }
      })
      setGraphData([...iodaChartData, cloudflareChartData])
    })
  }, [since, until])

  return (
    <>
      {/* keep distinct styles for country and network pages */}
      {country ? (
        <>
          <SectionHeader>
            <SectionHeader.Title name='outages'>
              {intl.formatMessage({id: 'Country.Outages'})}
            </SectionHeader.Title>
          </SectionHeader>
          <SimpleBox>
            <Text fontSize={16}>
              <SectionText location={location} asn={asn} country={country} />
            </Text>
          </SimpleBox>
        </>
      ) : (
        <>
          <Heading h={3}>{intl.formatMessage({id: 'Country.Outages'})}</Heading>
          <SectionText location={location} asn={asn} country={country} />
        </>
      )}

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
            axisBottom={{
              format: '%Y-%m-%d',
            }}
            enableSlices='x'
            colors={d => d.color}
            layers={[
              'grid',
              'axes',
              'lines',
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
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                translateY: 70,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 140,
                itemHeight: 20,
                symbolSize: 12,
                symbolShape: 'circle',
              }
            ]}
          />
        }
      </Box>
    </>
  )
}

export default memo(ThirdPartyDataChart)