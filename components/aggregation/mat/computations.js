import { territoryNames } from 'country-util'
import { getCategoryCodesMap } from '../../utils/categoryCodes'
import { getLocalisedRegionName } from 'utils/i18nCountries'

const categoryCodesMap = getCategoryCodesMap()

export function getDatesBetween(startDate, endDate) {
  const dateSet = new Set()
  var currentDate = startDate
  while (currentDate < endDate) {
    dateSet.add(currentDate.toISOString().slice(0, 10))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dateSet
}

export function fillRowHoles (data, query, locale) {
  const newData = [...data]

  let domain = null

  switch(query.axis_x) {
    case 'measurement_start_day':
      domain = getDatesBetween(new Date(query.since), new Date(query.until))
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

export const sortRows = (a, b, type, locale) => {
  switch(type) {
    case 'probe_cc':
      if (locale) return getLocalisedRegionName(a, locale) < getLocalisedRegionName(b, locale) ? -1 : getLocalisedRegionName(a, locale) > getLocalisedRegionName(b, locale) ? 1 : 0
      return territoryNames[a] < territoryNames[b] ? -1 : territoryNames[a] > territoryNames[b] ? 1 : 0
    case 'category_code':
      const A = categoryCodesMap.get(a).name
      const B = categoryCodesMap.get(b).name
      return  A < B ? -1 : A > B ? 1 : 0
    default:
      return a < b ? -1 : a > b ? 1 : 0
  }
}
