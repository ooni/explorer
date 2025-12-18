import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import AlertList from 'components/alerts/list'
import AlertCharts from 'components/chart/AlertChart'

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
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: baseDefaults,
  })

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
      <h1>Alerts</h1>
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="flex flex-col">
          <span>Country</span>
          <input
            className="rounded border border-gray-300 p-2"
            type="text"
            {...register('probe_cc', { required: 'Probe CC is required' })}
          />
          {errors.probe_cc && (
            <span className="text-sm text-red-600">
              {errors.probe_cc.message}
            </span>
          )}
        </label>

        <label className="flex flex-col">
          <span>ASN</span>
          <input
            className="rounded border border-gray-300 p-2"
            type="text"
            {...register('probe_asn', { required: 'Probe ASN is required' })}
          />
          {errors.probe_asn && (
            <span className="text-sm text-red-600">
              {errors.probe_asn.message}
            </span>
          )}
        </label>

        <label className="flex flex-col">
          <span>Domain</span>
          <input
            className="rounded border border-gray-300 p-2"
            type="text"
            {...register('domain', { required: 'Domain is required' })}
          />
          {errors.domain && (
            <span className="text-sm text-red-600">
              {errors.domain.message}
            </span>
          )}
        </label>

        <label className="flex flex-col">
          <span>Since</span>
          <input
            className="rounded border border-gray-300 p-2"
            type="date"
            {...register('since', { required: 'Since date is required' })}
          />
          {errors.since && (
            <span className="text-sm text-red-600">{errors.since.message}</span>
          )}
        </label>

        <label className="flex flex-col">
          <span>Until</span>
          <input
            className="rounded border border-gray-300 p-2"
            type="date"
            {...register('until', { required: 'Until date is required' })}
          />
          {errors.until && (
            <span className="text-sm text-red-600">{errors.until.message}</span>
          )}
        </label>

        <div className="flex items-end">
          <button
            className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            type="submit"
          >
            Fetch alerts
          </button>
        </div>
      </form>

      {query && (
        <div className="space-y-6">
          {(isLoading || isAnalysisLoading) && <p>Loading data…</p>}
          {error && <p className="text-red-600">{error.message}</p>}
          {analysisError && (
            <p className="text-red-600">{analysisError.message}</p>
          )}
          {changepointResults.length > 0 && (
            <AlertList changepoints={changepointResults} />
          )}
          {analysis && (
            <>
              {/* {analysis.results.map((analysisResult) => ( */}
              <AlertCharts
                // key={analysisResult.measurement_start_day}
                analysis={analysis.results}
                changepoints={changepointResults}
              />
              {/* ))} */}
              {/* <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-sm">
                {JSON.stringify(analysis, null, 2)}
              </pre> */}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Alert
