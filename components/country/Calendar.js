import { ResponsiveCalendar } from '@nivo/calendar'
import CTABox from 'components/CallToActionBox'
import SpinLoader from 'components/vendor/SpinLoader'
import { colors } from 'ooni-components'
import React, { useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import dayjs from 'services/dayjs'
import { fetcherWithPreprocessing } from 'services/fetchers'
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
      title={<FormattedMessage id="Country.Overview.NoData.Title" />}
      text={
        <FormattedMarkdown
          id="Country.Overview.NoData.CallToAction"
          values={{
            country: countryName,
          }}
        />
      }
    />
  )
}

const chartColors = [
  colors.blue['200'],
  colors.blue['400'],
  colors.blue['500'],
  colors.blue['700'],
]

const findColor = (number) => {
  if (number === 0) return colors.gray['100']
  if (number <= 50) return chartColors[0]
  if (number <= 500) return chartColors[1]
  if (number <= 5000) return chartColors[2]
  return chartColors[3]
}

const colorLegend = [
  { color: chartColors[0], range: '1-50' },
  { color: chartColors[1], range: '51-100' },
  { color: chartColors[2], range: '501-5000' },
  { color: chartColors[3], range: '>5000' },
]

const dateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return
  const start = new Date(
    new Date(startDate.getFullYear(), 0, 0, 0).setUTCHours(0, 0, 0, 0),
  )
  const end = new Date(new Date(endDate).setUTCHours(0, 0, 0, 0))
  const date = new Date(start.getTime())
  const dates = []

  while (date <= end) {
    dates.push(new Date(date).toISOString().split('T')[0])
    date.setUTCDate(date.getDate() + 1)
  }
  return dates
}

const backfillData = (data) => {
  const range = dateRange(new Date(data[0].day), new Date())
  return range.map((r) => data.find((d) => d.day === r) || { value: 0, day: r })
}

const Calendar = React.memo(function Calendar({ startYear }) {
  const { countryCode } = useCountry()
  const today = new Date()
  const currentYear = today.getFullYear()
  const firstMeasurementYear = startYear
    ? new Date(startYear).getFullYear()
    : new Date(data[0].day).getFullYear()

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const since = `${selectedYear}-01-01`
  const until =
    selectedYear === currentYear
      ? dayjs.utc().add(1, 'day').format('YYYY-MM-DD')
      : `${selectedYear + 1}-01-01`

  const yearsOptions = getRange(firstMeasurementYear, currentYear)

  const { data, error, isLoading } = useSWR(
    [
      '/api/v1/aggregation',
      {
        params: {
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
    swrOptions,
  )

  const calendarData = useMemo(() => {
    if (data && data.length) {
      return backfillData(data)
    } else {
      return []
    }
  }, [data])

  return (
    <div className="mb-16 mt-2">
      {isLoading && (
        <div className="flex h-[180px] bg-gray-100 items-center justify-center">
          <SpinLoader size={3} />
        </div>
      )}
      {!!calendarData.length && (
        <div className="h-[180px]">
          <ResponsiveCalendar
            data={calendarData}
            from={`${selectedYear}-01-01`}
            to={`${selectedYear}-12-31`}
            emptyColor={colors.gray['100']}
            colorScale={(value) => findColor(value)}
            margin={{ top: 20, right: 0, bottom: 0, left: 20 }}
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
          />
        </div>
      )}
      {!calendarData.length && !isLoading && <CallToActionBox />}
      {error && (
        <div className="h-[180px] bg-gray-100 p-4">
          Error: {JSON.stringify(error)}
        </div>
      )}
      <div className="flex justify-between items-center flex-wrap lg:flex-nowrap gap-2 lg:gap-0">
        <div className="flex">
          {colorLegend.map((item) => (
            <span className="mr-4" key={item.color}>
              <span
                className="w-[11px] h-[11px] inline-block mr-[3px]"
                style={{ backgroundColor: item.color }}
              />
              {item.range}
            </span>
          ))}
        </div>
        <div className="flex gap-x-2 gap-y-4 flex-wrap">
          {yearsOptions.map((year) => (
            <span
              key={year}
              className={`inline-block cursor-pointer ${year === selectedYear ? 'font-extrabold' : 'font-normal'}`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
})

export default Calendar
