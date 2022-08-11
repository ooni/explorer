import { scaleUtc } from 'd3-scale'

import { getDatesBetween } from './computations'


const defaultCount = 20

export function getXAxisTicks (data, count = defaultCount) {

  if (data.length > 0) {
    const since = data[0]['measurement_start_day']
    const until = data[data.length - 1]['measurement_start_day']
    const dateDomain = [...getDatesBetween(new Date(since), new Date(until))].map(d => new Date(d))
    const xScale = scaleUtc().domain([dateDomain[0], dateDomain[dateDomain.length-1]])

    const xAxisTickValues = dateDomain.length < 30 ? dateDomain : [
      ...xScale.ticks(count),
    ]

    return Array.from(xAxisTickValues).map(d => d.toISOString().split('T')[0])
  }

  return count
}

