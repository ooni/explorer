import { format } from 'date-fns'
import { Input, Select } from 'ooni-components'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import DateRangePicker from 'components/DateRangePicker'
import countries from 'data/countries.json'
import dayjs from 'services/dayjs'
import { getLocalisedRegionName } from 'utils/i18nCountries'

const tomorrowUTC = dayjs.utc().add(1, 'day').format('YYYY-MM-DD')
const monthAgoUTC = dayjs.utc().subtract(1, 'month').format('YYYY-MM-DD')

const asnRegEx = /^(AS)?([1-9][0-9]*)$/

const AlertsForm = () => {
  const intl = useIntl()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const router = useRouter()
  const { since, until, probe_cc, probe_asn, domain } = router.query

  // Set default since/until in the URL if not present
  // biome-ignore lint/correctness/useExhaustiveDependencies: only run once when router is ready
  useEffect(() => {
    if (router.isReady && (!since || !until)) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            since: since || monthAgoUTC,
            until: until || tomorrowUTC,
          },
        },
        undefined,
        { shallow: true },
      )
    }
  }, [router.isReady])

  const onSubmit = (data) => {
    const query = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v && v !== 'XX'),
    )
    router.push({
      pathname: router.pathname,
      query,
    })
  }

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      since: since || monthAgoUTC,
      until: until || tomorrowUTC,
      probe_cc: probe_cc || 'XX',
      probe_asn: probe_asn || '',
      domain: domain || '',
    },
  })

  const handleRangeSelect = useCallback(
    (range) => {
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
    },
    [setValue],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: locale change triggers re-sort
  const countryOptions = useMemo(() => {
    const options = countries.map((c) => ({
      ...c,
      name: getLocalisedRegionName(c.alpha_2, intl.locale),
    }))
    options.sort((a, b) => a.name.localeCompare(b.name))
    options.unshift({
      name: intl.formatMessage({ id: 'Search.Sidebar.Country.AllCountries' }),
      alpha_2: 'XX',
    })
    return options
  }, [intl.locale])

  return (
    <form
      className="flex flex-col md:flex-row flex-wrap gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="relative">
        <div className="flex gap-4">
          <Controller
            control={control}
            name="since"
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
            control={control}
            name="until"
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
        control={control}
        name="probe_cc"
        render={({ field }) => (
          <Select
            {...field}
            label={intl.formatMessage({ id: 'Search.Sidebar.Country' })}
          >
            {countryOptions.map((v) => (
              <option key={v.alpha_2} value={v.alpha_2}>
                {v.name}
              </option>
            ))}
          </Select>
        )}
      />

      <Controller
        control={control}
        name="probe_asn"
        rules={{
          pattern: {
            value: asnRegEx,
            message: intl.formatMessage({ id: 'Search.Sidebar.ASN.Error' }),
          },
        }}
        render={({ field }) => (
          <Input
            {...field}
            label={intl.formatMessage({ id: 'Search.Sidebar.ASN' })}
            placeholder={intl.formatMessage({
              id: 'Search.Sidebar.ASN.example',
            })}
            error={errors?.probe_asn?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="domain"
        render={({ field }) => (
          <Input
            {...field}
            label={intl.formatMessage({ id: 'Search.Sidebar.Domain' })}
            placeholder="e.g. example.com"
          />
        )}
      />

      <div className="flex items-end">
        <button className="btn btn-primary" type="submit">
          {intl.formatMessage({ id: 'General.Apply' })}
        </button>
      </div>
    </form>
  )
}

export default AlertsForm
