/* global process */

import React from 'react'
import { Flex, Box, Text, Heading } from 'ooni-components'
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis, VictoryLabel, VictoryTooltip, VictoryVoronoiContainer } from 'victory'
import { theme } from 'ooni-components'
import useSWR from 'swr'
import countryUtil from 'country-util'
import styled from 'styled-components'

// import wdata from './website-data'  // static data for offline mode
import { Debug } from './Debug'
import { paramsToQuery } from './queryUtils'
import VictoryTheme from '../../VictoryTheme'
import WebsiteStatsChartLoader from './ChartLoader'

const AGGREGATION_API = `${process.env.NEXT_PUBLIC_MEASUREMENTS_URL}/api/v1/aggregation?`

const dataFetcher = url => (
  fetch(AGGREGATION_API + url).then(r => r.json())
)

const colorScale = [
  theme.colors.green8,
  theme.colors.gray6,
  theme.colors.yellow9,
  theme.colors.red7,
]

const themeOverride = Object.assign({}, VictoryTheme, {})
themeOverride.axis.style.axis.strokeWidth = 0
themeOverride.axis.style.ticks.size = 0

const Bold = styled.span`
  font-weight: bold
`

const WebsiteInCountry = ({ params }) => {

  const query = paramsToQuery(params)

  const { data, error } = useSWR(query, dataFetcher)
  // const data = wdata, error = null

  return (
    <Flex flexDirection='column'>
      <Text fontSize={36} my={3}>
        <Bold>{params.input}</Bold> in <Bold>{countryUtil.territoryNames[params.probe_cc]}</Bold>
      </Text>
      <Text fontSize={24}>
        from <Bold>{params.since}</Bold> to <Bold>{params.until}</Bold>
      </Text>
      {!data && !error && <Box m={5}><WebsiteStatsChartLoader /></Box>}
      {data &&
        <VictoryChart
          width={800}
          height={200}
          domainPadding={{ x: 30, y: 20 }}
          theme={themeOverride}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension='x'
            />
          }
        >
          <VictoryStack colorScale={colorScale}
            labels={(d) => '' + d.measurement_start_day + '\n \n'
              + 'ok count - ' + d.measurement_count + '\n'
              + 'anomaly count - ' + d.anomaly_count + '\n'
              + 'confirmed count - ' + d.confirmed_count + '\n'
              + 'failure count - ' + d.failure_count
            }
            labelComponent={<VictoryTooltip />}
          >
            {[ 'measurement_count', 'failure_count', 'anomaly_count', 'confirmed_count'].map(key =>
              <VictoryBar
                key={key}
                name={key}
                data={data.result}
                x='measurement_start_day'
                y={d => {
                  if (key === 'measurement_count') {
                    return d.measurement_count - (d.anomaly_count + d.failure_count + d.confirmed_count)
                  } else {
                    return d[key]
                  }
                }}
              />
            )}
          </VictoryStack>
          <VictoryAxis
            scale={{ x: 'time' }}
            fixLabelOverlap
            tickLabelComponent={
              <VictoryLabel angle={270} dy={0} textAnchor='end' verticalAnchor='middle' />
            }
          />
        </VictoryChart>}
      <Debug params={params}>
        <pre>
          {error && <p>{error}</p>}
          {!data && !error && <p> Loading data... </p>}
          {data && JSON.stringify(data, null, 2)}
        </pre>
      </Debug>
    </Flex>
  )
}

export default WebsiteInCountry
