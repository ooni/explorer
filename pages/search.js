import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWR from 'swr'
import dayjs from 'services/dayjs'
import dynamic from 'next/dynamic'

import FormattedMarkdown from '/components/FormattedMarkdown'
import FilterSidebar, {
  queryToFilterMap,
} from '/components/search/FilterSidebar'
import ResultsList from '/components/search/ResultsList'

const Loader = dynamic(() => import('/components/search/Loader'), {
  ssr: false,
})

const queryToParams = ({ query }) => {
  const params = {}
  let show = 50
  const supportedParams = [
    'probe_cc',
    'domain',
    'input',
    'category_code',
    'probe_asn',
    'test_name',
    'since',
    'until',
    'failure',
    'ooni_run_link_id',
  ]

  for (const p of supportedParams) {
    if (p in query && query[p] !== queryToFilterMap[p][1]) {
      params[p] = query[p]
    }
  }

  if (query.show) {
    show = Number.parseInt(query.show)
  }

  params.limit = show

  if (query.only) {
    if (query.only === 'anomalies') {
      params.anomaly = true
    } else if (query.only === 'confirmed') {
      params.confirmed = true
    }
  }

  // Allow only `failure=false`. `true` results in showing only failures
  if ('failure' in query) {
    if (query.failure === false) {
      params.failure = false
    } else {
      params.failure = null
    }
  }

  return params
}

const measurementsFetcher = async (queryParams) => {
  const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
  const params = queryToParams({ query: queryParams })
  const response = await client.get('/api/v1/measurements', {
    params: { ...params, order: 'desc' },
  })
  return {
    results: response.data.results,
    next_url: response.data.metadata?.next_url,
  }
}

const serializeError = (err) => {
  const { name, message, stack, config = {} } = err.toJSON()
  const { baseURL, url, params } = config
  const { data, status, statusText } = err.response ?? {}
  return {
    name,
    message,
    data,
    status,
    statusText,
    baseURL,
    url,
    params,
    stack,
  }
}

const ErrorBox = ({ error }) => {
  if (!error) {
    return <div />
  }

  const { stack, ...restOfError } = error

  return (
    <div className="w-full md:w-2/3 mx-auto">
      <div className="flex justify-center flex-col">
        <div className="my-8">
          <FormattedMarkdown id="Search.Error.Message" />
        </div>
        <h5>
          <FormattedMessage id="Search.Error.Details.Label" />
        </h5>
        <div className="p-1 md:p-4 border-y-gray-300 my-1 md:my-2">
          <pre className="break-words whitespace-pre-wrap">
            {JSON.stringify(restOfError, null, '  ')}
          </pre>
        </div>
        <div className="p-1 md:p-4 border-y-gray-300 my-1 md:my-2">
          <pre className="break-words whitespace-pre-wrap">{stack}</pre>
        </div>
      </div>
    </div>
  )
}

ErrorBox.propTypes = {
  error: PropTypes.object.isRequired,
}

const NoResults = () => (
  <div className="flex items-center px-2 md:px-32 py-6 justify-center flex-wrap flex-col">
    <h2 className="text-blue-500">
      <FormattedMessage id="Search.Results.Empty.Heading" />
    </h2>
    <h5 className="text-center">
      <FormattedMessage id="Search.Results.Empty.Description" />
    </h5>
  </div>
)

const requiredParams = ['since', 'until']

const Search = () => {
  const router = useRouter()
  const intl = useIntl()
  const { query, replace } = router

  const [nextURL, setNextURL] = useState(null)
  const [accumulatedResults, setAccumulatedResults] = useState([])
  const prevQueryRef = useRef('{}')

  useEffect(() => {
    if (
      router.isReady &&
      !requiredParams.every((key) => Object.keys(query).includes(key))
    ) {
      const queryParams = {
        since: dayjs.utc().subtract(30, 'day').format('YYYY-MM-DD'),
        until: dayjs.utc().add(1, 'day').format('YYYY-MM-DD'),
        failure: false,
        ...query,
      }
      const href = {
        pathname: '/search',
        query: queryParams,
      }
      replace(href, undefined, { shallow: true })
    }
  }, [router.isReady])

  const {
    data: searchData,
    error: swrError,
    isLoading,
  } = useSWR(
    Object.keys(query).length > 0 ? query : null,
    measurementsFetcher,
    {
      revalidateOnFocus: false,
    },
  )

  // Reset accumulated results when query changes
  const queryKey = JSON.stringify(query)
  useEffect(() => {
    if (prevQueryRef.current !== '{}' && prevQueryRef.current !== queryKey) {
      setAccumulatedResults([])
      setNextURL(null)
    }
    prevQueryRef.current = queryKey
  }, [queryKey])

  // Update accumulated results when search data changes
  useEffect(() => {
    if (searchData) {
      setAccumulatedResults(searchData.results)
      setNextURL(searchData.next_url)
    }
  }, [searchData])

  const error = swrError
    ? serializeError(
        swrError.isAxiosError
          ? swrError
          : Object.assign(new Error(swrError.message), {
              toJSON: () => ({
                name: swrError.name || 'Error',
                message: swrError.message,
                stack: swrError.stack,
                config: {},
              }),
              response: swrError.response,
            }),
      )
    : null

  const loadMore = () => {
    axios
      .get(nextURL)
      .then(
        ({
          data: {
            results: nextPageResults,
            metadata: { next_url },
          },
        }) => {
          setAccumulatedResults((prev) => prev.concat(nextPageResults))
          setNextURL(next_url)
        },
      )
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'Search.PageTitle' })}</title>
      </Head>
      <div className="container">
        <div className="flex pt-4 flex-wrap">
          <div className="w-full md:w-1/4 px-2">
            <FilterSidebar />
          </div>
          <div className="w-full md:w-3/4 px-2">
            {error && <ErrorBox error={error} />}
            {isLoading && (
              <div className="my-8">
                <Loader />
              </div>
            )}
            {!error && !isLoading && accumulatedResults.length === 0 && (
              <NoResults />
            )}
            {!error && !isLoading && accumulatedResults.length > 0 && (
              <>
                <div className="my-8">
                  <ResultsList results={accumulatedResults} />
                </div>
                {nextURL && (
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={loadMore}
                      data-test-id="load-more-button"
                    >
                      <FormattedMessage id="Search.Button.LoadMore" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Search
