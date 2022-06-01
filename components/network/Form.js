import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, Flex } from 'ooni-components'
import { useIntl } from 'react-intl'
import moment from 'moment'
import dayjs from 'services/dayjs'

import { StyledLabel } from '../aggregation/mat/Form'
import DatePicker from '../DatePicker'

const tomorrow = dayjs.utc().add(1, 'day').format('YYYY-MM-DD')
const lastMonthToday = dayjs.utc().subtract(30, 'day').format('YYYY-MM-DD')

const defaultDefaultValues = {
  since: lastMonthToday,
  until: tomorrow,
}

const Form = ({ onChange, query }) => {
  const intl = useIntl()

  const query2formValues = (query) => {
    return {
      since: query?.since ?? defaultDefaultValues.since,
      until: query?.until ?? defaultDefaultValues.until,
    }
  }

  const { control, getValues, watch } = useForm({
    defaultValues: query2formValues(query)
  })

  const {since, until} = watch()
  
  useEffect(() => {
    const cleanedUpData = {
      since,
      until,
    }
    onChange(cleanedUpData)
  }, [onChange, since, until])

  return (
    <form>
      <Flex alignItems={['center']}>
        <Box mr={3}>
          <StyledLabel>Since</StyledLabel>
          <Controller
            name='since'
            control={control}
            render={({field: {value, onChange}}) => (
              <DatePicker
                defaultValue={value}
                dateFormat='YYYY-MM-DD'
                utc={true}
                timeFormat={false}
                onChange={(date) =>
                  onChange(moment.isMoment(date)
                    ? date.format('YYYY-MM-DD')
                    : date
                  )
                }
                isValidDate={currentDate => {
                  const untilValue = getValues('until')
                  if (untilValue && untilValue.length !== 0) {
                    return currentDate.isBefore(untilValue, 'day')
                  } else {
                    return currentDate.isBefore(tomorrow)
                  }
                }}
              />
            )}
          />
        </Box>
        <Box mr={3}>
          <StyledLabel>Until</StyledLabel>
          <Controller
            name='until'
            control={control}
            render={({field: {value, onChange}}) => (
              <DatePicker
                defaultValue={value}
                dateFormat='YYYY-MM-DD'
                utc={true}
                timeFormat={false}
                onChange={(date) =>
                  onChange(moment.isMoment(date)
                    ? date.format('YYYY-MM-DD')
                    : date
                  )
                }
                isValidDate={currentDate => {
                  const sinceFilter = getValues('since')
                  if (sinceFilter && sinceFilter.length !== 0) {
                    return currentDate.isAfter(sinceFilter) && currentDate.isSameOrBefore(tomorrow)
                  } else {
                    return currentDate.isSameOrBefore(tomorrow)
                  }
                }}
              />
            )}
          />
        </Box>
      </Flex>
    </form>
  )
}

export default Form
