import { useEffect, useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, Flex, Input, Select } from 'ooni-components'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import { format } from 'date-fns'
import { MultiSelect } from 'react-multi-select-component'
import styled from 'styled-components'

import { getLocalisedRegionName } from 'utils/i18nCountries'
import DateRangePicker from '../DateRangePicker'
import { useRouter } from 'next/router'

const tomorrow = dayjs.utc().add(1, 'day').format('YYYY-MM-DD')
const lastMonthToday = dayjs.utc().subtract(30, 'day').format('YYYY-MM-DD')

const defaultDefaultValues = {
  since: lastMonthToday,
  until: tomorrow,
  probe_cc: ''
}

const countryOptions = []

const Form = ({ onSubmit, availableCountries = [] }) => {
  const router = useRouter()
  const { query } = router
  const intl = useIntl()
  const countriesList = useMemo(() => (
    availableCountries.map((c) => ({name: getLocalisedRegionName(c, intl.locale), value: c}))
  ), [availableCountries, intl.locale])

  const query2formValues = useMemo(() => {
    return {
      since: query?.since ?? defaultDefaultValues.since,
      until: query?.until ?? defaultDefaultValues.until,
      probe_cc: defaultDefaultValues.probe_cc
    }
  }, [query])

  const { control, getValues, watch, setValue, reset } = useForm({
    defaultValues: query2formValues
  })

  useEffect(() => {
    reset(query2formValues)
  }, [query])

  const [showDatePicker, setShowDatePicker] = useState(false)
  const handleRangeSelect = (range) => {
    const rangeFrom = range?.from ? format(range.from, 'y-MM-dd') : ''
    const rangeTo = range?.to ? format(range.to, 'y-MM-dd') : ''
    setValue('since', rangeFrom)
    setValue('until', rangeTo)
 
    setShowDatePicker(false)
  }

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value[name] !== query[name] &&
        (dayjs(value['since'], 'YYYY-MM-DD', true).isValid() &&
        dayjs(value['until'], 'YYYY-MM-DD', true).isValid())) {
          onSubmit({since: value['since'], until: value['until'], probe_cc: value['probe_cc']})
        }
    })

    return () => subscription.unsubscribe()
  }, [watch])


  useEffect(() => {
    if (Object.keys(query).length  < 3) {
      const today = dayjs.utc().add(1, 'day')
      const monthAgo = dayjs.utc(today).subtract(1, 'month')
      const href = {
        query: {
          ...query,
          since: monthAgo.format('YYYY-MM-DD'),
          until: today.format('YYYY-MM-DD'),
        },
      }
      router.replace(href, undefined, { shallow: true })
    }
  }, [])

  return (
    <form>
      <Flex alignItems={['center']}>
        <Box width={[1, 1/5]}>
          <Flex>
            <Box width={2/3} mr={3}>
              <Controller
                name='since'
                control={control}
                render={({field}) => (
                  <Input
                    {...field}
                    label={intl.formatMessage({id: 'Search.Sidebar.From'})}
                    onFocus={() => setShowDatePicker(true)}
                    onKeyDown={() => setShowDatePicker(false)}
                  />
                )}
              />
            </Box>
            <Box width={2/3} mr={3}>
              <Controller
                name='until'
                control={control}
                render={({field}) => (
                  <Input
                    {...field}
                    label={intl.formatMessage({id: 'Search.Sidebar.Until'})}
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
        <Box width={[1, 1/4]} mr={3} sx={{ zIndex: 2 }}>
          <Controller
          control={control}
          name='probe_cc'
          render={({field}) => (
            <Select
              {...field}
              pt={2}
              label={intl.formatMessage({id: 'Search.Sidebar.Country'})}
              data-test-id='country-filter'
            >
              <option key='empty' value=''>{intl.formatMessage({id: 'MAT.Form.AllCountries'})}</option>
              {countriesList.map(({value, name}, i) => {
                return (
                  <option key={value} value={value}>{name}</option>
                )
              })}
            </Select>
          )}
        />
        </Box>
      </Flex>
    </form>
  )
}

export default Form
