import { useState, useEffect } from 'react'
import axios from 'axios'
import { ResponsiveLine } from '@nivo/line'
import { Box, Flex, Text, theme } from 'ooni-components'
import dayjs from 'services/dayjs'
import { useIntl } from 'react-intl'
import SectionHeader from './country/SectionHeader'
import { SimpleBox } from './country/boxes'
import FormattedMarkdown from './FormattedMarkdown'

const iodaLineColors = [theme.colors.blue5, theme.colors.red5, theme.colors.green5, theme.colors.fuchsia5]

const ThirdPartyDataGraph = ({since, until, country, asn, ...props}) => {
  console.log('TEST', props)
  const intl = useIntl()
  const location = country || asn
  const [graphData, setGraphData] = useState([])

  const cloudflareData = useEffect(() => {
    setGraphData([])

    const to = dayjs.utc(until)
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
  }, [])
  console.log('graphData', graphData)
  return (
    <>
      <SectionHeader>
        <SectionHeader.Title name='shutdowns'>
          {intl.formatMessage({id: 'Country.Heading.Shutdowns'})}
        </SectionHeader.Title>
      </SectionHeader>
      <SimpleBox>
        <Text fontSize={16}>
          <FormattedMarkdown id='Country.Shutdowns.Description' />
        </Text>
      </SimpleBox>

      <Box style={{width: '100%',height: '500px'}}>
        {!!graphData.length && 
          <ResponsiveLine
            data={graphData}
            margin={{ top: 50, right: 20, bottom: 70, left: 30 }}
            enablePoints={false}
            lineWidth={2}
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
            // enableSlices='x'
            useMesh={true}
            colors={d => d.color}



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

export default ThirdPartyDataGraph