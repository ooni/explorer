import React from 'react'
import styled from 'styled-components'
import { Flex, Box, theme } from 'ooni-components'
import {
  VictoryChart,
  VictoryBar,
  VictoryStack,
  VictoryAxis,
  VictoryTheme,
  VictoryLine,
  VictoryVoronoiContainer
} from 'victory'

import Tooltip from './tooltip'
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
    <Circle color={active ? testGroups[testGroup].color : theme.colors.gray4} />
    <Box mx={1} color={!active && theme.colors.gray4 }> {testGroups[testGroup].name} </Box>
  </StyledTestGroupSelector>
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
    let testCoverageMaxima, networkCoverageMaxima

    const { testCoverage, networkCoverage } = this.props
    const supportedTestGroups = ['websites', 'im', 'middlebox', 'performance', 'circumvention']
    const testCoverageByDay = testCoverage.reduce((prev, cur) => {
      prev[cur.test_day] = prev[cur.test_day] || {}
      prev[cur.test_day][cur.test_group] = cur.count
      if (typeof testCoverageMaxima === 'undefined'
          || testCoverageMaxima < cur.count) {
        testCoverageMaxima = cur.count
      }
      return prev
    }, {})
    const testCoverageArray = Object.keys(testCoverageByDay)
      .map(day => ({test_day: day, ...testCoverageByDay[day]}))

    networkCoverage.forEach((d) => {
      if (typeof networkCoverageMaxima === 'undefined'
          || networkCoverageMaxima < d.count) {
        networkCoverageMaxima = d.count
      }
    })
    const selectedTestGroups = Object.keys(this.state).filter(testGroup => this.state[testGroup])
    return (
      <React.Fragment>
        <Flex my={4} flexWrap='wrap' justifyContent='space-between'>
          {
            supportedTestGroups.map((testGroup, index) => (
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
        <Flex justifyContent='center'>
          <Box width={1}>
            <VictoryChart
              domainPadding={20}
              theme={VictoryTheme.material}
              containerComponent={
                <VictoryVoronoiContainer
                  responsive={true}
                  voronoiDimension='x'
                />
              }
              domain={{ y: [0, 1] }}
              width={600}
              height={200}
            >

              <VictoryAxis tickCount={4} />
              <VictoryAxis
                dependentAxis
                tickFormat={(t) => t * testCoverageMaxima}
              />
              <VictoryStack>
                {
                  selectedTestGroups.map((testGroup, index) => {
                    let maybeLabels = {}
                    if (index === 0) {
                      maybeLabels['labels'] = (d) => {
                        let s = new Date(d.test_day).toLocaleDateString()
                        selectedTestGroups.forEach((name) => {
                          s += `\n${d[name]} ${name}`
                        })
                        return s
                      }
                      maybeLabels['labelComponent'] = <Tooltip />
                    }
                    return (
                      <VictoryBar
                        {...maybeLabels}
                        key={index}
                        data={testCoverageArray}
                        style={{
                          data: {
                            stroke: '#ffffff',
                            strokeWidth: 1,
                            fill: testGroups[testGroup].color
                          }
                        }}
                        x='test_day'
                        y={(d) => d[testGroup] / testCoverageMaxima}
                      />
                    )
                  })
                }
              </VictoryStack>
              <VictoryAxis
                dependentAxis
                orientation="right"
                tickFormat={(t) => t * networkCoverageMaxima}
              />
              <VictoryLine
                data={networkCoverage}
                x='test_day'
                y={(d) => d.count / networkCoverageMaxima}
                scale={{x: 'time', y: 'linear'}}
                labels={(d) => `${new Date(d.test_day).toLocaleDateString()}\n${d.count} networks `}
                labelComponent={<Tooltip />}
                style={{
                  data: {
                    stroke: theme.colors.gray7,
                  }
                }}
              />
            </VictoryChart>
          </Box>
        </Flex>
      </React.Fragment>
    )
  }
}

export default TestsByGroup
