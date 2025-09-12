import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import dayjs from 'services/dayjs'

import dynamic from 'next/dynamic'
import { sortByKey } from '../utils'
import FormattedMarkdown from '/components/FormattedMarkdown'
import FilterSidebar, {
  queryToFilterMap,
} from '/components/search/FilterSidebar'
import ResultsList from '/components/search/ResultsList'

const Loader = dynamic(() => import('/components/search/Loader'), {
  ssr: false,
})

export const getServerSideProps = async ({ query }) => {
  // By default, on '/search' show measurements published until today
  // including the measurements of today (so the date of tomorrow).
  // This prevents the search page from showing time-travelling future
  // measurements from showing up
  query.since =
    query.since ||
    dayjs(query.until).utc().subtract(30, 'day').format('YYYY-MM-DD')
  query.until = query.until || dayjs.utc().add(1, 'day').format('YYYY-MM-DD')

  // If there is no 'failure' in query, default to a false
  if ('failure' in query === false) {
    query.failure = false
  } else {
    // Convert the string param into boolean
    query.failure = !(query.failure === 'false')
  }

  const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
  const countriesR = await client.get('/api/_/countries')

  const countries = countriesR.data.countries
  countries.sort(sortByKey('name'))

  return {
    props: {
      countries,
      query,
    },
  }
}

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

  if (query.show) {
    show = Number.parseInt(query.show)
  }
  params.limit = show

  // Allow only `failure=false`. `true` results in showing only failures
  if ('failure' in query && query.failure === false) {
    params.failure = false
  }

  for (const p of supportedParams) {
    if (p in query && query[p] !== queryToFilterMap[p][1]) {
      params[p] = query[p]
    }
  }
  if (query.only) {
    if (query.only === 'anomalies') {
      params.anomaly = true
    } else if (query.only === 'confirmed') {
      params.confirmed = true
    }
  }
  return params
}

const getMeasurements = (query) => {
  const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
  const params = queryToParams({ query })
  return client.get('/api/v1/measurements', {
    params: { ...params, order: 'desc' },
  })
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

const Search = ({ countries, query: queryProp }) => {
  const router = useRouter()
  const intl = useIntl()
  const { query, replace } = router
  const [nextURL, setNextURL] = useState(null)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = Object.keys(query).length > 0 ? query : queryProp
    const href = {
      pathname: '/search',
      query: q,
    }
    replace(href, href, { shallow: true })

    getMeasurements(q)
      .then(
        ({
          data: {
            results,
            metadata: { next_url },
          },
        }) => {
          setLoading(false)
          setResults(results)
          setNextURL(next_url)
        },
      )
      .catch((err) => {
        console.error(err)
        const error = serializeError(err)
        setLoading(false)
        setError(error)
      })
  }, [])

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
          setResults(results.concat(nextPageResults))
          setNextURL(next_url)
        },
      )
      .catch((err) => {
        console.error(err)
        const error = serializeError(err)
        setLoading(false)
        setError(error)
      })
  }

  const onApplyFilter = (state) => {
    setLoading(true)
    setResults([])
    setError(null)

    const query = getFilterQuery(state)
    const href = {
      pathname: '/search',
      query,
    }
    router.push(href, href, { shallow: true }).then(() => {
      getMeasurements(query)
        .then(
          ({
            data: {
              results,
              metadata: { next_url },
            },
          }) => {
            setLoading(false)
            setResults(results)
            setNextURL(next_url)
          },
        )
        .catch((err) => {
          console.error(err)
          const error = serializeError(err)
          setError(error)
          setLoading(false)
        })
    })
  }

  const getFilterQuery = (state) => {
    const query = { ...router.query }
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

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'Search.PageTitle' })}</title>
      </Head>
      <div className="container">
        <div className="flex pt-4 flex-wrap">
          <div className="w-full md:w-1/4 px-2">
            <FilterSidebar
              domainFilter={query.domain}
              inputFilter={query.input}
              ooniRunLinkId={query.ooni_run_link_id}
              categoryFilter={query.category_code}
              testNameFilter={query.test_name}
              countryFilter={query.probe_cc}
              asnFilter={query.probe_asn}
              sinceFilter={queryProp.since}
              untilFilter={queryProp.until}
              onlyFilter={query.only || 'all'}
              hideFailed={!query.failure}
              onApplyFilter={onApplyFilter}
              countries={countries}
            />
          </div>
          <div className="w-full md:w-3/4 px-2">
            {error && <ErrorBox error={error} />}
            {loading && (
              <div className="my-8">
                <Loader />
              </div>
            )}
            {!error && !loading && results.length === 0 && <NoResults />}
            {!error && !loading && results.length > 0 && (
              <>
                <div className="my-8">
                  <ResultsList results={results} />
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

Search.propTypes = {
  countries: PropTypes.array,
  query: PropTypes.object,
}

export default Search
