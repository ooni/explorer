import { format } from 'date-fns'
import { Input, MultiSelect } from 'ooni-components'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { getLocalisedRegionName } from '../../utils/i18nCountries'

import DateRangePicker from '../DateRangePicker'

export const Form = ({ onChange, query, availableCountries }) => {
  const intl = useIntl()

  const countryOptions = useMemo(
    () =>
      availableCountries
        .map((cc) => ({
          label: getLocalisedRegionName(cc, intl.locale),
          value: cc,
        }))
        .sort((a, b) =>
          new Intl.Collator(intl.locale).compare(a.label, b.label),
        ),
    [availableCountries, intl],
  )

  const query2formValues = useMemo(() => {
    const countriesInQuery = query.probe_cc?.split(',') ?? ''
    return {
      since: query?.since,
      until: query?.until,
      probe_cc: countryOptions.filter((country) =>
        countriesInQuery.includes(country.value),
      ),
    }
  }, [countryOptions, query])

  const multiSelectStrings = useMemo(
    () => ({
      allItemsAreSelected: intl.formatMessage({
        id: 'ReachabilityDash.Form.Label.CountrySelect.AllSelected',
      }),
      // 'clearSearch': 'Clear Search',
      // 'clearSelected': 'Clear Selected',
      // 'noOptions': 'No options',
      search: intl.formatMessage({
        id: 'ReachabilityDash.Form.Label.CountrySelect.SearchPlaceholder',
      }),
      selectAll: intl.formatMessage({
        id: 'ReachabilityDash.Form.Label.CountrySelect.SelectAll',
      }),
      selectAllFiltered: intl.formatMessage({
        id: 'ReachabilityDash.Form.Label.CountrySelect.SelectAllFiltered',
      }),
      selectSomeItems: intl.formatMessage({
        id: 'ReachabilityDash.Form.Label.CountrySelect.InputPlaceholder',
      }),
      // 'create': 'Create',
    }),
    [intl],
  )

  const { control, getValues, watch, setValue, reset } = useForm({
    defaultValues: query2formValues,
  })

  useEffect(() => {
    reset(query2formValues)
  }, [query2formValues, reset])

  const cleanedUpData = (values) => {
    const { since, until, probe_cc } = values
    return {
      since,
      until,
      probe_cc:
        probe_cc.length > 0
          ? probe_cc.map((d) => d.value).join(',')
          : undefined,
    }
  }

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
    onChange(cleanedUpData(getValues()))
  }

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'probe_cc' && type === 'change')
        onChange(cleanedUpData(getValues()))
    })
    return () => subscription.unsubscribe()
  }, [watch, getValues])

  return (
    <form>
      <div className="flex flex-col md:flex-row">
        <div className="xl:w-1/4 md:w-1/2 mr-4">
          <Controller
            render={({ field }) => (
              <MultiSelect
                label={intl.formatMessage({ id: 'Search.Sidebar.Country' })}
                options={countryOptions}
                overrideStrings={multiSelectStrings}
                {...field}
              />
            )}
            name="probe_cc"
            control={control}
          />
        </div>
        <div className="xl:w-1/4 md:w-1/2">
          <div className="flex">
            <div className="w-1/2 mr-4">
              <Controller
                name="since"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={intl.formatMessage({ id: 'Search.Sidebar.From' })}
                    onFocus={() => setShowDatePicker(true)}
                    onKeyDown={() => setShowDatePicker(false)}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className="w-1/2 mr-4">
              <Controller
                name="until"
                control={control}
                render={({ field }) => (
                  <Input
                    label={intl.formatMessage({ id: 'Search.Sidebar.Until' })}
                    {...field}
                    onFocus={() => setShowDatePicker(true)}
                    onKeyDown={() => setShowDatePicker(false)}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
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
      </div>
    </form>
  )
}
