import { format } from 'date-fns'
import {
  Checkbox,
  Input,
  RadioButton,
  RadioGroup,
  Select,
} from 'ooni-components'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'

import { TestNameOptions } from 'components/TestNameOptions'
import { categoryCodes } from 'components/utils/categoryCodes'
import dayjs from 'services/dayjs'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import DateRangePicker from '../DateRangePicker'
import countries from 'data/countries.json'
import { useRouter } from 'next/router'

const CategoryOptions = () => {
  const intl = useIntl()
  return (
    <>
      <option value="">
        {intl.formatMessage({ id: 'Search.Sidebar.Categories.All' })}
      </option>
      {categoryCodes
        .sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
        .map(([code]) => (
          <option key={code} value={code}>
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
const monthAgoUTC = dayjs.utc().subtract(30, 'day').format('YYYY-MM-DD')

const asnRegEx = /^(AS)?([1-9][0-9]*)$/
const domainRegEx =
  /(^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?$)|(^(([0-9]{1,3})\.){3}([0-9]{1,3}))/
const inputRegEx =
  /(^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,}\.[a-zA-Z0-9()]{2,}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$)|(^(([0-9]{1,3})\.){3}([0-9]{1,3}))/

export const queryToFilterMap = {
  domain: ['domainFilter', ''],
  input: ['inputFilter', ''],
  ooni_run_link_id: ['ooniRunLinkId', ''],
  category_code: ['categoryFilter', ''],
  probe_cc: ['countryFilter', ''],
  probe_asn: ['asnFilter', ''],
  test_name: ['testNameFilter', 'XX'],
  since: ['sinceFilter', ''],
  until: ['untilFilter', ''],
  only: ['onlyFilter', 'all'],
  failure: ['hideFailed', true],
}

const getFilterQuery = (state, query) => {
  const resetValues = [undefined, 'XX', '']
  for (const [queryParam, [key]] of Object.entries(queryToFilterMap)) {
    // If it's unset or marked as XX, let's be sure the path is clean
    if (resetValues.includes(state[key])) {
      if (queryParam in query) {
        delete query[queryParam]
      }
    } else if (key === 'onlyFilter' && state[key] === 'all') {
      // If the onlyFilter is not set to 'confirmed' or 'anomalies'
      // remove it from the path
      if (queryParam in query) {
        delete query[queryParam]
      }
    } else if (key === 'hideFailed') {
      if (state[key] === true) {
        // When `hideFailure` is true, add `failure=false` in the query
        query[queryParam] = false
      } else {
        query[queryParam] = true
      }
    } else {
      query[queryParam] = state[key]
    }
  }
  return query
}

const FilterSidebar = () => {
  const router = useRouter()
  const { query, isReady } = router
  const intl = useIntl()

  const onApplyFilter = (state) => {
    const filterQuery = getFilterQuery(state, query)
    const href = {
      pathname: '/search',
      query: filterQuery,
    }
    router.push(href, href, { shallow: true })
  }

  // Compute default values from query params
  const defaultValues = useMemo(() => {
    return {
      domainFilter: query.domain || '',
      inputFilter: query.input || '',
      ooniRunLinkId: query.ooni_run_link_id || '',
      categoryFilter: query.category_code || '',
      onlyFilter: query.only || 'all',
      testNameFilter: query.test_name || 'XX',
      countryFilter: query.probe_cc || 'XX',
      asnFilter: query.probe_asn || '',
      sinceFilter: query.since || monthAgoUTC,
      untilFilter: query.until || tomorrowUTC,
      hideFailed: query.failure === undefined ? true : !query.failure,
    }
  }, [query])

  const {
    handleSubmit,
    control,
    watch,
    resetField,
    formState,
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues,
  })

  // Initialize/reset form when query params are available
  useEffect(() => {
    if (isReady) {
      reset(defaultValues)
    }
  }, [isReady])

  const { errors } = formState

  const testNameFilterValue = watch('testNameFilter')
  const onlyFilterValue = watch('onlyFilter')

  // Does the selected testName need a domain filter
  const showDomain = useMemo(
    () => isValidFilterForTestname(testNameFilterValue, testsWithValidDomain),
    [testNameFilterValue],
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
    [testNameFilterValue],
  )
  const showConfirmedFilter = useMemo(
    () =>
      isValidFilterForTestname(testNameFilterValue, testsWithConfirmedStatus),
    [testNameFilterValue],
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

  const handleRangeSelect = useCallback(
    (range) => {
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
    },
    [setValue],
  )

  const countryOptions = useMemo(() => {
    const options = [
      ...countries.map((c) => ({
        ...c,
        name: getLocalisedRegionName(c.alpha_2, intl.locale),
      })),
    ]

    options.sort((a, b) => a.name.localeCompare(b.name))
    options.unshift({
      name: intl.formatMessage({ id: 'Search.Sidebar.Country.AllCountries' }),
      alpha_2: 'XX',
    })

    return options
  }, [intl])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="countryFilter"
        render={({ field }) => (
          <Select
            className="my-4"
            {...field}
            label={intl.formatMessage({ id: 'Search.Sidebar.Country' })}
            data-test-id="country-filter"
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
        name="asnFilter"
        render={({ field }) => (
          <Input
            className="mb-4"
            {...field}
            label={intl.formatMessage({ id: 'Search.Sidebar.ASN' })}
            error={errors?.asnFilter?.message}
            data-test-id="asn-filter"
            placeholder={intl.formatMessage({
              id: 'Search.Sidebar.ASN.example',
            })}
          />
        )}
        rules={{
          pattern: {
            value: asnRegEx,
            message: intl.formatMessage({ id: 'Search.Sidebar.ASN.Error' }),
          },
        }}
      />

      <div className=" relative">
        <div className="flex flex-col md:flex-row">
          <div className="w-1/2 pr-1">
            <Controller
              control={control}
              name="sinceFilter"
              render={({ field }) => (
                <Input
                  className="mb-4"
                  {...field}
                  onFocus={() => setShowDatePicker(true)}
                  onKeyDown={() => setShowDatePicker(false)}
                  label={intl.formatMessage({ id: 'Search.Sidebar.From' })}
                  id="since-filter"
                />
              )}
            />
          </div>
          <div className="w-1/2 pl-1">
            <Controller
              control={control}
              name="untilFilter"
              render={({ field }) => (
                <Input
                  className="mb-4"
                  {...field}
                  onFocus={() => setShowDatePicker(true)}
                  onKeyDown={() => setShowDatePicker(false)}
                  label={intl.formatMessage({ id: 'Search.Sidebar.Until' })}
                  id="until-filter"
                />
              )}
            />
          </div>
        </div>
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
      </div>

      <Controller
        control={control}
        name="testNameFilter"
        render={({ field }) => (
          <Select
            className="mb-4"
            {...field}
            pt={2}
            label={intl.formatMessage({ id: 'Search.Sidebar.TestName' })}
            data-test-id="testname-filter"
          >
            <TestNameOptions />
          </Select>
        )}
      />

      {showConfirmedFilter && (
        <Controller
          control={control}
          name="categoryFilter"
          render={({ field }) => (
            <Select
              className="mb-4"
              {...field}
              label={intl.formatMessage({ id: 'Search.Sidebar.Categories' })}
              data-test-id="category-filter"
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
            name="domainFilter"
            render={({ field }) => (
              <Input
                className="mb-4"
                {...field}
                label={intl.formatMessage({ id: 'Search.Sidebar.Domain' })}
                data-test-id="domain-filter"
                error={errors?.domainFilter?.message}
                placeholder={intl.formatMessage({
                  id: 'Search.Sidebar.Domain.Placeholder',
                })}
                type="text"
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
            name="inputFilter"
            render={({ field }) => (
              <Input
                {...field}
                label={intl.formatMessage({ id: 'Search.Sidebar.Input' })}
                data-test-id="input-filter"
                error={errors?.inputFilter?.message}
                placeholder={intl.formatMessage({
                  id: 'Search.Sidebar.Input.Placeholder',
                })}
                type="text"
                className="mb-4"
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

      <Controller
        control={control}
        name="ooniRunLinkId"
        render={({ field }) => (
          <Input
            {...field}
            label={intl.formatMessage({
              id: 'Search.Sidebar.OoniRunLinkId',
            })}
            type="text"
          />
        )}
      />

      {(showConfirmedFilter || showAnomalyFilter) && (
        <>
          <label className="mb-1 block text-blue-500 pt-4">
            {intl.formatMessage({ id: 'Search.Sidebar.Status' })}
          </label>

          <Controller
            control={control}
            name="onlyFilter"
            render={({ field }) => (
              <RadioGroup {...field}>
                <RadioButton
                  label={intl.formatMessage({
                    id: 'Search.FilterButton.AllResults',
                  })}
                  value="all"
                  className="mb-2"
                />
                {showConfirmedFilter ? (
                  <RadioButton
                    label={intl.formatMessage({
                      id: 'Search.FilterButton.Confirmed',
                    })}
                    value="confirmed"
                    className="mb-2"
                  />
                ) : (
                  <div />
                )}
                {showAnomalyFilter ? (
                  <RadioButton
                    label={intl.formatMessage({
                      id: 'Search.FilterButton.Anomalies',
                    })}
                    value="anomalies"
                    className="mb-2"
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
        name="hideFailed"
        render={({ field }) => (
          <Checkbox
            {...field}
            id="hideFailed"
            checked={field.value}
            label={intl.formatMessage({ id: 'Search.Sidebar.HideFailed' })}
            className="my-2"
          />
        )}
      />
      <button className="btn btn-primary mt-8" type="submit">
        {intl.formatMessage({ id: 'Search.Sidebar.Button.FilterResults' })}
      </button>
    </form>
  )
}

export default FilterSidebar
