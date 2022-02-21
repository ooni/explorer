export function getDatesBetween(startDate, endDate) {
  const dateSet = new Set()
  var currentDate = startDate
  while (currentDate < endDate) {
    dateSet.add(currentDate.toISOString().slice(0, 10))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dateSet
}

/* dateSet is an optional precomputed set from `getDatesBetween` */
export function fillDataInMissingDates (data, startDate, endDate, dateSet = null) {
  console.log(`in: ${data.length}`)
  const newData = [...data]
  
  const dateRange = dateSet || getDatesBetween(new Date(startDate), new Date(endDate))

  const datesInRow = newData.map(i => i.measurement_start_day)
  const missingDates = [...dateRange].filter(x => !datesInRow.includes(x))

  const sampleDataPoint = {...newData[0]}

  // Add empty datapoints for dates where measurements are not available
  missingDates.forEach((date) => {
    // use any (first) column data to popuplate yAxis value e.g `input` | `probe_cc`
    // and then overwrite with zero-data for that missing date
    newData.splice([...dateRange].indexOf(date), 0, {
      ...sampleDataPoint,
      measurement_start_day: date,
      anomaly_count: 0,
      confirmed_count: 0,
      failure_count: 0,
      measurement_count: 0,
      ok_count: 0,
    })
  })

  console.log(`out: ${newData.length}`)

  return newData
}