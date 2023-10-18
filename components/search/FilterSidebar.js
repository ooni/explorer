import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { Flex, Box, Button, Input, Label, RadioGroup, RadioButton, Checkbox, Select } from 'ooni-components'
import dayjs from 'services/dayjs'
import { useForm, Controller } from 'react-hook-form'

import DateRangePicker from '../DateRangePicker'
import { format } from 'date-fns'
import { TestNameOptions } from '../TestNameOptions'
import { categoryCodes } from '../utils/categoryCodes'
import { getLocalisedRegionName } from 'utils/i18nCountries'

const StyledLabel = styled(Label).attrs({
  mb: 1,
  fontSize: 1,
})`
  color: ${(props) => props.theme.colors.blue5};
  padding-top: 32px;
`

const StyledDateRange = styled.div`
  position: relative;
`

const CategoryOptions = () => {
  const intl = useIntl()
  return (
    <>
      <option value=''>{intl.formatMessage({ id: 'Search.Sidebar.Categories.All' })}</option>
      {categoryCodes
        .sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
        .map(([code, label], idx) => (
          <option key={idx} value={code}>
            {intl.formatMessage({ id: `CategoryCode.${code}.Name` })}
          </option>
        ))}
    </>
  )
}

const testsWithValidDomain = [
  'XX', // We show the field by default (state initialized to 'XX')
  'web_connectivity',
  'http_requests',
  'dns_consistency',
  'tcp_connect',
]

const testsWithAnomalyStatus = [
  'XX', // If 'Any' is selected, we still show the filter
  'web_connectivity',
  'telegram',
  'facebook_messenger',
  'whatsapp',
  'signal',
  'http_header_field_manipulation',
  'http_invalid_request_line',
  'psiphon',
  'tor',
  'riseupvpn',
  'torsf',
]

const testsWithConfirmedStatus = ['XX', 'web_connectivity']

function isValidFilterForTestname(testName = 'XX', arrayWithMapping) {
  // Should domain filter be shown for `testsWithValidDomain`?
  return arrayWithMapping.includes(testName)
}

// Display `${tomorrow}` as the end date for default search
// to include the measurements of `${today}` as well.
const tomorrowUTC = dayjs.utc().add(1, 'day').format('YYYY-MM-DD')

const asnRegEx = /^(AS)?([1-9][0-9]*)$/
const domainRegEx = /(^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?$)|(^(([0-9]{1,3})\.){3}([0-9]{1,3}))/
const inputRegEx =
  /(^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,}\.[a-zA-Z0-9()]{2,}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$)|(^(([0-9]{1,3})\.){3}([0-9]{1,3}))/

export const queryToFilterMap = {
  domain: ['domainFilter', ''],
  input: ['inputFilter', ''],
  category_code: ['categoryFilter', ''],
  probe_cc: ['countryFilter', ''],
  probe_asn: ['asnFilter', ''],
  test_name: ['testNameFilter', 'XX'],
  since: ['sinceFilter', ''],
  until: ['untilFilter', ''],
  only: ['onlyFilter', 'all'],
  failure: ['hideFailed', true],
}

const FilterSidebar = ({
  testNames,
  countries,
  domainFilter,
  inputFilter,
  categoryFilter,
  onlyFilter = 'all',
  testNameFilter = 'XX',
  countryFilter = 'XX',
  asnFilter,
  sinceFilter,
  untilFilter = tomorrowUTC,
  hideFailed = true,
  onApplyFilter,
}) => {
  const intl = useIntl()
  const defaultValues = {
    domainFilter,
    inputFilter,
    categoryFilter,
    onlyFilter,
    testNameFilter,
    countryFilter,
    asnFilter,
    sinceFilter,
    untilFilter,
    hideFailed,
  }

  const { handleSubmit, control, watch, resetField, formState, setValue, getValues } = useForm({
    defaultValues,
  })
  const { errors } = formState

  const testNameFilterValue = watch('testNameFilter')
  const debugg = categoryFilter
  //const debugg = watch('categoryFilter')
  const onlyFilterValue = watch('onlyFilter')

  // Does the selected testName need a domain filter
  const showDomain = useMemo(
    () => isValidFilterForTestname(testNameFilterValue, testsWithValidDomain),
    [testNameFilterValue]
  )
  // to avoid bad queries, blank out the `domain` field when it is shown/hidden
  useEffect(() => {
    if (!showDomain) {
      setValue('domainFilter', '')
      setValue('inputFilter', '')
    }
  }, [setValue, showDomain])

  // Can we filter out anomalies or confirmed for this test_name
  const showAnomalyFilter = useMemo(
    () => isValidFilterForTestname(testNameFilterValue, testsWithAnomalyStatus),
    [testNameFilterValue]
  )
  const showConfirmedFilter = useMemo(
    () => isValidFilterForTestname(testNameFilterValue, testsWithConfirmedStatus),
    [testNameFilterValue]
  )
  // Reset status filter to 'all' if selected state isn't relevant
  // e.g 'anomalies' isn't relevant for `ndt`, or 'confirmed' for `telegram`
  // But retain the state in some cases e.g 'anomalies' is relevant for `telegram` and `psiphon`
  useEffect(() => {
    if (onlyFilterValue === 'anomalies' && !showAnomalyFilter) {
      resetField('onlyFilter')
    }
  }, [onlyFilterValue, resetField, showAnomalyFilter])
  useEffect(() => {
    if (onlyFilterValue === 'confirmed' && !showConfirmedFilter) {
      resetField('onlyFilter')
    }
  }, [onlyFilterValue, resetField, showConfirmedFilter])

  const onSubmit = (data) => {
    onApplyFilter(data)
  }

  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleRangeSelect = (range) => {
    if (range?.from) {
      setValue('sinceFilter', format(range.from, 'y-MM-dd'))
    } else {
      setValue('sinceFilter', '')
    }
    if (range?.to) {
      setValue('untilFilter', format(range.to, 'y-MM-dd'))
    } else {
      setValue('untilFilter', '')
    }
    setShowDatePicker(false)
  }

  //Insert an 'Any' option to test name filter
  // testNameOptions.unshift({name: intl.formatMessage({id: 'Search.Sidebar.TestName.AllTests'}), id: 'XX'})

  const countryOptions = [
    ...countries.map((c) => ({
      ...c,
      name: getLocalisedRegionName(c.alpha_2, intl.locale),
    })),
  ]
  countryOptions.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  countryOptions.unshift({
    name: intl.formatMessage({ id: 'Search.Sidebar.Country.AllCountries' }),
    alpha_2: 'XX',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name='countryFilter'
        render={({ field }) => (
          <Select
            {...field}
            pt={2}
            label={intl.formatMessage({ id: 'Search.Sidebar.Country' })}
            data-test-id='country-filter'
            mb={3}
          >
            {countryOptions.map((v, idx) => {
              return (
                <option key={idx} value={v.alpha_2}>
                  {v.name}
                </option>
              )
            })}
          </Select>
        )}
      />

      <Controller
        control={control}
        name='asnFilter'
        render={({ field }) => (
          <Input
            {...field}
            label={intl.formatMessage({ id: 'Search.Sidebar.ASN' })}
            error={errors?.asnFilter?.message}
            data-test-id='asn-filter'
            placeholder={intl.formatMessage({
              id: 'Search.Sidebar.ASN.example',
            })}
            mb={3}
          />
        )}
        rules={{
          pattern: {
            value: asnRegEx,
            message: intl.formatMessage({ id: 'Search.Sidebar.ASN.Error' }),
          },
        }}
      />

      <StyledDateRange>
        <Flex flexDirection={['column', 'row']}>
          <Box width={1 / 2} pr={1}>
            <Controller
              control={control}
              name='sinceFilter'
              render={({ field }) => (
                <Input
                  {...field}
                  onFocus={() => setShowDatePicker(true)}
                  onKeyDown={() => setShowDatePicker(false)}
                  label={intl.formatMessage({ id: 'Search.Sidebar.From' })}
                  id='since-filter'
                  mb={3}
                />
              )}
            />
          </Box>
          <Box width={1 / 2} pl={1}>
            <Controller
              control={control}
              name='untilFilter'
              render={({ field }) => (
                <Input
                  {...field}
                  onFocus={() => setShowDatePicker(true)}
                  onKeyDown={() => setShowDatePicker(false)}
                  label={intl.formatMessage({ id: 'Search.Sidebar.Until' })}
                  id='until-filter'
                  mb={3}
                />
              )}
            />
          </Box>
        </Flex>
        {showDatePicker && (
          <DateRangePicker
            handleRangeSelect={handleRangeSelect}
            initialRange={{
              from: getValues('sinceFilter'),
              to: getValues('untilFilter'),
            }}
            close={() => setShowDatePicker(false)}
          />
        )}
      </StyledDateRange>

      <Controller
        control={control}
        name='testNameFilter'
        render={({ field }) => (
          <Select
            {...field}
            pt={2}
            label={intl.formatMessage({ id: 'Search.Sidebar.TestName' })}
            data-test-id='testname-filter'
            mb={3}
          >
            <TestNameOptions testNames={testNames} />
          </Select>
        )}
      />

      {showConfirmedFilter && (
        <Controller
          control={control}
          name='categoryFilter'
          render={({ field }) => (
            <Select
              {...field}
              pt={2}
              label={intl.formatMessage({ id: 'Search.Sidebar.Categories' })}
              data-test-id='category-filter'
              mb={3}
            >
              <CategoryOptions />
            </Select>
          )}
        />
      )}
      {showDomain && (
        <>
          <Controller
            control={control}
            name='domainFilter'
            render={({ field }) => (
              <Input
                {...field}
                label={intl.formatMessage({ id: 'Search.Sidebar.Domain' })}
                data-test-id='domain-filter'
                error={errors?.domainFilter?.message}
                placeholder={intl.formatMessage({
                  id: 'Search.Sidebar.Domain.Placeholder',
                })}
                type='text'
                mb={3}
              />
            )}
            rules={{
              validate: (value = '') =>
                String(value).length === 0 ||
                domainRegEx.test(value) ||
                intl.formatMessage({ id: 'Search.Sidebar.Domain.Error' }),
            }}
          />
          <Controller
            control={control}
            name='inputFilter'
            render={({ field }) => (
              <Input
                {...field}
                label={intl.formatMessage({ id: 'Search.Sidebar.Input' })}
                data-test-id='input-filter'
                error={errors?.inputFilter?.message}
                placeholder={intl.formatMessage({
                  id: 'Search.Sidebar.Input.Placeholder',
                })}
                type='text'
              />
            )}
            rules={{
              pattern: {
                value: inputRegEx,
                message: intl.formatMessage({
                  id: 'Search.Sidebar.Input.Error',
                }),
              },
            }}
          />
        </>
      )}

      {(showConfirmedFilter || showAnomalyFilter) && (
        <>
          <StyledLabel>{intl.formatMessage({ id: 'Search.Sidebar.Status' })}</StyledLabel>

          <Controller
            control={control}
            name='onlyFilter'
            render={({ field }) => (
              <RadioGroup {...field}>
                <RadioButton
                  label={intl.formatMessage({
                    id: 'Search.FilterButton.AllResults',
                  })}
                  value='all'
                  mb={2}
                />
                {showConfirmedFilter ? (
                  <RadioButton
                    label={intl.formatMessage({
                      id: 'Search.FilterButton.Confirmed',
                    })}
                    value='confirmed'
                    mb={2}
                  />
                ) : (
                  <div />
                )}
                {showAnomalyFilter ? (
                  <RadioButton
                    label={intl.formatMessage({
                      id: 'Search.FilterButton.Anomalies',
                    })}
                    value='anomalies'
                    mb={2}
                  />
                ) : (
                  <div />
                )}
              </RadioGroup>
            )}
          />
        </>
      )}
      <Controller
        control={control}
        name='hideFailed'
        render={({ field }) => (
          <Checkbox
            {...field}
            id='hideFailed'
            checked={field.value}
            label={intl.formatMessage({ id: 'Search.Sidebar.HideFailed' })}
            my={2}
          />
        )}
      />
      <Button mt={3} type='submit'>
        {intl.formatMessage({ id: 'Search.Sidebar.Button.FilterResults' })}
      </Button>
    </form>
  )
}

export default FilterSidebar
