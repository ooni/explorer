import React, { useState } from 'react'
import { ResponsiveCalendar } from '@nivo/calendar'
import styled from 'styled-components'
import { Flex, theme } from 'ooni-components'
import { getRange } from 'utils'

const StyledCalendar = styled.div`
height: 180px;
margin-bottom: 10px;
margin-top: 40px;
`
const colors = theme.colors
const findColor = number => {
  if (number <= 10) return colors.orange3
  if (number <= 100) return colors.green2
  if (number <= 1000) return colors.green5
  return colors.green8
}

const Calendar = React.memo(function Calendar({asn, data}) {
  const currentYear = new Date().getFullYear()
  const firstMeasurementYear = Number(data[0].day.split('-')[0])
  const yearsOptions = getRange(firstMeasurementYear, currentYear)

  const [ selectedYear, setSelectedYear ] = useState(currentYear)
  
  return (
    <>
      <StyledCalendar>
        <ResponsiveCalendar
          data={data}
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
      <Flex justifyContent='right' mb={60}>
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
      </Flex>
    </>
  )
})

export default Calendar