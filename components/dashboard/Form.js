import { format } from 'date-fns'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { Input, MultiSelect } from 'ooni-components'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'

import DateRangePicker from 'components/DateRangePicker'
import { getLocalisedRegionName } from 'utils/i18nCountries'

const cleanedUpData = (values) => {
  const { since, until, probe_cc } = values
  return {
    since,
    until,
    probe_cc:
      probe_cc.length > 0 ? probe_cc.map((d) => d.value).join(',') : undefined,
  }
}

export const Form = ({
  countries = [],
  selectedCountries = ['CN', 'IR', 'RU'],
  domains,
  apps,
  setFilters,
  // setApps,
}) => {
  const intl = useIntl()
  const router = useRouter()
  const { query } = router

  const domainOptions = useMemo(() => {
    return domains.map((d) => ({ label: d, value: d }))
  }, [domains])

  const appOptions = useMemo(() => {
    return apps?.map((a) => ({ label: a, value: a }))
  }, [apps])

  // initial placement of query params when they are not defined
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    console.log('query---', query)
    const tomorrow = dayjs.utc().add(1, 'day').format('YYYY-MM-DD')
    const monthAgo = dayjs.utc().subtract(30, 'day').format('YYYY-MM-DD')
    const probe_cc = selectedCountries.join(',')
    const href = {
      query: {
        since: monthAgo,
        until: tomorrow,
        probe_cc,
        ...query, // override default query params
      },
    }
    router.replace(href, undefined, { shallow: true })
  }, [])

  console.log('query', query)

  // Sync page URL params with changes from form values
  const onChange = useCallback(
    ({ since, until, probe_cc }) => {
      // since: "2022-01-02",
      // until: "2022-02-01",
      // probe_cc: "IT,AL,IR"
      const params = {
        since,
        until,
      }
      if (probe_cc) {
        params.probe_cc = probe_cc
      }
      if (
        query.since !== since ||
        query.until !== until ||
        query.probe_cc !== probe_cc
      ) {
        router.push({ query: params }, undefined, { shallow: true })
      }
    },
    [router, query],
  )

  const countryOptions = useMemo(
    () =>
      countries
        .map((cc) => ({
          label: getLocalisedRegionName(cc.alpha_2, intl.locale),
          value: cc.alpha_2,
        }))
        .sort((a, b) =>
          new Intl.Collator(intl.locale).compare(a.label, b.label),
        ),
    [countries, intl],
  )

  const query2formValues = useMemo(() => {
    const countriesInQuery = query?.probe_cc?.split(',') ?? ''
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
    }),
    [intl],
  )

  const { control, getValues, watch, setValue, reset } = useForm({
    defaultValues: query2formValues,
  })

  useEffect(() => {
    reset(query2formValues)
  }, [query2formValues, reset])

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const subscription = watch((_, { name, type }) => {
      if (name === 'probe_cc' && type === 'change')
        onChange(cleanedUpData(getValues()))
      if (name === 'domains' && type === 'change')
        getValues('domains').length
          ? setFilters(getValues('domains').map((d) => d.value))
          : setFilters([])
    })
    return () => subscription.unsubscribe()
  }, [watch, getValues, onChange])

  return (
    <form>
      <div className="grid md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr] gap-4">
        <div>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="since"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
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
                  label={intl.formatMessage({ id: 'Search.Sidebar.Until' })}
                  {...field}
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
        <Controller
          render={({ field }) => (
            <MultiSelect
              label={intl.formatMessage({ id: 'Search.Sidebar.Country' })}
              options={countryOptions}
              overrideStrings={multiSelectStrings}
              isClearable={false}
              {...field}
            />
          )}
          name="probe_cc"
          control={control}
        />
        {domains && (
          <Controller
            render={({ field }) => (
              <MultiSelect
                label={apps.length ? 'Websites & Tools' : 'Websites'}
                options={
                  apps.length
                    ? [
                        { label: 'Tools', options: appOptions },
                        { label: 'Websites', options: domainOptions },
                      ]
                    : domainOptions
                }
                overrideStrings={multiSelectStrings}
                {...field}
              />
            )}
            name="domains"
            control={control}
          />
        )}
      </div>
    </form>
  )
}
