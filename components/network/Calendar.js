import React, { useState } from 'react'
import { ResponsiveCalendar } from '@nivo/calendar'
import { theme } from 'ooni-components'

const colors = theme.colors

const years = [2018, 2019, 2020, 2021, 2022]

const customColors = [colors.orange3, colors.green2, colors.green5, colors.green8]

const Calendar = React.memo(function Calendar({asn, data}) {
  const [ currentYear, setYear ] = useState(years[years.length - 1])

  return (
    <>
      <div style={{height: '180px'}}>
        <ResponsiveCalendar
          data={data}
          from={`${currentYear}-01-01`}
          to={`${currentYear}-12-31`}
          emptyColor="#eeeeee"
          colors={customColors}
          margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
        />
      </div>
      {years.map(year => (
        <span
          key={year}
          style={{
            display: 'inline-block',
            padding: '3px 9px',
            cursor: 'pointer',
            fontWeight: year === currentYear ? '800' : '400'
          }}
          onClick={() => setYear(year)}
        >
          {year}
        </span>
      ))}
    </>
  )
})

export default Calendar