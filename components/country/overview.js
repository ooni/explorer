import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Flex, Box, Text, Heading } from 'ooni-components'
import {
  VictoryChart,
  VictoryBar,
  VictoryStack,
  VictoryAxis,
  VictoryTheme,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory'

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

const Circle = styled.span`
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
`
const StyledTestGroupSelector = styled(Flex)`
  cursor: pointer;
  &${Box}:hover {
    text-shadow: 1px 1px 1px black;
  }
`
const TestGroupSelector = ({ testGroup, active, onClick }) => (
  <StyledTestGroupSelector m={2} onClick={() => onClick(testGroup)}>
    <Circle color={active ? testGroups[testGroup].color : '#ced4da'} />
    <Box mx={1} color={!active && '#ced4da' }> {testGroups[testGroup].name} </Box>
  </StyledTestGroupSelector>
)

class TestsByGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      websites: true,
      im: true,
      performance: true,
      middlebox: true,
      circumvention: true
    }

    this.onTestGroupClick = this.onTestGroupClick.bind(this)
  }

  componentDidUpdate() {
    const activeTestGroups = Object.keys(this.state).filter((testGroup) => (
      this.state[testGroup] === true
    )).join(',')
    this.props.fetchTestCoverageData(activeTestGroups)
  }

  onTestGroupClick(testGroup) {
    // Toggle testGroup in the selection
    this.setState((state) => ({
      [testGroup]: !state[testGroup]
    }))
  }

  render() {
    return (
      <React.Fragment>
        <Flex>
          {
            Object.keys(testGroups).map((testGroup, index) => (
              <TestGroupSelector
                key={index}
                testGroup={testGroup}
                onClick={this.onTestGroupClick}
                active={this.state[testGroup]}
              />
            ))
          }
        </Flex>
      </React.Fragment>
    )
  }
}

const Overview = ({
  testCoverage,
  networkCoverage,
  fetchTestCoverageData,
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
      <TestsByGroup fetchTestCoverageData={fetchTestCoverageData} />
      {/* Bar chart */}
      <Box>
        <VictoryChart
          domainPadding={20}
          theme={VictoryTheme.material}
          scale={{ x: 'time' }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={(d) => `Test: ${d.test_group} \n Count: ${d.count} \n Date: ${new Date(d.date).toLocaleDateString()}`}
            />
          }
          width={800}
        >
          <VictoryAxis
            dependentAxis
          />
          <VictoryStack
            colorScale={['#4C6EF5', '#15AABF', '#BE4BDB', '#6741D9', '#CED4DA']}
          >
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
          height={120}
          containerComponent={
            <VictoryVoronoiContainer
              labels={(d) => `Count: ${d.count} \n Date: ${new Date(d.date).toLocaleDateString()}`}
            />
          }
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
