import { scaleUtc } from 'd3-scale'

import { getDatesBetween } from './computations'


const defaultCount = 20

export function getXAxisTicks (since, until, count = defaultCount) {
  const dateDomain = [...getDatesBetween(new Date(since), new Date(until))].map(d => new Date(d))
  const xScale = scaleUtc().domain([dateDomain[0], dateDomain[dateDomain.length-1]])

  const xAxisTickValues = dateDomain.length < 30 ? null : [
    // dateDomain[0],
    ...xScale.ticks(count),
    // dateDomain[dateDomain.length-1]
  ].map(d => d.toISOString().split('T')[0])

  return xAxisTickValues
}

