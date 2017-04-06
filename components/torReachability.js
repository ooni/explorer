import React from 'react'

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  makeWidthFlexible,
  VerticalBarSeries,
  Crosshair
} from 'react-vis'

import 'isomorphic-fetch'

const FlexibleXYPlot = makeWidthFlexible(XYPlot)

const getDataForCountry = (probeCC) => {
}

class CensoredCountryTimeline extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired
  }

  constructor(props, context) {
    super(props, context)
    let series = [{
      'title': 'success',
      'data': props.data[0]
    },{
      'title': 'failed',
      'data': props.data[1]
    },{
      'title': 'error',
      'data': props.data[2]
    }]
    this.state = {
      crosshairValues: [],
      series: series
    }
  }

  _nearestXHandler = (value, {index}) => {
    const {series} = this.state;
    this.setState({
      crosshairValues: series.map(s => s.data[index])
    })
  }

  _mouseLeaveHandler = () => {
    this.setState({crosshairValues: []});
  }

  _formatCrosshairTitle = (values) => {
    return {
      title: 'Day',
      value: new Date(values[0].x).toDateString()
    }
  }

  _formatCrosshairItems = (values) => {
    const {series} = this.state;
    return values.map((v, i) => {
      return {
        title: series[i].title,
        value: v.y
      }
    })
  }

  render() {
    const {series, crosshairValues} = this.state
    return (
    <div>
      <div className="chart">
        <FlexibleXYPlot
          stackBy="y"
          xType="time"
          onMouseLeave={this._mouseLeaveHandler}
          height={300}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <YAxis />
          <XAxis />
          <VerticalBarSeries
            color="#67a9cf"
            data={series[0].data}
            onNearestX={this._nearestXHandler}
            />
          <VerticalBarSeries
            color="#ef8a62"
            data={series[1].data}
            onNearestX={this._nearestXHandler}
            />
          <VerticalBarSeries
            color="#f7f7f7"
            data={series[2].data}
            onNearestX={this._nearestXHandler}
            />
          <Crosshair
            itemsFormat={this._formatCrosshairItems}
            titleFormat={this._formatCrosshairTitle}
            values={crosshairValues} />
        </FlexibleXYPlot>
      </div>
    </div>
    )
  }
}

export default class TorReachability extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired
  }

  render() {
    return (
      <CensoredCountryTimeline data={this.props.data}/>
    )
  }
}
