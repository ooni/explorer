import React, { useRef, useMemo } from 'react'
import styled from 'styled-components'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import {
  Flex,
  Box,
  Button,
} from 'ooni-components'
import dayjs from 'services/dayjs'
import { Controller, useFormContext } from 'react-hook-form'

const BaseDatetimeStyle = styled.div`
.DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
  background-color: #f0f8ff !important;
  color: #4a90e2;
}
.DayPicker-Day {
  border-radius: 0 !important;
}
.DayPicker-Day--start {
  border-top-left-radius: 50% !important;
  border-bottom-left-radius: 50% !important;
}
.DayPicker-Day--end {
  border-top-right-radius: 50% !important;
  border-bottom-right-radius: 50% !important;
}
`

const StyledDatetime = styled(BaseDatetimeStyle)`
input {
  padding: 8px;
  display: block;
  border: none;
  border-bottom: 1px solid #ccc;
  width: 100%;
}

.dateRangeSelector {
  position: relative;
}

.DayPickerInput-OverlayWrapper {
  position: static;
}

.DayPickerInput-Overlay {
  width: 100%;
}

.DayPicker {
  display: block;
  margin: 0 auto;
}

.rangeButtonsWrapper {
  margin: 6px 10px 0;
}

.rangeButton {
  padding: 4px 10px;
  margin: 4px;
  font-size: 14px;
}

.divider {
  margin: 7px 10px 0;
}
`

const CustomOverlay = ({ classNames, selectedDay, children, onChange, ranges, ...props }) => {
  const rangesList = ranges.map((range) => <Button className='rangeButton' hollow={true} key={range} onClick={() => onChange(range)}>{range}</Button>)

  return (
    <div
      className={classNames.overlayWrapper}
      {...props}
    >
      <div className={classNames.overlay}>
        <div className='rangeButtonsWrapper'>{rangesList}</div>
        {children}
      </div>
    </div>
  )
}

const DateRangePicker = (props) => {
  const { control, watch, setValue, ...rest } = useFormContext()
  const toRef = useRef(null)
  const fromRef = useRef(null)

  const [sinceFilter, untilFilter] = watch(['sinceFilter', 'untilFilter'])

  const from = useMemo(() => dayjs(sinceFilter).utc().toDate(), [sinceFilter])
  const to = useMemo(() => dayjs(untilFilter).utc().toDate(), [untilFilter])

  const modifiers = { start: from, end: to }

  const ranges = ['today', 'lastWeek', 'lastMonth', 'lastYear']

  const setValues = (from, to) => {
    setValue('sinceFilter', from)
    setValue('untilFilter', to)
  }

  const dateFormat = 'YYYY-MM-DD'

  const selectRange = (range) => {
    switch (range) {
      case 'today':
        setValues(dayjs().utc().format(dateFormat), dayjs().utc().format(dateFormat))
        break
      case 'lastWeek':
        setValues(dayjs().utc().subtract(1, 'week').format(dateFormat), dayjs().utc().format(dateFormat))
        break
      case 'lastMonth':
        setValues(dayjs().utc().subtract(1, 'month').format(dateFormat), dayjs().utc().format(dateFormat))
        break
      case 'lastYear':
        setValues(dayjs().utc().subtract(1, 'year').format(dateFormat), dayjs().utc().format(dateFormat))
        break
    }
    toRef.current.hideDayPicker()
    fromRef.current.hideDayPicker()
  }

  const formatDate = (date) => dayjs(date).format(dateFormat)
  const parseDate = (date) => dayjs(date).utc().toDate()

  return (
    <StyledDatetime>
      <Flex className='dateRangeSelector' flexDirection={['column', 'row']}>
        <Box width={1/2} pr={1}>
          <Controller
            control={control}
            name='sinceFilter'
            render={({field}) => (
              <DayPickerInput 
                {...field}
                ref={fromRef}
                onDayChange={(date) => field.onChange(dayjs(date).format(dateFormat))}
                format={dateFormat}
                formatDate={formatDate}
                parseDate={parseDate}
                keepFocus={false}
                dayPickerProps={{
                  selectedDays: [from, { from, to }],
                  disabledDays: { after: dayjs().utc().add(1, 'day').toDate() },
                  toMonth: dayjs().utc().add(1, 'day').toDate(),
                  modifiers,
                  onDayClick: () => toRef.current.input.focus(),
                }}
                overlayComponent={props => (
                  <CustomOverlay
                    {...props}
                    onChange={selectRange}
                    ranges={ranges}
                  />
                )}
                {...rest} />
            )}
          />
        </Box>
        <span className='divider'>—</span>
        <Box width={1/2} pl={1}>
          <Controller
            control={control}
            name='untilFilter'
            render={({field}) => (
              <DayPickerInput
                {...field}
                ref={toRef}
                onDayChange={(date) => field.onChange(dayjs(date).format(dateFormat))}
                keepFocus={false}
                dayPickerProps={{
                  selectedDays: [from, { from, to }],
                  disabledDays: { before: from, after: dayjs().utc().add(1, 'day').toDate()  },
                  modifiers,
                  month: from,
                  fromMonth: from,
                }}
                format={dateFormat}
                formatDate={formatDate}
                parseDate={parseDate}
                overlayComponent={props => (
                  <CustomOverlay
                    {...props}
                    onChange={selectRange}
                    ranges={ranges}
                  />
                )}
                {...rest} />
            )}
          />
        </Box>
      </Flex>
    </StyledDatetime>
  )
}

export default DateRangePicker
