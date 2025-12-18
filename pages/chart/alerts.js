import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { Input, Select } from 'ooni-components'
import AlertList from 'components/alerts/list'
import AlertCharts from 'components/chart/AlertChart'
import { ChartSpinLoader } from 'components/Chart'
import SpinLoader from 'components/vendor/SpinLoader'
import countries from 'data/countries.json'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import MATChart from 'components/MATChart'

const ALERTS_ENDPOINT =
  'https://oonimeasurements.dev.ooni.io/api/v1/detector/changepoints'
const ANALYSIS_ENDPOINT = 'https://api.ooni.org/api/v1/aggregation/analysis'

const fetcher = async (url) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

const Alert = () => {
  const router = useRouter()
  const defaultUntil = new Date().toISOString().slice(0, 10)
  const intl = useIntl()
  const baseDefaults = useMemo(
    () => ({
      probe_asn: '',
      probe_cc: '',
      domain: '',
      since: '2012-01-01',
      until: defaultUntil,
    }),
    [defaultUntil],
  )

  const [query, setQuery] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: baseDefaults,
  })

  const countryOptions = useMemo(() => {
    const locale = intl.locale
    const options = [
      ...countries.map((c) => ({
        ...c,
        name: getLocalisedRegionName(c.alpha_2, locale),
      })),
    ]

    options.sort((a, b) => a.name.localeCompare(b.name))

    return options
  }, [intl])

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const queryFields = ['probe_asn', 'probe_cc', 'domain', 'since', 'until']

    const queryFromRouter = queryFields.reduce((acc, field) => {
      const value = router.query[field]
      if (Array.isArray(value) && value.length > 0) {
        acc[field] = value[0]
      } else if (typeof value === 'string' && value.trim().length > 0) {
        acc[field] = value
      }
      return acc
    }, {})

    const hasQueryParams = Object.keys(queryFromRouter).length > 0

    if (hasQueryParams) {
      const nextValues = {
        ...baseDefaults,
        ...queryFromRouter,
      }
      reset(nextValues)
      const nextValuesString = JSON.stringify(nextValues)
      setQuery((prev) => {
        const prevString = prev ? JSON.stringify(prev) : null
        if (prevString === nextValuesString) {
          return prev
        }
        return nextValues
      })
    }
  }, [baseDefaults, reset, router.isReady, router.query])

  const searchParams = useMemo(() => {
    if (!query) {
      return null
    }

    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      params.append(key, value)
    }

    return params.toString()
  }, [query])

  const changepointsUrl = useMemo(() => {
    if (!searchParams) {
      return null
    }

    return `${ALERTS_ENDPOINT}?${searchParams}`
  }, [searchParams])

  const analysisUrl = useMemo(() => {
    if (!query) {
      return null
    }

    const params = new URLSearchParams({
      ...query,
      axis_x: 'measurement_start_day',
      // test_name: 'web_connectivity',
      time_grain: 'hour',
    })

    return `${ANALYSIS_ENDPOINT}?${params.toString()}`
  }, [query])

  const {
    data: changepoints,
    error,
    isLoading,
  } = useSWR(changepointsUrl, fetcher, {
    revalidateOnFocus: false,
  })

  const {
    data: analysis,
    error: analysisError,
    isLoading: isAnalysisLoading,
  } = useSWR(analysisUrl, fetcher, {
    revalidateOnFocus: false,
  })

  const onSubmit = (values) => {
    setQuery(values)
    router.replace(
      {
        pathname: router.pathname,
        query: values,
      },
      undefined,
      { shallow: true },
    )
  }

  const changepointResults = changepoints?.results ?? []

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="my-8">Alerts</h1>
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="probe_cc"
          rules={{ required: 'Probe CC is required' }}
          render={({ field }) => (
            <Select {...field} label="Country" error={errors.probe_cc?.message}>
              {countryOptions.map((v) => {
                return (
                  <option key={v.alpha_2} value={v.alpha_2}>
                    {v.name}
                  </option>
                )
              })}
            </Select>
          )}
        />

        <Controller
          control={control}
          name="probe_asn"
          rules={{ required: 'Probe ASN is required' }}
          render={({ field }) => (
            <Input {...field} label="ASN" error={errors.probe_asn?.message} />
          )}
        />

        <Controller
          control={control}
          name="domain"
          rules={{ required: 'Domain is required' }}
          render={({ field }) => (
            <Input {...field} label="Domain" error={errors.domain?.message} />
          )}
        />

        <Controller
          control={control}
          name="since"
          rules={{ required: 'Since date is required' }}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Since"
              error={errors.since?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="until"
          rules={{ required: 'Until date is required' }}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Until"
              error={errors.until?.message}
            />
          )}
        />

        <div className="flex items-end">
          <button className="btn btn-primary w-full" type="submit">
            Fetch alerts
          </button>
        </div>
      </form>

      {query && (
        <div className="space-y-6">
          {isLoading && (
            <div className="container pt-32 flex justify-center items-center">
              <SpinLoader />
            </div>
          )}
          {error && <p className="text-red-600">{error.message}</p>}
          {analysisError && (
            <p className="text-red-600">{analysisError.message}</p>
          )}
          {changepointResults.length > 0 && (
            <AlertList changepoints={changepointResults} />
          )}
          {isAnalysisLoading ? (
            <ChartSpinLoader height="500px" />
          ) : (
            analysis && (
              <>
                <AlertCharts
                  analysis={analysis.results}
                  changepoints={changepointResults}
                />
                {/* <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-sm">
                  {JSON.stringify(analysis, null, 2)}
                </pre> */}
              </>
            )
          )}
          <MATChart
            query={{
              axis_x: 'measurement_start_day',
              time_grain: 'hour',
              data: 'analysis',
              ...query,
            }}
          />
          <MATChart
            query={{
              axis_x: 'measurement_start_day',
              time_grain: 'day',
              ...query,
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Alert
