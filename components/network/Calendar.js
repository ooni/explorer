import React, { useState } from 'react'
import { ResponsiveCalendar } from '@nivo/calendar'
import { theme } from 'ooni-components'
import { getRange } from 'utils'

const colors = theme.colors
const customColors = [colors.orange3, colors.green2, colors.green5, colors.green8]

const Calendar = React.memo(function Calendar({asn, data}) {
  const currentYear = new Date().getFullYear()
  const firstMeasurementYear = Number(data[0].day.split('-')[0])
  const yearsOptions = getRange(firstMeasurementYear, currentYear)

  const [ selectedYear, setSelectedYear ] = useState(currentYear)
  
  return (
    <>
      <div style={{height: '180px'}}>
        <ResponsiveCalendar
          data={data}
          from={`${selectedYear}-01-01`}
          to={`${selectedYear}-12-31`}
          emptyColor="#eeeeee"
          colors={customColors}
          margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
        />
      </div>
      {yearsOptions.map(year => (
        <span
          key={year}
          style={{
            display: 'inline-block',
            padding: '3px 9px',
            cursor: 'pointer',
            fontWeight: year === selectedYear ? '800' : '400'
          }}
          onClick={() => setSelectedYear(year)}
        >
          {year}
        </span>
      ))}
    </>
  )
})

export default Calendar