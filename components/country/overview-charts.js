import React from 'react'
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

import { testGroups } from '../test-info'

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

const BarChart = ({ data }) => (
  <VictoryBar
    data={data}
    style={{
      data: {
        stroke: '#ffffff',
        strokeWidth: 1
      }
    }}
    x='date'
    y='count'
  />
)

class TestsByGroup extends React.PureComponent {
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

  shouldComponentUpdate(nextProps, nextState) {
    const testGroups = Object.keys(this.state)
    for (let i = 0; i < testGroups.length; i++) {
      if (this.state[testGroups[i]] !== nextState[testGroups[i]]) {
        return true
      }
    }
    return false
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
    const { testCoverage, networkCoverage } = this.props
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
        {/* Bar chart */}
        <Box>
          <VictoryChart
            domainPadding={20}
            theme={VictoryTheme.material}
            scale={{ x: 'time' }}
            containerComponent={
              <VictoryVoronoiContainer
                labels={(d) => `${d.test_group}: ${d.count} \n Date: ${new Date(d.date).toLocaleDateString()}`}
              />
            }
            width={800}
          >
            <VictoryAxis
              dependentAxis
            />
            <VictoryStack>
              {
                Object.keys(this.state).filter(testGroup => this.state[testGroup]).map((testGroup, index) => (
                  <VictoryBar
                    key={index}
                    data={testCoverageGrouped[testGroup]}
                    style={{
                      data: {
                        stroke: '#ffffff',
                        strokeWidth: 1,
                        fill: testGroups[testGroup].color
                      }
                    }}
                    x='date'
                    y='count'
                  />
                ))
              }
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
      </React.Fragment>
    )
  }
}

export default TestsByGroup
