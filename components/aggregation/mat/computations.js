import { getCategoryCodesMap } from '../../utils/categoryCodes'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import dayjs from 'services/dayjs'

const categoryCodesMap = getCategoryCodesMap()

export function getDatesBetween(startDate, endDate, timeGrain) {
  const dateSet = new Set()
  var currentDate = startDate
  while (currentDate < endDate) {
    if (timeGrain === 'hour') {
      let startOfDay = dayjs(currentDate).utc().startOf('day')
      const nextDay = startOfDay.add(1, 'day')
      while (startOfDay.toDate() < nextDay.toDate()) {
        dateSet.add(startOfDay.toISOString().split('.')[0] + 'Z')
        startOfDay = startOfDay.utc().add(1, 'hours')
      }
      currentDate = dayjs(currentDate).utc().add(1, 'day')
    } else if (timeGrain === 'month') {
      const monthStart = dayjs(currentDate).utc().startOf('month')
      dateSet.add(monthStart.toISOString().slice(0, 10))
      currentDate = monthStart.add(1, 'month').toDate()
    } else if (timeGrain === 'week') {
      const weekStart = dayjs(currentDate).utc().startOf('week')
      dateSet.add(weekStart.toISOString().slice(0, 10))
      currentDate = weekStart.add(1, 'week').toDate()
    } else if (timeGrain === 'day') {
      dateSet.add(currentDate.toISOString().slice(0, 10))
      currentDate.setDate(currentDate.getDate() + 1)
    }
  }
  return dateSet
}

export function fillRowHoles (data, query, locale) {
  const newData = [...data]

  let domain = null

  switch(query.axis_x) {
    case 'measurement_start_day':
      domain = getDatesBetween(new Date(query.since), new Date(query.until), query.time_grain)
      break
    case 'category_code':
      domain = [...getCategoryCodesMap().keys()]
      break
    case 'probe_cc':
      domain = localisedCountries(locale).map(cc => cc.iso3166_alpha2)
      break
    default:
      throw new Error(`x-axis: ${query.axis_x}. Please select a valid value for X-Axis.`)
  }

  const colsInRow = newData.map(i => i[query.axis_x])
  const missingCols = [...domain].filter(x => !colsInRow.includes(x))

  const sampleDataPoint = {...newData[0]}

  // Add empty datapoints for columns where measurements are not available
  missingCols.forEach((col) => {
    // use any (first) column data to popuplate yAxis value e.g `input` | `probe_cc`
    // and then overwrite with zero-data for that missing date
    newData.splice([...domain].indexOf(col), 0, {
      ...sampleDataPoint,
      [query.axis_x]: col,
      anomaly_count: 0,
      confirmed_count: 0,
      failure_count: 0,
      measurement_count: 0,
      ok_count: 0,
    })
  })

  return newData
}

export function fillDataHoles (data, query) {
  // Object transformation, works like Array.map
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries#object_transformations
  const newData = new Map(
    Object.entries(data)
      .map(([ key, rowData ]) => [ key, fillRowHoles(rowData, query) ])
  )

  return newData
}

export const sortRows = (a, b, type, locale = 'en') => {
  switch(type) {
    case 'probe_cc':
      return new Intl.Collator(locale).compare(getLocalisedRegionName(a, locale), getLocalisedRegionName(b, locale))
    default:
      return new Intl.Collator(locale).compare(a, b)
  }
}
