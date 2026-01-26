import { format } from 'date-fns'
import { Input, Select } from 'ooni-components'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'

import { useRouter } from 'next/router'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import DateRangePicker from '../DateRangePicker'
import countries from 'data/countries.json'

const availableCountries = countries.map((c) => c.alpha_2)

const Form = () => {
  const initialLoad = useRef(false)
  const router = useRouter()
  const { query } = router

  const intl = useIntl()
  const countriesList = useMemo(
    () =>
      availableCountries
        .map((c) => ({
          name: getLocalisedRegionName(c, intl.locale),
          value: c,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [intl.locale],
  )

  const { since, until, probe_cc } = useMemo(() => {
    const today = dayjs.utc().add(1, 'day')
    const monthAgo = dayjs.utc(today).subtract(1, 'month')

    return {
      since: dayjs(query.since, 'YYYY-MM-DD', true).isValid()
        ? query.since
        : monthAgo.format('YYYY-MM-DD'),
      until: dayjs(query.until, 'YYYY-MM-DD', true).isValid()
        ? query.until
        : today.format('YYYY-MM-DD'),
      probe_cc: query.probe_cc || '',
    }
  }, [query])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      query.since !== since ||
      query.until !== until ||
      query.probe_cc !== probe_cc
    ) {
      const href = {
        pathname: router.pathname,
        query: {
          since,
          until,
          ...(query.domain && { domain: query.domain }),
          ...(query.probe_asn && { probe_asn: query.probe_asn }),
        },
      }
      router.replace(href, undefined, { shallow: true })
    }
  }, [])

  // Sync page URL params with changes from form values
  const onSubmit = ({ since, until, probe_cc }) => {
    const params = {
      since,
      until,
      probe_cc,
    }
    const [replaceKey, replaceValue] = query.domain
      ? ['[domain]', query.domain]
      : ['[probe_asn]', query.probe_asn]
    const href = {
      pathname: router.pathname.replace(replaceKey, replaceValue),
      query: params,
    }

    if (
      query.since !== since ||
      query.until !== until ||
      query.probe_cc !== probe_cc
    ) {
      router.push(href, href, { shallow: true })
    }
  }

  const { control, getValues, watch, setValue, reset } = useForm({
    defaultValues: { since, until, probe_cc },
  })

  const {
    since: updatedSince,
    until: updatedUntil,
    probe_cc: updatedProbeCC,
  } = watch()

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // trigger submit only when the dates are valid
    if (
      initialLoad.current &&
      dayjs(updatedSince, 'YYYY-MM-DD', true).isValid() &&
      dayjs(updatedUntil, 'YYYY-MM-DD', true).isValid()
    ) {
      onSubmit({
        since: updatedSince,
        until: updatedUntil,
        ...{ probe_cc: updatedProbeCC },
      })
    } else {
      initialLoad.current = true
    }
  }, [updatedSince, updatedUntil, updatedProbeCC])

  return (
    <form>
      <div className="flex items-center flex-wrap">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <div className="flex">
            <div className="w-2/3 mr-4">
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
            </div>
            <div className="w-2/3 mr-3">
              <Controller
                name="until"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={intl.formatMessage({ id: 'Search.Sidebar.Until' })}
                    onFocus={() => setShowDatePicker(true)}
                    onKeyDown={() => setShowDatePicker(false)}
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
        <div className="w-full md:w-1/3 lg:1/3 z-[2]">
          <Controller
            control={control}
            name="probe_cc"
            render={({ field }) => (
              <Select
                {...field}
                pt={2}
                label={intl.formatMessage({ id: 'Search.Sidebar.Country' })}
                data-testid="country-filter"
              >
                <option key="empty" value="">
                  {intl.formatMessage({ id: 'MAT.Form.AllCountries' })}
                </option>
                {countriesList.map(({ value, name }, i) => {
                  return (
                    <option key={value} value={value}>
                      {name}
                    </option>
                  )
                })}
              </Select>
            )}
          />
        </div>
      </div>
    </form>
  )
}

export default Form
