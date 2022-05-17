import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import {
  Flex, Box,
  Button,
  Input,
  Select,
  Label,
} from 'ooni-components'
import moment from 'moment'
import dayjs from 'services/dayjs'
import { useForm, Controller } from 'react-hook-form'

import DatePicker from '../DatePicker'
import {
  RadioGroup,
  RadioButton
} from './Radio'
import { TestNameOptions } from '../TestNameOptions'
import { categoryCodes } from '../utils/categoryCodes'

const StyledInputWithLabel = styled.div``
const StyledLabel = styled(Label).attrs({
  mb: 1,
  fontSize: 1
})`
  color: ${props => props.theme.colors.blue5};
  padding-top: 32px;
`
const InputWithLabel = (props) => (
  <StyledInputWithLabel>
    <StyledLabel>
      {props.label}
    </StyledLabel>
    <Input {...props} />
  </StyledInputWithLabel>
)

const StyledSelectWithLabel = styled.div``

const SelectWithLabel = (props) => (
  <StyledSelectWithLabel>
    <StyledLabel>
      {props.label}
    </StyledLabel>
    <Select {...props} style={{width: '100%'}}>
      {props.children}
    </Select>
  </StyledSelectWithLabel>
)

const StyledFilterSidebar = styled.div`
`

const CategoryOptions = () => {
  const intl = useIntl()
  return (
    <>
      <option value="">{intl.formatMessage({id: 'Search.Sidebar.Categories.All'})}</option>
      {categoryCodes
        .sort((a, b) => a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0)
        .map(([code, label], idx) =>
          <option key={idx} value={code}>
            {intl.formatMessage({id: `CategoryCode.${code}.Name`})}
          </option>
      )}
    </>
  )
}

const testsWithValidDomain = [
  'XX', // We show the field by default (state initialized to 'XX')
  'web_connectivity',
  'http_requests',
  'dns_consistency',
  'tcp_connect'
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
  'torsf'
]

const testsWithConfirmedStatus = [
  'XX',
  'web_connectivity'
]

function isValidFilterForTestname(testName = 'XX', arrayWithMapping) {
  // Should domain filter be shown for `testsWithValidDomain`?
  return arrayWithMapping.includes(testName)
}

// Display `${tomorrow}` as the end date for default search
// to include the measurements of `${today}` as well.
const tomorrowUTC = dayjs.utc().add(1, 'day').format('YYYY-MM-DD')

const asnRegEx = /^(AS)?([1-9][0-9]*)$/
const domainRegEx = /(^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,7}(:[0-9]{1,5})?$)|(^(([0-9]{1,3})\.){3}([0-9]{1,3}))/

export const queryToFilterMap = {
  domain: [ 'domainFilter', ''],
  category_code: [ 'categoryFilter', ''],
  probe_cc: [ 'countryFilter', ''],
  probe_asn: [ 'asnFilter', ''],
  test_name: [ 'testNameFilter', 'XX'],
  since: [ 'sinceFilter', ''],
  until: [ 'untilFilter', ''],
  only: [ 'onlyFilter', 'all'],
  failure: [ 'hideFailed', true]
}



const FilterSidebar = ({
  testNames,
  countries,
  domainFilter,
  categoryFilter,
  onlyFilter = 'all',
  testNameFilter = 'XX',
  countryFilter = 'XX',
  asnFilter,
  sinceFilter,
  untilFilter = tomorrowUTC,
  hideFailed = true,
  onApplyFilter
}) => {
  const intl = useIntl()

  const defaultValues = {
    domainFilter,
    categoryFilter,
    onlyFilter,
    testNameFilter,
    countryFilter,
    asnFilter,
    sinceFilter,
    untilFilter,
    hideFailed
  }

  const { handleSubmit, control, watch, resetField, formState, setValue } = useForm({
    defaultValues
  })
  const { errors } = formState

  const testNameFilterValue = watch('testNameFilter')
  const debugg = categoryFilter
  //const debugg = watch('categoryFilter')
  const onlyFilterValue = watch('onlyFilter')
  const [untilFilterValue, sinceFilterValue] = watch(['untilFilter', 'sinceFilter'])

  // Does the selected testName need a domain filter
  const showDomain = useMemo(() => isValidFilterForTestname(testNameFilterValue, testsWithValidDomain), [testNameFilterValue])
  // to avoid bad queries, blank out the `domain` field when it is shown/hidden
  useEffect(() => {
    setValue('domainFilter', '')
  }, [setValue, showDomain])

  // Can we filter out anomalies or confirmed for this test_name
  const showAnomalyFilter = useMemo(() => isValidFilterForTestname(testNameFilterValue, testsWithAnomalyStatus), [testNameFilterValue])
  const showConfirmedFilter = useMemo(() => isValidFilterForTestname(testNameFilterValue, testsWithConfirmedStatus), [testNameFilterValue])
  // Reset status filter to 'all' if selected state isn't relevant
  // e.g 'anomalies' isn't relevant for `ndt`, or 'confirmed' for `telegram`
  // But retain the state in some cases e.g 'anomalies' is relevant for `telegram` and `psiphon`
  useEffect(() => {
    if(onlyFilterValue === 'anomalies' && !showAnomalyFilter) {
      resetField('onlyFilter')
    }
  }, [onlyFilterValue, resetField, showAnomalyFilter])
  useEffect(() => {
    if (onlyFilterValue === 'confirmed' && !showConfirmedFilter) {
      resetField('onlyFilter')
    }
  }, [onlyFilterValue, resetField, showConfirmedFilter])

  function isSinceValid(currentDate) {
    // Valid dates for start of date range
    // 1. Before the 'Until' date, if provided
    // 2. Until tomorrow
    const tomorrow = dayjs.utc().add(1, 'day')
    if (untilFilterValue.length !== 0) {
      return currentDate.isBefore(untilFilterValue)
    } else {
      return currentDate.isSameOrBefore(tomorrow)
    }
  }

  function isUntilValid(currentDate) {
    // Valid dates for end of date range
    // 1. After the 'Since' date if provided
    // 2. Until tomorrow
    const tomorrow = dayjs.utc().add(1, 'day')
    if (sinceFilterValue.length !== 0) {
      return currentDate.isAfter(sinceFilterValue) && currentDate.isSameOrBefore(tomorrow)
    } else {
      return currentDate.isSameOrBefore(tomorrow)
    }
  }

  const onSubmit = (data) => {
    onApplyFilter(data)
  }

  //Insert an 'Any' option to test name filter
  // testNameOptions.unshift({name: intl.formatMessage({id: 'Search.Sidebar.TestName.AllTests'}), id: 'XX'})

  const countryOptions = [...countries]
  countryOptions.unshift({name: intl.formatMessage({id: 'Search.Sidebar.Country.AllCountries'}), alpha_2: 'XX'})

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StyledFilterSidebar>
        <Controller
          control={control}
          name='countryFilter'
          render={({field}) => (
            <SelectWithLabel
              {...field}
              pt={2}
              label={intl.formatMessage({id: 'Search.Sidebar.Country'})}
              data-test-id='country-filter'
            >
              {countryOptions.map((v, idx) => {
                return (
                  <option key={idx} value={v.alpha_2}>{v.name}</option>
                )
              })}
            </SelectWithLabel>
          )}
        />

        <Controller
          control={control}
          name='asnFilter'
          render={({field}) => (
            <InputWithLabel
              {...field}
              label={intl.formatMessage({id: 'Search.Sidebar.ASN'})}
              error={errors?.asnFilter?.message}
              data-test-id='asn-filter'
              placeholder={intl.formatMessage({id: 'Search.Sidebar.ASN.example'})}
            />
          )}
          rules={{
            pattern: {
              value: asnRegEx,
              message: intl.formatMessage({id: 'Search.Sidebar.ASN.Error'})
            }
          }}
        />

        <Flex flexDirection={['column', 'row']}>
          <Box width={1/2} pr={1}>
            <StyledLabel>
              {intl.formatMessage({id: 'Search.Sidebar.From'})}
            </StyledLabel>
            <Controller
              control={control}
              name='sinceFilter'
              render={({field}) => (
                <DatePicker
                  {...field}
                  onChange={(date) =>
                    field.onChange(moment.isMoment(date)
                      ? date.format('YYYY-MM-DD')
                      : date
                    )
                  }
                  dateFormat='YYYY-MM-DD'
                  utc={true}
                  timeFormat={false}
                  isValidDate={isSinceValid}
                  inputProps={{id: 'since-filter'}}
                />
              )}
            />
          </Box>
          <Box width={1/2} pl={1}>
            <StyledLabel>
              {intl.formatMessage({id: 'Search.Sidebar.Until'})}
            </StyledLabel>
            <Controller
              control={control}
              name='untilFilter'
              render={({field}) => (
                <DatePicker
                  {...field}
                  onChange={(date) =>
                    field.onChange(moment.isMoment(date)
                      ? date.format('YYYY-MM-DD')
                      : date
                    )
                  }
                  dateFormat='YYYY-MM-DD'
                  utc={true}
                  timeFormat={false}
                  isValidDate={isUntilValid}
                  inputProps={{id: 'until-filter'}}
                />
              )}
            />
          </Box>
        </Flex>

        <Controller
          control={control}
          name='testNameFilter'
          render={({field}) => (
            <SelectWithLabel
              {...field}
              pt={2}
              label={intl.formatMessage({id: 'Search.Sidebar.TestName'})}
              data-test-id='testname-filter'
            >
              <TestNameOptions testNames={testNames} />
            </SelectWithLabel>
  
          )}
        />

        {showConfirmedFilter &&
          <Controller
            control={control}
            name='categoryFilter'
            render={({field}) => (
              <SelectWithLabel
                {...field}
                pt={2}
                label={intl.formatMessage({id: 'Search.Sidebar.Categories'})}
                data-test-id='category-filter'
              >
                <CategoryOptions />
            </SelectWithLabel>
            )}
          />
        }
        {
          showDomain &&
          <Controller
          control={control}
          name='domainFilter'
          render={({field}) => (
            <InputWithLabel
              {...field}
              label={intl.formatMessage({id: 'Search.Sidebar.Domain'})}
              data-test-id='domain-filter'
              error={errors?.domainFilter?.message}
              placeholder={intl.formatMessage({id: 'Search.Sidebar.Domain.Placeholder'})}
              type="text"
            />
          )}
          rules={{
            validate: (value = '') =>
              (String(value).length === 0 || domainRegEx.test(value))
              || intl.formatMessage({id: 'Search.Sidebar.Domain.Error'})
          }}
        />
        }

        {(showConfirmedFilter || showAnomalyFilter) && (<>
          <StyledLabel>
            {intl.formatMessage({id: 'Search.Sidebar.Status'})}
          </StyledLabel>

          <Controller
            control={control}
            name='onlyFilter'
            render={({field}) => (
              <RadioGroup {...field}>
                <RadioButton
                  label={intl.formatMessage({id: 'Search.FilterButton.AllResults'}) }
                  value='all'
                />
                {showConfirmedFilter ? (
                  <RadioButton
                    label={intl.formatMessage({id: 'Search.FilterButton.Confirmed'}) }
                    value='confirmed'
                  />
                ) : <div/>}
                {showAnomalyFilter ? (
                  <RadioButton
                    label={intl.formatMessage({id: 'Search.FilterButton.Anomalies'}) }
                    value='anomalies'
                  />
                ) : <div/>}
              </RadioGroup>
            )}
          />
        </>)}
          <Label htmlFor='hideFailed' alignItems='center'>
            <Controller
              control={control}
              name='hideFailed'
              render={({field}) => (
                <input {...field} type='checkbox' id='hideFailed' checked={field.value} />
              )}
            />
            <Box mx={1}>{intl.formatMessage({id: 'Search.Sidebar.HideFailed'})}</Box>
          </Label>
        <Button
          mt={3}
          type='submit'
        >
          {intl.formatMessage({id: 'Search.Sidebar.Button.FilterResults'})}
        </Button>
      </StyledFilterSidebar>
    </form>
  )
}

export default FilterSidebar
