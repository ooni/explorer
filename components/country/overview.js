import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Flex, Box, Text, Heading } from 'ooni-components'
import { VictoryChart, VictoryBar, VictoryStack, VictoryAxis, VictoryTheme, VictoryLine } from 'victory'

import SectionHeader from './section-header'
import { BoxWithTitle } from './box'
import { testGroups } from '../test-info'

const NwInterferenceStatus = styled(Box)`
  color: ${props => props.color || props.theme.colors.gray5};
  font-size: 18px;
`
NwInterferenceStatus.defaultProps = {
  mb: 3
}

const Overview = ({
  testCoverage,
  networkCoverage,
  middleboxCount,
  imCount,
  circumventionTools,
  websitesCount
}) => {
  let testCoverageGrouped = {}
  Object.keys(testGroups).forEach((testGroup) => {
    // Not interested in legacy and other groups
    if (testGroup === 'legacy' || testGroup === 'default') {
      return
    }
    testCoverageGrouped[testGroup] = testCoverage.filter((item) => (
      item.test_group == testGroup
    ))
  })

  return (
    <React.Fragment>
      <SectionHeader>
        <SectionHeader.Title name='overview'>
          <FormattedMessage id='Country.Heading.Overview' />
        </SectionHeader.Title>
      </SectionHeader>
      <BoxWithTitle title={<FormattedMessage id='Country.Overview.Heading.NwInterference' />}>
        <Flex flexWrap='wrap'>
          <NwInterferenceStatus width={1/2} color='violet8'>
            <FormattedMessage id='Country.Overview.NwInterference.Middleboxes'
              values={{ middleboxCount }}
            />
          </NwInterferenceStatus>
          <NwInterferenceStatus width={1/2} color='red'>
            <FormattedMessage id='Country.Overview.NwInterference.CircumventionTools'
              values={{ circumventionTools }}
            />
          </NwInterferenceStatus>
          <NwInterferenceStatus width={1/2} color='yellow9'>
            <FormattedMessage id='Country.Overview.NwInterference.IM'
              values={{ imCount }}
            />
          </NwInterferenceStatus>
          <NwInterferenceStatus width={1/2} color='indigo5'>
            <FormattedMessage id='Country.Overview.NwInterference.Websites'
              values={{ websitesCount }}
            />
          </NwInterferenceStatus>
        </Flex>
      </BoxWithTitle>
      <FormattedMessage id='Country.Overview.Heading.TestsByClass' />
      <Flex>
        <Box px={2}><FormattedMessage id='Tests.Groups.Webistes.Name' /></Box>
        <Box px={2}><FormattedMessage id='Tests.Groups.Instant Messagging.Name' /></Box>
        <Box px={2}><FormattedMessage id='Tests.Groups.Performance.Name' /></Box>
        <Box px={2}><FormattedMessage id='Tests.Groups.Middlebox.Name' /></Box>
        <Box px={2}><FormattedMessage id='Tests.Groups.Circumvention.Name' /></Box>
      </Flex>
      {/* Bar chart */}
      <Box>
        <VictoryChart
          domainPadding={20}
          theme={VictoryTheme.material}
          scale={{ x: 'time' }}
          width={800}
        >
          <VictoryAxis
            dependentAxis
          />
          <VictoryStack colorScale={['#4C6EF5', '#15AABF', '#BE4BDB', '#6741D9', '#CED4DA']}>
            {/* TOOD: Compose these stacked bar charts from a single component */}
            <VictoryBar
              data={testCoverageGrouped.websites}
              style={{
                data: {
                  stroke: '#ffffff',
                  strokeWidth: 1
                }
              }}
              x='date'
              y='count'
            />
            <VictoryBar
              data={testCoverageGrouped.im}
              style={{
                data: {
                  stroke: '#ffffff',
                  strokeWidth: 1
                }
              }}
              x='date'
              y='count'
            />
            <VictoryBar
              data={testCoverageGrouped.circumvention}
              style={{
                data: {
                  stroke: '#ffffff',
                  strokeWidth: 1
                }
              }}
              y='count'
              x='date'
            />
            <VictoryBar
              data={testCoverageGrouped.performance}
              style={{
                data: {
                  stroke: '#ffffff',
                  strokeWidth: 1
                }
              }}
              x='date'
              y='count'
            />
            <VictoryBar
              data={testCoverageGrouped.middlebox}
              style={{
                data: {
                  stroke: '#ffffff',
                  strokeWidth: 1
                }
              }}
              x='date'
              y='count'
            />
          </VictoryStack>
        </VictoryChart>
      </Box>
      <Box>
        <VictoryChart
          scale={{ x: 'time' }}
          height={150}
        >
          <VictoryAxis
            dependentAxis
            style={{ axis: { stroke: 'none'}}}
            tickFormat={() => (null)}
          />
          <VictoryLine
            data={networkCoverage}
            x='date'
            y='count'
            style={{
              data: {
                stroke: '#0588CB',
              }
            }}
          />
        </VictoryChart>
      </Box>

      <BoxWithTitle title={<FormattedMessage id='Country.Overview.Heading.FeaturedResearch' />}>
        List of blog articles
      </BoxWithTitle>
      {/* Highlight Box */}
      <FormattedMessage
        id='Country.Overview.SummaryTextTemplate'
        defaultMessage='During the time period {startDate} to {endDate}, {measurementCount} Measurements have been conducted in {countryName}, resulting in {confirmCount} Confirmed Blocked, {anomalyCount} Anomalies and {accessibleCount} Accessible results. These measurements cover {networkCovered} networks out of {totalNetworks} in total in {countryName}. The network with the most measurements is {mostBlockedASNname} ({mmostBlockedASN}).'
      />
    </React.Fragment>
  )
}
export default Overview
