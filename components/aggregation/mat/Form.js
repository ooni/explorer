import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { Input, Select } from 'ooni-components'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import { localisedCountries } from 'utils/i18nCountries'
import DateRangePicker from '../../DateRangePicker'
import { TestNameOptions } from '../../TestNameOptions'
import { categoryCodes } from '../../utils/categoryCodes'
import { ConfirmationModal } from './ConfirmationModal'

const DAY_GRAIN_THRESHOLD_IN_MONTHS = 12
const WEEK_GRAIN_THRESHOLD_IN_MONTHS = 36

const messages = defineMessages({
  measurement_start_day: {
    id: 'MAT.Form.Label.AxisOption.measurement_start_day',
    defaultMessage: '',
  },
  domain: {
    id: 'MAT.Form.Label.AxisOption.domain',
    defaultMessage: '',
  },
  input: {
    id: 'MAT.Form.Label.AxisOption.input',
    defaultMessage: '',
  },
  category_code: {
    id: 'MAT.Form.Label.AxisOption.category_code',
    defaultMessage: '',
  },
  probe_cc: {
    id: 'MAT.Form.Label.AxisOption.probe_cc',
    defaultMessage: 'D',
  },
  probe_asn: {
    id: 'MAT.Form.Label.AxisOption.probe_asn',
    defaultMessage: '',
  },
  hour: {
    id: 'MAT.Form.TimeGrainOption.hour',
    defaultMessage: '',
  },
  day: {
    id: 'MAT.Form.TimeGrainOption.day',
    defaultMessage: '',
  },
  week: {
    id: 'MAT.Form.TimeGrainOption.week',
    defaultMessage: '',
  },
  month: {
    id: 'MAT.Form.TimeGrainOption.month',
    defaultMessage: '',
  },
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
  ['', [], false],
]

const testsWithValidDomainFilter = [
  'web_connectivity',
  'http_requests',
  'dns_consistency',
  'tcp_connect',
]

const filterAxisOptions = (
  options,
  countryValue = '',
  testNameValue = 'web_connectivity',
) => {
  return options
    .filter(([option, validTestNames, hideForSingleCountry]) => {
      if (hideForSingleCountry && countryValue !== '') return false
      return (
        validTestNames.length === 0 || validTestNames.includes(testNameValue)
      )
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
  time_grain: 'day',
  ooni_run_link_id: '',
}

export const Form = ({ onSubmit, query }) => {
  const intl = useIntl()
  const router = useRouter()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const defaultValues = useMemo(
    () => Object.assign({}, defaultDefaultValues, query),
    [query],
  )

  const { handleSubmit, control, getValues, watch, reset, setValue } = useForm({
    defaultValues,
    shouldUnregister: true,
  })

  useEffect(() => {
    if (router.isReady) {
      reset(defaultValues)
    }
  }, [defaultValues, reset, router.isReady])

  const [since, setSince] = useState(defaultValues.since)
  const [until, setUntil] = useState(defaultValues.until)
  const [countryValue, setCountryValue] = useState(defaultValues.probe_cc)
  const [testNameValue, setTestNameValue] = useState(defaultValues.test_name)

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'since') setSince(value.since)
      if (name === 'until') setUntil(value.until)
      if (name === 'probe_cc') setCountryValue(value.probe_cc)
      if (name === 'test_name') setTestNameValue(value.test_name)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const sortedCountries = useMemo(
    () =>
      localisedCountries(intl.locale).sort((a, b) =>
        new Intl.Collator(intl.locale).compare(
          a.localisedCountryName,
          b.localisedCountryName,
        ),
      ),
    [intl.locale],
  )

  const showWebConnectivityFilters = useMemo(
    () => isValidFilterForTestname(testNameValue, testsWithValidDomainFilter),
    [testNameValue],
  )
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

  const onConfirm = useCallback(
    (e) => {
      setShowConfirmation(false)
      handleSubmit(onSubmit)(e)
    },
    [handleSubmit, onSubmit],
  )

  const onCancel = useCallback((e) => {
    setShowConfirmation(false)
    e.preventDefault()
  }, [])

  const maybeWarnBeforeSubmit = useCallback(
    (e) => {
      e.preventDefault()

      const [since, until, timeGrain] = getValues([
        'since',
        'until',
        'time_grain',
      ])
      const shouldShowConfirmationModal = () => {
        if (timeGrain === 'month') return false
        const diff = dayjs(until).diff(dayjs(since), 'month')
        if (timeGrain === 'week') return diff > WEEK_GRAIN_THRESHOLD_IN_MONTHS
        return diff > DAY_GRAIN_THRESHOLD_IN_MONTHS
      }

      if (shouldShowConfirmationModal()) {
        setShowConfirmation(true)
      } else {
        // Otherwise just continue with submission without interruption
        onConfirm(e)
      }
    },
    [getValues, onConfirm],
  )

  const xAxisOptionsFiltered = useMemo(() => {
    return filterAxisOptions(xAxisOptions, countryValue, testNameValue)
  }, [testNameValue, countryValue])

  useEffect(() => {
    if (!xAxisOptionsFiltered.includes(getValues('axis_x')))
      setValue('axis_x', 'measurement_start_day')
  }, [setValue, getValues, xAxisOptionsFiltered])

  const yAxisOptionsFiltered = useMemo(() => {
    return filterAxisOptions(yAxisOptions, countryValue, testNameValue)
  }, [testNameValue, countryValue])

  useEffect(() => {
    if (!yAxisOptionsFiltered.includes(getValues('axis_y')))
      setValue('axis_y', '')
  }, [setValue, getValues, yAxisOptionsFiltered])

  const timeGrainOptions = useMemo(() => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!until?.match(dateRegex) || !since?.match(dateRegex))
      return ['hour', 'day', 'week', 'month']
    const diff = dayjs(until).diff(dayjs(since), 'day')
    if (diff < 8) {
      const availableValues = ['hour', 'day']
      if (!availableValues.includes(getValues('time_grain')))
        setValue('time_grain', 'hour')
      return availableValues
    }
    if (diff >= 8 && diff < 31) {
      const availableValues = ['day', 'week']
      if (!availableValues.includes(getValues('time_grain')))
        setValue('time_grain', 'day')
      return availableValues
    }
    if (diff >= 31) {
      const availableValues = ['day', 'week', 'month']
      if (!availableValues.includes(getValues('time_grain')))
        setValue('time_grain', 'day')
      return availableValues
    }
  }, [setValue, getValues, since, until])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ConfirmationModal
        show={showConfirmation}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
      <div className="flex items-center flex-row flex-wrap gap-4 my-2">
        <div className="w-full sm:w-5/12 md:w-3/12 lg:w-2/12">
          <Controller
            render={({ field }) => (
              <Select
                {...field}
                label={intl.formatMessage({ id: 'Search.Sidebar.Country' })}
                width={1}
              >
                <option value="">
                  {intl.formatMessage({ id: 'MAT.Form.AllCountries' })}
                </option>
                {sortedCountries.map((c, idx) => (
                  <option key={idx} value={c.iso3166_alpha2}>
                    {c.localisedCountryName}
                  </option>
                ))}
              </Select>
            )}
            name="probe_cc"
            control={control}
          />
        </div>
        <div className="w-full sm:w-5/12 md:w-3/12 lg:w-1/12">
          <Controller
            name="probe_asn"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="AS1234"
                label={intl.formatMessage({ id: 'Search.Sidebar.ASN' })}
                {...field}
              />
            )}
          />
        </div>
        <div className="w-full sm:w-5/12 md:w-5/12 lg:w-3/12">
          <div className="flex gap-4">
            <Controller
              name="since"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="w-full"
                  label={intl.formatMessage({ id: 'Search.Sidebar.From' })}
                  onFocus={() => setShowDatePicker(true)}
                  onKeyDown={() => setShowDatePicker(false)}
                />
              )}
            />
            <Controller
              name="until"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="w-full"
                  label={intl.formatMessage({ id: 'Search.Sidebar.Until' })}
                  onFocus={() => setShowDatePicker(true)}
                  onKeyDown={() => setShowDatePicker(false)}
                />
              )}
            />
          </div>
          {showDatePicker && (
            <DateRangePicker
              handleRangeSelect={handleRangeSelect}
              initialRange={{
                from: getValues('since'),
                to: getValues('until'),
              }}
              close={() => setShowDatePicker(false)}
            />
          )}
        </div>
        <div className="w-full sm:w-5/12 md:w-3/12 lg:w-[9.5%]">
          <Controller
            name="time_grain"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label={intl.formatMessage({ id: 'MAT.Form.Label.TimeGrain' })}
                width={1}
              >
                {timeGrainOptions.map((option, idx) => (
                  <option key={idx} value={option}>
                    {intl.formatMessage(messages[option])}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>
        <div className="w-full sm:w-5/12 md:w-3/12 lg:w-2/12">
          <Controller
            name="axis_x"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label={intl.formatMessage({ id: 'MAT.Form.Label.XAxis' })}
                width={1}
              >
                {xAxisOptionsFiltered.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option.length > 0
                      ? intl.formatMessage(messages[option])
                      : option}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>
        <div className="w-full sm:w-5/12 md:w-3/12 lg:w-2/12">
          <Controller
            name="axis_y"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label={intl.formatMessage({ id: 'MAT.Form.Label.YAxis' })}
                width={1}
              >
                {yAxisOptionsFiltered.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option.length > 0
                      ? intl.formatMessage(messages[option])
                      : option}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>
      </div>
      <div className="flex my-2 flex-row flex-wrap gap-4">
        <div className="w-full sm:w-5/12 md:w-4/12 lg:w-3/12">
          <Controller
            name="test_name"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label={intl.formatMessage({ id: 'Search.Sidebar.TestName' })}
                width={1}
              >
                <TestNameOptions includeAllOption={false} />
              </Select>
            )}
          />
        </div>
        {showWebConnectivityFilters && (
          <>
            <div className="w-full sm:w-5/12 md:w-3/12 lg:w-2/12">
              <Controller
                name="domain"
                control={control}
                render={({ field }) => (
                  <Input
                    label={intl.formatMessage({ id: 'Search.Sidebar.Domain' })}
                    placeholder="twitter.com"
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-full sm:w-5/12 md:w-3/12 lg:w-2/12">
              <Controller
                name="input"
                control={control}
                render={({ field }) => (
                  <Input
                    label={intl.formatMessage({ id: 'Search.Sidebar.Input' })}
                    placeholder="https://fbcdn.net/robots.txt"
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-full sm:w-5/12 md:w-4/12 lg:w-2/12">
              <Controller
                name="category_code"
                control={control}
                render={({ field }) => (
                  <Select
                    label={intl.formatMessage({
                      id: 'Search.Sidebar.Categories',
                    })}
                    {...field}
                  >
                    <option value="">
                      {intl.formatMessage({ id: 'MAT.Form.All' })}
                    </option>
                    {categoryCodes
                      .sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
                      .map(([code, label], idx) => (
                        <option key={idx} value={code}>
                          {intl.formatMessage({
                            id: `CategoryCode.${code}.Name`,
                          })}
                        </option>
                      ))}
                  </Select>
                )}
              />
            </div>
          </>
        )}
        <div className="w-full sm:w-5/12 md:w-4/12 lg:w-2/12">
          <Controller
            name="ooni_run_link_id"
            control={control}
            render={({ field }) => (
              <Input
                label={intl.formatMessage({
                  id: 'Search.Sidebar.OoniRunLinkId',
                })}
                {...field}
              />
            )}
          />
        </div>
      </div>
      <div className="flex my-8">
        <button
          type="button"
          className="btn btn-primary"
          data-test-id="mat-form-submit"
          onClick={maybeWarnBeforeSubmit}
        >
          <FormattedMessage id="MAT.Form.Submit" />
        </button>
      </div>
    </form>
  )
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
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
  }),
}
