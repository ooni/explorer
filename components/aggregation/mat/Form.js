import React, { useCallback, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import styled from 'styled-components'
import {
  Flex, Box,
  Label, Input, Button
} from 'ooni-components'
import dayjs from 'services/dayjs'
import { format } from 'date-fns'
import { defineMessages, useIntl, FormattedMessage } from 'react-intl'
import { localisedCountries } from 'utils/i18nCountries'

import Select from 'components/form/Select'
import { categoryCodes } from '../../utils/categoryCodes'
import DateRangePicker from '../../DateRangePicker'
import { ConfirmationModal } from './ConfirmationModal'
import { TestNameOptions } from '../../TestNameOptions'

const DAY_GRAIN_THRESHOLD_IN_MONTHS = 12
const WEEK_GRAIN_THRESHOLD_IN_MONTHS = 36

export const StyledLabel = styled(Label).attrs({
  my: 2,
  color: 'blue5',
})`
`

const messages = defineMessages({
  'measurement_start_day': {
    id: 'MAT.Form.Label.AxisOption.measurement_start_day',
    defaultMessage: ''
  },
  'domain': {
    id: 'MAT.Form.Label.AxisOption.domain',
    defaultMessage: ''
  },
  'input': {
    id: 'MAT.Form.Label.AxisOption.input',
    defaultMessage: ''
  },
  'category_code': {
    id: 'MAT.Form.Label.AxisOption.category_code',
    defaultMessage: ''
  },
  'probe_cc': {
    id: 'MAT.Form.Label.AxisOption.probe_cc',
    defaultMessage: 'D'
  },
  'probe_asn': {
    id: 'MAT.Form.Label.AxisOption.probe_asn',
    defaultMessage: ''
  },
  'hour': {
    id: 'MAT.Form.TimeGrainOption.hour',
    defaultMessage: ''
  },
  'day': {
    id: 'MAT.Form.TimeGrainOption.day',
    defaultMessage: ''
  },
  'week': {
    id: 'MAT.Form.TimeGrainOption.week',
    defaultMessage: ''
  },
  'month': {
    id: 'MAT.Form.TimeGrainOption.month',
    defaultMessage: ''
  }
})


const xAxisOptions = [
  ['measurement_start_day', [], false],
  ['category_code', ['web_connectivity'], false],
  ['probe_cc', [], true],
]

const yAxisOptions = [
  ['domain', ['web_connectivity'], false],
  ['category_code', ['web_connectivity'], false],
  ['probe_cc', [], true],
  ['probe_asn', [], false],
  ['', [], false]
]

const testsWithValidDomainFilter = [
  'web_connectivity',
  'http_requests',
  'dns_consistency',
  'tcp_connect'
]

const filterAxisOptions = (options, countryValue, testNameValue) => {
  return options
    .filter(([option, validTestNames, hideForSingleCountry]) => {
      if (hideForSingleCountry && countryValue !== '') return false
      return validTestNames.length === 0 || validTestNames.includes(testNameValue)
    })
    .map(([option]) => option)
}

function isValidFilterForTestname(testName = 'XX', arrayWithMapping) {
  // whether the dependent filter is valid to show along with `testName`
  return arrayWithMapping.includes(testName)
}


const tomorrow = dayjs.utc().add(1, 'day').format('YYYY-MM-DD')
const lastMonthToday = dayjs.utc().subtract(30, 'day').format('YYYY-MM-DD')

const defaultDefaultValues = {
  probe_cc: '',
  probe_asn: '',
  test_name: 'web_connectivity',
  domain: '',
  input: '',
  category_code: '',
  since: lastMonthToday,
  until: tomorrow,
  axis_x: 'measurement_start_day',
  axis_y: '',
  time_grain: 'day'
}

export const Form = ({ onSubmit, testNames, query }) => {
  const intl = useIntl()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const defaultValues = Object.assign({}, defaultDefaultValues, query)
  const { handleSubmit, control, getValues, watch, reset, setValue } = useForm({
    defaultValues,
    shouldUnregister: true,
  })

  const sortedCountries = localisedCountries(intl.locale)
    .sort((a,b) => new Intl.Collator(intl.locale).compare(a.localisedCountryName, b.localisedCountryName))

  const testNameValue = watch('test_name')
  const countryValue = watch('probe_cc')
  const showWebConnectivityFilters = useMemo(() => (isValidFilterForTestname(testNameValue, testsWithValidDomainFilter)), [testNameValue])
  // reset domain and input when web_connectivity is deselected
  useEffect(() => {
    if (!showWebConnectivityFilters) {
      setValue('domain', '')
      setValue('input', '')
    }
  }, [setValue, showWebConnectivityFilters])

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

  const onConfirm = useCallback((e) => {
    setShowConfirmation(false)
    handleSubmit(onSubmit)(e)
  }, [handleSubmit, onSubmit])

  const onCancel = useCallback((e) => {
    setShowConfirmation(false)
    e.preventDefault()
  }, [])

  const maybeWarnBeforeSubmit = useCallback((e) => {
    e.preventDefault()

    const [since, until, timeGrain] = getValues(['since', 'until', 'time_grain'])
    const shouldShowConfirmationModal = () => {
      if (timeGrain === 'month') return false
      const diff = (dayjs(until).diff(dayjs(since), 'month'))
      if (timeGrain === 'week') return diff > WEEK_GRAIN_THRESHOLD_IN_MONTHS
      return diff > DAY_GRAIN_THRESHOLD_IN_MONTHS
    }

    if (shouldShowConfirmationModal()) {
      setShowConfirmation(true)
    } else {
      // Otherwise just continue with submission without interruption
      onConfirm(e)
    }
  }, [getValues, onConfirm])

  const xAxisOptionsFiltered = useMemo(() => {
    return filterAxisOptions(xAxisOptions, countryValue, testNameValue)
  }, [testNameValue, countryValue])

  useEffect(() => {
    if (!xAxisOptionsFiltered.includes(getValues('axis_x'))) setValue('axis_x', 'measurement_start_day')
  }, [setValue, getValues, xAxisOptionsFiltered])

  const yAxisOptionsFiltered = useMemo(() => {
    return filterAxisOptions(yAxisOptions, countryValue, testNameValue)
  }, [testNameValue, countryValue])

  useEffect(() => {
    if (!yAxisOptionsFiltered.includes(getValues('axis_y'))) setValue('axis_y', '')
  }, [setValue, getValues, yAxisOptionsFiltered])

  const since = watch('since')
  const until = watch('until')
  const timeGrainOptions = useMemo(() => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!until.match(dateRegex) || !since.match(dateRegex)) return ['hour', 'day', 'week', 'month']
    const diff = dayjs(until).diff(dayjs(since), 'day')
    if (diff < 8) {
      const availableValues = ['hour', 'day']
      if (!availableValues.includes(getValues('time_grain'))) setValue('time_grain', 'hour')
      return availableValues
    } else if (diff >= 8 && diff < 31) {
      const availableValues = ['day', 'week']
      if (!availableValues.includes(getValues('time_grain'))) setValue('time_grain', 'day')
      return availableValues
    } else if (diff >= 31 ) {
      const availableValues = ['day', 'week', 'month']
      if (!availableValues.includes(getValues('time_grain'))) setValue('time_grain', 'day')
      return availableValues
    }
  }, [setValue, getValues, since, until])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ConfirmationModal show={showConfirmation} onConfirm={onConfirm} onCancel={onCancel} />
      <Flex my={2} alignItems='center' flexDirection={['column', 'row']}>
        <Box width={[1, 3/12]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='Search.Sidebar.Country' />
          </StyledLabel>
          <Controller
            render={({field}) => (
              <Select {...field} width={1}>
                <option value=''>{intl.formatMessage({id: 'MAT.Form.AllCountries'})}</option>
                {sortedCountries.map((c, idx) =>(
                  <option key={idx} value={c.iso3166_alpha2}>{c.localisedCountryName}</option>
                ))}
              </Select>
            )}
            name='probe_cc'
            control={control}
          />
        </Box>
        <Box width={[1, 1/12]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='Search.Sidebar.ASN' />
          </StyledLabel>
          <Controller
            name='probe_asn'
            control={control}
            render={({field}) => (
              <Input
                placeholder='AS1234'
                {...field}
              />
            )}
          />
        </Box>
        <Box width={[1, 2/12]} mx={[0, 2]}>
          <Flex>
            <Box width={1} mx={[0, 2]}>
              <StyledLabel>
                <FormattedMessage id='Search.Sidebar.From' />
              </StyledLabel>
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
            <Box width={1} mx={[0, 2]}>
              <StyledLabel>
                <FormattedMessage id='Search.Sidebar.Until' />
              </StyledLabel>
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
        <Box width={[1, 2/12]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='MAT.Form.Label.TimeGrain' />
          </StyledLabel>
          <Controller
            name='time_grain'
            control={control}
            render={({field}) => (
              <Select {...field} width={1}>
                {timeGrainOptions.map((option, idx) => (
                  <option key={idx} value={option}>{intl.formatMessage(messages[option])}</option>
                ))}
              </Select>
            )}
          />
        </Box>
        <Box width={[1, 2/12]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='MAT.Form.Label.XAxis' />
          </StyledLabel>
          <Controller
            name='axis_x'
            control={control}
            render={({field}) => (
              <Select {...field} width={1}>
                {xAxisOptionsFiltered.map((option, idx) => (
                  <option key={idx} value={option}>{option.length > 0 ? intl.formatMessage(messages[option]) : option}</option>
                ))}
              </Select>
            )}
          />
        </Box>
        <Box width={[1, 2/12]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='MAT.Form.Label.YAxis' />
          </StyledLabel>
          <Controller
            name='axis_y'
            control={control}
            render={({field}) => (
              <Select {...field} width={1}>
                {yAxisOptionsFiltered.map((option, idx) => (
                  <option key={idx} value={option}>{option.length > 0 ? intl.formatMessage(messages[option]) : option}</option>
                ))}
              </Select>
            )}
          />
        </Box>
      </Flex>
      <Flex my={2} flexDirection={['column', 'row']}>
        <Box width={[1, 1/5]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='Search.Sidebar.TestName' />
          </StyledLabel>
          <Controller
            name='test_name'
            control={control}
            render={({field}) => (
              <Select {...field} width={1}>
                <TestNameOptions testNames={testNames} includeAllOption={false} />
              </Select>
            )}
          />
        </Box>
        {showWebConnectivityFilters &&
          <>
            <Box width={[1, 1/5]} mx={[0, 2]}>
              <StyledLabel>
                <FormattedMessage id='Search.Sidebar.Domain' />
              </StyledLabel>
              <Controller
                name='domain'
                control={control}
                render={({field}) => (
                  <Input
                    placeholder='twitter.com'
                    {...field}
                  />
                )}
              />
            </Box>
            <Box width={[1, 1/5]} mx={[0, 2]}>
              <StyledLabel>
                <FormattedMessage id='Search.Sidebar.Input' />
              </StyledLabel>
              <Controller
                name='input'
                control={control}
                render={({field}) => (
                  <Input
                    placeholder='https://fbcdn.net/robots.txt'
                    {...field}
                  />
                )}
              />
            </Box>
            <Box width={[1, 1/5]} mx={[0, 2]}>
              <StyledLabel>
                <FormattedMessage id='Search.Sidebar.Categories' />
              </StyledLabel>
              <Controller
                name='category_code'
                control={control}
                render={({field}) => (
                  <Select {...field}>
                    <option value="">{intl.formatMessage({id: 'MAT.Form.All'})}</option>
                    {categoryCodes
                      .sort((a, b) => a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0)
                      .map(([code, label], idx) => (
                        <option key={idx} value={code}>{intl.formatMessage({id: `CategoryCode.${code}.Name`})}</option>
                    ))}
                  </Select>
                )}
              />
            </Box>
          </>
        }
      </Flex>
      <Flex my={4}>
        <Button data-test-id='mat-form-submit' width={[1, 'unset']} onClick={maybeWarnBeforeSubmit}>
          <FormattedMessage id='MAT.Form.Submit' />
        </Button>
      </Flex>

    </form>
  )
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  testNames: PropTypes.array,
  query: PropTypes.shape({
    axis_x: PropTypes.string,
    axis_y: PropTypes.string,
    since: PropTypes.string,
    until: PropTypes.string,
    test_name: PropTypes.string,
    domain: PropTypes.string,
    input: PropTypes.string,
    probe_cc: PropTypes.string,
    category_code: PropTypes.string,
    time_grain: PropTypes.string,
  })
}
