import { ResponsiveCalendar } from '@nivo/calendar'
import CTABox from 'components/CallToActionBox'
import SpinLoader from 'components/vendor/SpinLoader'
import { Box, Flex, theme } from 'ooni-components'
import React, { useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import dayjs from 'services/dayjs'
import { fetcherWithPreprocessing } from 'services/fetchers'
import { styled } from 'styled-components'
import useSWR from 'swr'
import { getRange } from 'utils'
import FormattedMarkdown from '../FormattedMarkdown'
import { useCountry } from './CountryContext'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const prepareDataForCalendar = (data) => {
  return data.map((r) => ({
    value: r.measurement_count,
    day: r.measurement_start_day,
  }))
}

const CallToActionBox = () => {
  const { countryName } = useCountry()
  return (
    <CTABox
      title={<FormattedMessage id='Country.Overview.NoData.Title' />}
      text={<FormattedMarkdown
        id='Country.Overview.NoData.CallToAction'
        values={{
          country: countryName
        }}
      />
    } />
  )
}

const StyledCalendar = styled.div`
height: 180px;
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

const Calendar = React.memo(function Calendar({ startYear }) {
  const { countryCode } = useCountry()
  const today = new Date()
  const currentYear = today.getFullYear()
  const firstMeasurementYear = startYear ? new Date(startYear).getFullYear() : new Date(data[0].day).getFullYear()

  const [ selectedYear, setSelectedYear ] = useState(currentYear)
  const since = `${selectedYear}-01-01`
  const until = selectedYear === currentYear ? 
    dayjs.utc().add(1, 'day').format('YYYY-MM-DD') :
    `${selectedYear + 1}-01-01`

  const yearsOptions = getRange(firstMeasurementYear, currentYear)

  const { data, error, isLoading } = useSWR(
    [
      '/api/v1/aggregation',
      { params: {
        probe_cc: countryCode,
        since,
        until,
        axis_x: 'measurement_start_day',
        },
        resultKey: 'result',
        preprocessFn: prepareDataForCalendar,
      },
    ],
    fetcherWithPreprocessing,
    swrOptions
  )

  const calendarData = useMemo(() => {
      if (data && data.length) {
        return backfillData(data)
      } else {
        return []
      }
    }, 
    [data]
  )

  return (
    <Box mb={60} mt={2}>
      {isLoading && <Flex height='180px' bg='gray1' alignItems='center' justifyContent='center'><SpinLoader size={3} /></Flex>}
      {!!calendarData.length &&
        <StyledCalendar>
          <ResponsiveCalendar
            data={calendarData}
            from={`${selectedYear}-01-01`}
            to={`${selectedYear}-12-31`}
            emptyColor={colors.gray1}
            colorScale={(value) => findColor(value)}
            margin={{ top: 20, right: 0, bottom: 0, left: 20 }}
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
          />
        </StyledCalendar> 
      }
      {!calendarData.length && !isLoading && <CallToActionBox />}
      {error &&
        <Flex height='180px' bg='gray1' p={3}>
          Error: {JSON.stringify(error)}
        </Flex>
      }
      <Flex justifyContent='space-between' alignItems='center' flexWrap={['wrap', 'wrap', 'nowrap']} sx={{gap: [1, 1, 0]}}>
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
        <Flex sx={{rowGap: 1, columnGap: 3}} flexWrap='wrap'>
          {yearsOptions.map(year => (
            <span
              key={year}
              style={{
                display: 'inline-block',
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
    </Box>
  )
})

export default Calendar