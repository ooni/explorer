import React, { useState } from 'react'
import { ResponsiveCalendar } from '@nivo/calendar'
import styled from 'styled-components'
import { Flex, Box, theme } from 'ooni-components'
import { getRange } from 'utils'

const StyledCalendar = styled.div`
height: 180px;
margin-bottom: 10px;
margin-top: 40px;
`
const { colors } = theme
const chartColors = [colors.blue2, colors.blue4, colors.blue5, colors.blue7]

const findColor = number => {
  if (number === 0) return colors.gray1
  if (number <= 50) return chartColors[0]
  if (number <= 500) return chartColors[1]
  if (number <= 5000) return chartColors[2]
  return chartColors[3]
}

const colorLegend = [
  {color: chartColors[0], range: '1-50'},
  {color: chartColors[1], range: '51-100'},
  {color: chartColors[2], range: '501-5000'},
  {color: chartColors[3], range: '>5000'},
]

const dateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return
  const start = new Date(new Date(startDate.getFullYear(), 0, 0, 0).setUTCHours(0, 0, 0, 0))
  const end = new Date(new Date(endDate).setUTCHours(0, 0, 0, 0))  
  const date = new Date(start.getTime())
  const dates = []

  while (date <= end) {
    dates.push(new Date(date).toISOString().split('T')[0])
    date.setUTCDate(date.getDate() + 1)
  }
  return dates
}

const backfillData = data => {
  const range = dateRange(new Date(data[0].day), new Date())
  return range.map((r) => (data.find((d) => d.day === r) || { value: 0, day: r}))
}

const Calendar = React.memo(function Calendar({asn, data}) {
  const currentYear = new Date().getFullYear()
  const firstMeasurementYear = Number(data[0].day.split('-')[0])
  const yearsOptions = getRange(firstMeasurementYear, currentYear)

  const [ selectedYear, setSelectedYear ] = useState(currentYear)

  const calendarData = backfillData(data)

  return (
    <>
      <StyledCalendar>
        <ResponsiveCalendar
          data={calendarData}
          from={`${selectedYear}-01-01`}
          to={`${selectedYear}-12-31`}
          emptyColor={colors.gray1}
          colorScale={(value) => findColor(value)}
          margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
        />
      </StyledCalendar>
      <Flex justifyContent='space-between'alignItems='center' mb={60}>
        <Flex>
          {colorLegend.map(item => (
            <span
              key={item.color}
              style={{marginRight: '16px'}}
            >
              <span style={{
                width: '11px',
                height: '11px',
                backgroundColor: item.color,
                display: 'inline-block',
                marginRight: '3px',
              }}></span>
              {item.range}
            </span>
          ))}
        </Flex>
        <Flex>
          {yearsOptions.map(year => (
            <span
              key={year}
              style={{
                display: 'inline-block',
                padding: '0 8px',
                cursor: 'pointer',
                fontWeight: year === selectedYear ? '800' : '400'
              }}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </span>
          ))}
        </Flex>
      </Flex>
    </>
  )
})

export default Calendar