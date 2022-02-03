import { useEffect, useMemo, useState } from 'react'
import { territoryNames } from 'country-util'
import { useForm, Controller } from 'react-hook-form'
import { Box, Flex } from 'ooni-components'
import moment from 'moment'
import { MultiSelect } from 'react-multi-select-component'
import { useIntl } from 'react-intl'

import { StyledLabel } from '../aggregation/mat/Form'
import DatePicker from '../DatePicker'

const tomorrow = moment.utc().add(1, 'day').format('YYYY-MM-DD')
const lastMonthToday = moment.utc().subtract(30, 'day').format('YYYY-MM-DD')

const defaultDefaultValues = {
  since: lastMonthToday,
  until: tomorrow,
  probe_cc: [],
}

export const Form = ({ onChange, query, availableCountries }) => {
  const intl = useIntl()

  const countryOptions = useMemo(() => availableCountries
    .sort((a,b) => (territoryNames[a] < territoryNames[b]) ? -1 : (territoryNames[a] > territoryNames[b]) ? 1 : 0)
    .map(cc => ({
      label: territoryNames[cc],
      value: cc
    }))
  , [availableCountries])

  const query2formValues = (query) => {
    const countriesInQuery = query.probe_cc?.split(',') ?? []
    return {
      since: query?.since ?? defaultDefaultValues.since,
      until: query?.until ?? defaultDefaultValues.until,
      probe_cc: countryOptions.filter(country => countriesInQuery.includes(country.value))
    }
  }

  const multiSelectStrings = useMemo(() => ({
    'allItemsAreSelected': intl.formatMessage({ id: 'ReachabilityDash.Form.Label.CountrySelect.AllSelected' }),
    // 'clearSearch': 'Clear Search',
    // 'clearSelected': 'Clear Selected',
    // 'noOptions': 'No options',
    'search': intl.formatMessage({ id: 'ReachabilityDash.Form.Label.CountrySelect.SearchPlaceholder' }),
    'selectAll': intl.formatMessage({ id: 'ReachabilityDash.Form.Label.CountrySelect.SelectAll' }),
    'selectAllFiltered': intl.formatMessage({ id: 'ReachabilityDash.Form.Label.CountrySelect.SelectAllFiltered' }),
    'selectSomeItems': intl.formatMessage({ id: 'ReachabilityDash.Form.Label.CountrySelect.InputPlaceholder' }),
    // 'create': 'Create',
  }), [intl])

  const { control, getValues, watch } = useForm({
    defaultValues: query2formValues(query)
  })

  const {since, until, probe_cc} = watch()
  
  useEffect(() => {
    const cleanedUpData = {
      since,
      until,
      probe_cc: probe_cc.map(d => d.value)
    }
    onChange(cleanedUpData)
  }, [onChange, since, until, probe_cc])

  return (
    <form>
      <Flex alignItems={['center']}>
        <Box width={1/4} mr={3}>
          <StyledLabel>Country</StyledLabel>
          {<Controller
            render={({field}) => (
              <MultiSelect
                options={countryOptions}
                overrideStrings={multiSelectStrings}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            )}
            name='probe_cc'
            control={control}
          />}
        </Box>

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

