import { useEffect, useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, Flex, Input } from 'ooni-components'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import { format } from 'date-fns'

import { StyledLabel } from '../aggregation/mat/Form'
import DateRangePicker from '../DateRangePicker'

const tomorrow = dayjs.utc().add(1, 'day').format('YYYY-MM-DD')
const lastMonthToday = dayjs.utc().subtract(30, 'day').format('YYYY-MM-DD')

const defaultDefaultValues = {
  since: lastMonthToday,
  until: tomorrow,
}

const Form = ({ onChange, query }) => {
  const intl = useIntl()
  const isMounted = useRef(false)

  const query2formValues = (query) => {
    return {
      since: query?.since ?? defaultDefaultValues.since,
      until: query?.until ?? defaultDefaultValues.until,
    }
  }

  const { control, getValues, watch, setValue } = useForm({
    defaultValues: query2formValues(query)
  })

  const {since, until} = watch()

  const [showDatePicker, setShowDatePicker] = useState(false)
  const handleRangeSelect = (range) => {
    if (range?.from) {
      setValue('since', format(range.from, 'y-MM-dd'))
    } else {
      setValue('since', '')
    }
    if (range?.to) {
      setValue('until', format(range.to, 'y-MM-dd'))
    } else {
      setValue('until', '')
    }
    setShowDatePicker(false)
  }
  
  useEffect(() => {
    if (isMounted.current) {
      const cleanedUpData = {
        since,
        until,
      }
      onChange(cleanedUpData)
    } else {
      isMounted.current = true
    }
  }, [onChange, since, until])

  return (
    <form>
      <Flex alignItems={['center']}>
        <Box width={[1, 1/5]}>
          <Flex>
            <Box width={1/2} mr={3}>
              <StyledLabel>{intl.formatMessage({id: 'Search.Sidebar.From'})}</StyledLabel>
              <Controller
                name='since'
                control={control}
                render={({field}) => (
                  <Input
                    {...field}
                    onFocus={() => setShowDatePicker(true)}
                    onKeyDown={() => setShowDatePicker(false)}
                  />
                )}
              />
            </Box>
            <Box width={1/2} mr={3}>
              <StyledLabel>{intl.formatMessage({id: 'Search.Sidebar.Until'})}</StyledLabel>
              <Controller
                name='until'
                control={control}
                render={({field}) => (
                  <Input
                    {...field}
                    onFocus={() => setShowDatePicker(true)}
                    onKeyDown={() => setShowDatePicker(false)}
                  />
                )}
              />
            </Box>
          </Flex>
          { showDatePicker &&
            <DateRangePicker
              handleRangeSelect={handleRangeSelect}
              initialRange={{from: getValues('since'), to: getValues('until')}}
              close={() => setShowDatePicker(false)}
            />
          }
        </Box>
      </Flex>
    </form>
  )
}

export default Form
