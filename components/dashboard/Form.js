import { countryList } from 'country-util'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, Flex, Select } from 'ooni-components'
import moment from 'moment'
import { MultiSelect } from 'react-multi-select-component'

import { StyledLabel } from '../aggregation/mat/Form'
import DatePicker from '../DatePicker'
import { FormattedMessage } from 'react-intl'
import { useCallback, useMemo, useState } from 'react'

const tomorrow = moment.utc().add(1, 'day').format('YYYY-MM-DD')
const lastMonthToday = moment.utc().subtract(30, 'day').format('YYYY-MM-DD')

const defaultDefaultValues = {
  since: lastMonthToday,
  until: tomorrow,
  countries: [],
}

export const Form = ({ onSubmit, query }) => {
  const defaultValues = Object.assign({}, defaultDefaultValues, query)

  const { handleSubmit, control, getValues, watch } = useForm({
    defaultValues
  })

  const countryOptions = useMemo(() => {
    const options = countryList
      .sort((a,b) => (a.iso3166_name < b.iso3166_name) ? -1 : (a.iso3166_name > b.iso3166_name) ? 1 : 0)
      .map(country => ({
        label: country.iso3166_name,
        value: country.iso3166_alpha2
      }))
    return options
  }, [])

  const beforeSubmit = useCallback((data) => {
    const cleanedUpData = {
      ...data,
      countries: data.countries.map(d => d.value)
    }
    onSubmit(cleanedUpData)
  }, [onSubmit])

  return (
    <form onSubmit={handleSubmit(beforeSubmit)}>
      <Flex alignItems={['center']}>
        <Box width={1/4} mr={3}>
          <StyledLabel>Country</StyledLabel>
          <Controller
            render={({field}) => (
              <MultiSelect
                options={countryOptions}
                labelledBy={<FormattedMessage id='ReachabilityDash.Form.Label.Country' />}
                {...field}
              />
            )}
            name='countries'
            control={control}
          />
        </Box>

        <Box mr={3}>
          <StyledLabel>Since</StyledLabel>
          <Controller
            name='since'
            control={control}
            render={({field: {onChange}}) => (
              <DatePicker
                defaultValue={defaultValues.since}
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
            render={({field: {onChange}}) => (
              <DatePicker
                defaultValue={defaultValues.until}
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
        <Button type='submit'>Submit</Button>
      </Flex>
    </form>
  )
}

