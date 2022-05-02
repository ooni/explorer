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
const colors = theme.colors
const customColors = [colors.orange3, colors.green2, colors.green5, colors.green8]

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
          emptyColor="#eeeeee"
          colors={customColors}
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