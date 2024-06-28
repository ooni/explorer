import { theme } from 'ooni-components'
import { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryStack,
  VictoryVoronoiContainer,
} from 'victory'

import CTABox from 'components/CallToActionBox'
import FormattedMarkdown from '../FormattedMarkdown'
import VictoryTheme from '../VictoryTheme'
import { testGroups } from '../test-info'
import { useCountry } from './CountryContext'
import Tooltip from './Tooltip'

const CallToActionBox = () => {
  const { countryName } = useCountry()
  return (
    <CTABox
      title={<FormattedMessage id="Country.Overview.NoData.Title" />}
      text={
        <FormattedMarkdown
          id="Country.Overview.NoData.CallToAction"
          values={{
            country: countryName,
          }}
        />
      }
    />
  )
}

const TestGroupSelector = ({ testGroup, active, onClick }) => (
  // &${Box}:hover {
  //   text-shadow: 1px 1px 1px black;
  // }
  <div className="flex cursor-pointer m-2" onClick={() => onClick(testGroup)}>
    <span
      className="h-4 w-4 rounded-[50%]"
      style={{
        backgroundColor: active
          ? testGroups[testGroup].color
          : theme.colors.gray4,
      }}
    />
    <div className={`mx-1 ${!active && 'bg-gray-500'}`}>
      {' '}
      {testGroups[testGroup].name}{' '}
    </div>
  </div>
)

class TestsByGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      websites: true,
      im: true,
      performance: true,
      middlebox: true,
      circumvention: true,
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
    const activeTestGroups = Object.keys(this.state)
      .filter((testGroup) => this.state[testGroup] === true)
      .join(',')
    this.props.fetchTestCoverageData(activeTestGroups)
  }

  onTestGroupClick(testGroup) {
    // Toggle testGroup in the selection
    this.setState((state) => ({
      [testGroup]: !state[testGroup],
    }))
  }

  render() {
    const { testCoverage, networkCoverage, intl } = this.props

    // Use react-intl's imperative API to render localized test names in chart tooltips
    const testGroupNames = {
      websites: intl.formatMessage({ id: 'Tests.Groups.Websites.Name' }),
      im: intl.formatMessage({ id: 'Tests.Groups.Instant Messagging.Name' }),
      middlebox: intl.formatMessage({ id: 'Tests.Groups.Middlebox.Name' }),
      performance: intl.formatMessage({ id: 'Tests.Groups.Performance.Name' }),
      circumvention: intl.formatMessage({
        id: 'Tests.Groups.Circumvention.Name',
      }),
    }

    // Check if there is enough data to plot the charts
    const testCoverageCount = testCoverage.reduce(
      (count, item) => count + item.count,
      0,
    )
    const networkCoverageCount = networkCoverage.reduce(
      (count, item) => count + item.count,
      0,
    )
    const notEnoughData = testCoverageCount === 0 && networkCoverageCount === 0

    const supportedTestGroups = [
      'websites',
      'im',
      'middlebox',
      'performance',
      'circumvention',
    ]

    const renderEmptyChart = () => (
      <VictoryChart
        domainPadding={20}
        theme={VictoryTheme}
        containerComponent={<VictoryVoronoiContainer voronoiDimension="x" />}
        domain={{ y: [0, 1] }}
        width={600}
        height={200}
      >
        <VictoryAxis tickCount={4} tickFormat={() => {}} />
        <VictoryAxis dependentAxis tickCount={4} tickFormat={() => {}} />
        <VictoryAxis
          dependentAxis
          orientation="right"
          tickCount={4}
          tickFormat={() => {}}
        />
        <VictoryLabel
          x={300}
          y={75}
          text="No Data Available"
          textAnchor="middle"
          style={{
            fill: theme.colors.gray6,
          }}
        />
      </VictoryChart>
    )

    const renderCharts = () => {
      let testCoverageMaxima
      let networkCoverageMaxima
      const selectedTestGroups = Object.keys(this.state).filter(
        (testGroup) => this.state[testGroup],
      )

      const testCoverageByDay = testCoverage.reduce((prev, cur) => {
        prev[cur.test_day] = prev[cur.test_day] || {}
        if (selectedTestGroups.indexOf(cur.test_group) > -1) {
          prev[cur.test_day][cur.test_group] = cur.count
          const allTestCount = Object.values(prev[cur.test_day]).reduce(
            (p, c) => p + c,
            0,
          )
          if (
            typeof testCoverageMaxima === 'undefined' ||
            testCoverageMaxima < allTestCount
          ) {
            testCoverageMaxima = allTestCount
          }
        }
        return prev
      }, {})
      const testCoverageArray = Object.keys(testCoverageByDay).map((day) => ({
        test_day: day,
        ...testCoverageByDay[day],
      }))

      networkCoverage.forEach((d) => {
        if (
          typeof networkCoverageMaxima === 'undefined' ||
          networkCoverageMaxima < d.count
        ) {
          networkCoverageMaxima = d.count
        }
      })

      const networkCoverageTick = (t) => Math.round(t * networkCoverageMaxima)
      const ntIncrement = Math.round(networkCoverageMaxima / 4)
      const networkCoverageTickValues = [1, 2, 3, 4].map(
        (i) => (i * ntIncrement) / networkCoverageMaxima,
      )

      const testCoverageTick = (t) => Math.round(t * testCoverageMaxima)
      const tsIncrement = Math.round(testCoverageMaxima / 4)
      const testCoverageTickValues = [1, 2, 3, 4].map(
        (i) => (i * tsIncrement) / testCoverageMaxima,
      )

      return (
        <VictoryChart
          domainPadding={20}
          theme={VictoryTheme}
          containerComponent={<VictoryVoronoiContainer voronoiDimension="x" />}
          domain={{ y: [0, 1] }}
          width={600}
          height={200}
        >
          <VictoryAxis tickCount={4} />
          <VictoryAxis
            dependentAxis
            tickValues={testCoverageTickValues}
            tickFormat={testCoverageTick}
          />
          <VictoryStack>
            {selectedTestGroups.map((testGroup, index) => {
              const maybeLabels = {}
              if (index === 0) {
                maybeLabels.labels = (d) => {
                  let s = new Date(d.test_day).toLocaleDateString()
                  selectedTestGroups.forEach((name) => {
                    s += `\n${d[name]} ${testGroupNames[name]}`
                  })
                  return s
                }
                maybeLabels.labelComponent = (
                  <Tooltip dy={-1} orientation="right" />
                )
              }
              return (
                <VictoryBar
                  {...maybeLabels}
                  key={index}
                  name={testGroup}
                  data={testCoverageArray}
                  style={{
                    data: {
                      stroke: '#ffffff',
                      strokeWidth: 1,
                      fill: testGroups[testGroup].color,
                    },
                  }}
                  x="test_day"
                  y={(d) => d[testGroup] / testCoverageMaxima}
                />
              )
            })}
          </VictoryStack>
          <VictoryAxis
            dependentAxis
            orientation="right"
            tickValues={networkCoverageTickValues}
            tickFormat={networkCoverageTick}
          />
          <VictoryLine
            data={networkCoverage}
            x="test_day"
            y={(d) => d.count / networkCoverageMaxima}
            scale={{ x: 'time', y: 'linear' }}
            labels={(d) =>
              `${new Date(d.test_day).toLocaleDateString()}\n${d.count} Networks `
            }
            labelComponent={<Tooltip dy={-8} orientation="left" />}
            style={{
              data: {
                stroke: theme.colors.gray7,
              },
            }}
          />
        </VictoryChart>
      )
    }

    return (
      <>
        {notEnoughData && <CallToActionBox />}
        <div className="flex my-8 justify-between">
          {supportedTestGroups.map((testGroup, index) => (
            <TestGroupSelector
              key={index}
              testGroup={testGroup}
              onClick={this.onTestGroupClick}
              active={this.state[testGroup]}
            />
          ))}
        </div>
        {/* Bar chart */}
        <div className="flex justify-center">
          <div className="w-full">
            {notEnoughData ? renderEmptyChart() : renderCharts()}
          </div>
        </div>
      </>
    )
  }
}

export default injectIntl(TestsByGroup)
