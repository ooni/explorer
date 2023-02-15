import { scaleUtc } from 'd3-scale'

import { getDatesBetween } from './computations'
import dayjs from 'services/dayjs'


const defaultCount = 20

const getIntervalTicks = (data, count = defaultCount) => {
  if (!(data && data.length)) return []

  const start = data[0]
  const end = data[data.length - 1]
  const intervalType = 'week'
  const intervalCount = Math.floor(dayjs(end).diff(start, intervalType))
  return data.reduce((accum, point, index) => {
      const divisor = Math.ceil(intervalCount / count)
      if (index % divisor === 0)
          accum.push(point)
      return accum
  }, [])
}


export function getXAxisTicks (query, count = defaultCount) {

  if (query.axis_x === 'measurement_start_day') {
    const dateDomain = [...getDatesBetween(new Date(query.since), new Date(query.until), query.time_grain)].map(d => new Date(d))
    const xScale = scaleUtc().domain([dateDomain[0], dateDomain[dateDomain.length-1]])
    const xAxisTickValues = dateDomain.length < 30 ? dateDomain : [
      ...xScale.ticks(count),
    ]
  
    if (query.time_grain === 'hour') {
      return Array.from(xAxisTickValues).map(d => d.toISOString().split('.')[0] + 'Z')
    } else if (query.time_grain === 'week') {
      return dateDomain.length < 30 ? 
        Array.from(dateDomain).map(d => d.toISOString().split('T')[0]) : 
        getIntervalTicks(dateDomain.map((d) => d.toISOString().split('T')[0]), count)
    }

    return Array.from(xAxisTickValues).map(d => d.toISOString().split('T')[0])
  }

  return count
}

