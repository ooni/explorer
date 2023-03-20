import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from 'axios'
import styled from 'styled-components'
import {
  Flex, Box,
  Container,
  Button,
  Heading,
  Text
} from 'ooni-components'
import { FormattedMessage, useIntl } from 'react-intl'
import dayjs from 'services/dayjs'

import NavBar from '../components/NavBar'

import ResultsList from '../components/search/ResultsList'
import FilterSidebar, { queryToFilterMap } from '../components/search/FilterSidebar'
import { Loader } from '../components/search/Loader'
import FormattedMarkdown from '../components/FormattedMarkdown'

import { sortByKey } from '../utils'

export const getServerSideProps = async ({query}) => {
  // By default, on '/search' show measurements published until today
  // including the measurements of today (so the date of tomorrow).
  // This prevents the search page from showing time-travelling future
  // measurements from showing up
  query.since = query.since || dayjs(query.until).utc().subtract(30, 'day').format('YYYY-MM-DD')
  query.until = query.until || dayjs.utc().add(1, 'day').format('YYYY-MM-DD')

  // If there is no 'failure' in query, default to a false
  if ('failure' in query === false) {
    query.failure = false
  } else {
    // Convert the string param into boolean
    query.failure = !(query.failure === 'false')
  }

  const client = axios.create({baseURL: process.env.NEXT_PUBLIC_OONI_API})
  const countriesR = await client.get('/api/_/countries')

  const countries = countriesR.data.countries
  countries.sort(sortByKey('name'))

  return {
    props: {
      countries,
      query,
    }
  }
}


const queryToParams = ({ query }) => {
  let params = {},
    show = 50
  const supportedParams = ['probe_cc', 'domain', 'input','category_code', 'probe_asn', 'test_name', 'since', 'until', 'failure']

  if (query.show) {
    show = parseInt(query.show)
  }
  params['limit'] = show

  // Allow only `failure=false`. `true` results in showing only failures
  if ('failure' in query && query['failure'] === false) {
    params['failure'] = false
  }

  for (const p of supportedParams) {
    if (p in query &&  query[p] !== queryToFilterMap[p][1]) {
      params[p] = query[p]
    }
  }
  if (query.only) {
    if (query.only === 'anomalies') {
      params['anomaly'] = true
    } else if (query.only === 'confirmed') {
      params['confirmed'] = true
    }
  }
  return params
}

const getMeasurements = (query) => {
  let client = axios.create({baseURL: process.env.NEXT_PUBLIC_OONI_API})  // eslint-disable-line
  const params = queryToParams({ query })
  return client.get('/api/v1/measurements', {params})
}

const serializeError = (err) => {
  const { name, message, stack, config = {} } = err.toJSON()
  const { baseURL, url, params } = config
  const { data, status, statusText } = err.response ?? {}
  return {
    name,
    message,
    data, status, statusText,
    baseURL, url, params,
    stack
  }
}

const StyledPre = styled.pre`
  white-space: pre-wrap;       /* css-3 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
`

const ErrorBox = ({ error }) => {
  if (!error) {
    return <div></div>
  }

  const { stack, ...restOfError } = error

  return (
    <Box width={[1, 2/3]} mx='auto'>
      <Flex justifyContent='center' flexDirection='column'>
        <Text my={4}>
          <FormattedMarkdown id='Search.Error.Message' />
        </Text>
        <Heading h={5}>
          <FormattedMessage id='Search.Error.Details.Label' />
        </Heading>
        <Box p={[1, 3]} bg='gray3' my={[1, 2]}>
          <StyledPre>
            {JSON.stringify(restOfError, null, '  ')}
          </StyledPre>
        </Box>
        <Box p={[1, 3]} bg='gray3' my={[1, 2]}>
          <StyledPre>
            {stack}
          </StyledPre>
        </Box>
      </Flex>
    </Box>
  )
}

ErrorBox.propTypes = {
  error: PropTypes.object.isRequired
}

const NoResults = () => (
  <Flex alignItems='center' px={[2, 6]} py={6} justifyContent='center' flexWrap='wrap' flexDirection='column'>
    <Heading h={2} color='blue5'>
      <FormattedMessage id='Search.Results.Empty.Heading' />
    </Heading>
    <Heading h={5} textAlign='center'>
      <FormattedMessage id='Search.Results.Empty.Description' />
    </Heading>
  </Flex>
)

const Search = ({countries, query: queryProp }) => {
  const router = useRouter()
  const intl = useIntl()
  const { query, replace, isReady } = router

  const [nextURL, setNextURL] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [filters, setFilters] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    const query = query || queryProp
    const href = {
      pathname: '/search',
      query: query
    }
    replace(href, href, { shallow: true })

    setLoading(true)
    getMeasurements(query)
      .then(({ data: { results, metadata: { next_url } } }) => {
        setLoading(false)
        setResults(results)
        setNextURL(next_url)
      })
      .catch((err) => {
        console.error(err)
        const error = serializeError(err)
        setLoading(false)
        setError(error)
      })
  }, [])

  const loadMore = () => {
    axios.get(nextURL)
      .then(({ data: { results:  nextPageResults, metadata: { next_url } } }) => {
        setResults(results.concat(nextPageResults))
        setNextURL(next_url)
      })
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
      query
    }
    router.push(href, href, { shallow: true }).then(() => {
      getMeasurements(query)
        .then(({ data: { results, metadata: { next_url } } }) => {
          setLoading(false)
          setResults(results)
          setNextURL(next_url)
        })
        .catch((err) => {
          console.error(err)
          const error = serializeError(err)
          setError(error)
          setLoading(false)
        })
      })
  }

  const getFilterQuery = (state) => {
    let query = {...router.query}
    const resetValues = [undefined, 'XX', '']
    for (const [queryParam, [key]] of Object.entries(queryToFilterMap)) {
      // If it's unset or marked as XX, let's be sure the path is clean
      if (resetValues.includes(state[key])) {
        if (queryParam in query) {
          delete query[queryParam]
        }
      } else if (key === 'onlyFilter' && state[key] == 'all') {
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
        <title>{intl.formatMessage({id: 'Search.PageTitle'})}</title>
      </Head>

      <NavBar />

      <Container>
        <Flex pt={3} flexWrap='wrap'>
          <Box width={[1, 1/4]} px={2}>
            <FilterSidebar
              domainFilter={query.domain}
              inputFilter={query.input}
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
          </Box>
          <Box width={[1, 3/4]} px={2}>
            {error && <ErrorBox error={error} />}
            {loading && <Loader />}

            {!error && !loading && results.length === 0 && <NoResults />}
            {!error && !loading && results.length > 0 && <>
              <ResultsList results={results} />
              {nextURL &&
                <Flex alignItems='center' justifyContent='center'>
                  <Button onClick={loadMore} data-test-id='load-more-button'>
                    <FormattedMessage id='Search.Button.LoadMore' />
                  </Button>
                </Flex>
              }
            </>}
          </Box>
        </Flex>
      </Container>
    </>
  )
}

Search.propTypes = {
  countries: PropTypes.array,
  query: PropTypes.object,
}

export default Search
