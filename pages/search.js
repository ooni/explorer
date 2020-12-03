/* global process */
import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { useRouter } from 'next/router'
import moment from 'moment'
import axios from 'axios'
import useSWR from 'swr'
import styled from 'styled-components'
import {
  Flex, Box,
  Container,
  Button,
  Heading,
  Text
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import NavBar from '../components/NavBar'
import Layout from '../components/Layout'

import ResultsList from '../components/search/ResultsList'
import FilterSidebar from '../components/search/FilterSidebar'
import { Loader } from '../components/search/Loader'
import FormattedMarkdown from '../components/FormattedMarkdown'

import { sortByKey } from '../utils'

const queryToParams = ({ query }) => {
  // XXX do better validation
  let params = {},
    show = 50
  const supportedParams = ['probe_cc', 'domain', 'probe_asn', 'test_name', 'since', 'until']
  if (query.show) {
    show = parseInt(query.show)
  }
  supportedParams.forEach((p) => {
    if (query[p]) {
      params[p] = query[p]
    }
  })
  params['limit'] = show
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
  let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})  // eslint-disable-line
  const params = queryToParams({ query })
  return client.get('/api/v1/measurements', {params})
}

// Handle circular structures when stringifying error responses
// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#Examples
const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }
    return value
  }
}

const formatError = (error) => {
  let errorString = ''
  if (error.code) {
    errorString += `Error code: ${error.code}`
  }
  if (error.errno) {
    errorString += ` (${error.errno})`
  }
  if (errorString === '') {
    errorString = JSON.stringify(error, getCircularReplacer())
  }
  return errorString
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

  return (
    <Box width={[1, 2/3]} mx='auto'>
      <Flex justifyContent='center' flexDirection='column'>
        <Text my={4}>
          <FormattedMarkdown id='Search.Error.Message' />
        </Text>
        <Heading h={5}>
          <FormattedMessage id='Search.Error.Details.Label' />
        </Heading>
        <Box p={[1, 3]} bg='gray3'>
          <StyledPre>
            {JSON.stringify(error, null, '  ')}
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

const API_SERVER = process.env.MEASUREMENTS_URL

const fetcher = (url, query) => {
  let params = {}
  if (typeof query === 'object') {
    params = queryToParams({ query })
  }
  return axios.get(API_SERVER + url, { params }).then(res => res.data)
}

export async function getServerSideProps ({ query }) {
  let testNamesR, countriesR

  let client = axios.create({baseURL: process.env.MEASUREMENTS_URL});  // eslint-disable-line

  [testNamesR, countriesR] = await Promise.all([
    client.get('/api/_/test_names'),
    client.get('/api/_/countries')
  ])

  let testNames = testNamesR.data.test_names
  testNames.sort(sortByKey('name'))

  let testNamesKeyed = {}
  testNames.forEach(v => testNamesKeyed[v.id] = v.name)

  let countries = countriesR.data.countries
  countries.sort(sortByKey('name'))

  return {
    props: {
      testNamesKeyed,
      testNames,
      countries
    }
  }
}

const swrOptions = {
  revalidateOnFocus: false,
}

const Search = ({ countries = [], testNames, testNamesKeyed }) => {
  // const [results, setResults] = useState(null)
  // const [error, setError] = useState(null)
  const {
    loading,
    onlyFilter,
    domainFilter,
    testNameFilter,
    countryFilter,
    asnFilter,
    sinceFilter,
    untilFilter
  } = {}

  const [pageCount, setPageCount] = useState(1)
  const pages = []

  const { query } = useRouter()

  // By default, on '/search' show measurements published until today
  // including the measurements of today (so the date of tomorrow).
  // This prevents the search page from showing time-travelling future
  // measurements from showing up
  const until = moment.utc().add(1, 'day').format('YYYY-MM-DD')
  if (!query.until) {
    query.until = until
  }

  const since = moment(query.until).utc().subtract(30, 'day').format('YYYY-MM-DD')
  if (!query.since) {
    query.since = since
  }

  // const { data, error, isValidating } = useSWR(['/api/_/countries'], fetcher, swrOptions)
  const { data, error, isValidating } = useSWR(['/api/v1/measurements', query], fetcher, swrOptions)

  const results = data ? data.results : []
  const nextURL = data && data.metadata && data.metadata.next_url

  const isLoadingInitialData = !results && !error
  const isEmpty = results?.[0]?.length === 0

  const onApplyFilter = useCallback(() => {

  }, [])

  return (
    <Layout>
      <Head>
        <title>Search Measurements - OONI Explorer</title>
      </Head>

      <NavBar />
      <Container>
        <Flex pt={3} flexWrap='wrap'>
          <Box width={[1, 1/4]} px={2}>
            <FilterSidebar
              domainFilter={domainFilter}
              testNameFilter={testNameFilter}
              countryFilter={countryFilter}
              asnFilter={asnFilter}
              sinceFilter={sinceFilter}
              untilFilter={untilFilter}
              onlyFiltwithRouterer={onlyFilter}
              onApplyFilter={onApplyFilter}
              testNames={testNames}
              countries={countries}
            />
          </Box>
          <Box width={[1, 3/4]} px={2}>
            {error && <ErrorBox error={error} />}
            {isValidating && <Loader />}
            {isEmpty && <NoResults />}
            {!isEmpty &&
              <Flex flexDirection='column'>
                <Box>
                  <ResultsList results={results} testNamesKeyed={testNamesKeyed} />
                </Box>
                <Box>
                  {nextURL &&
                    <Flex alignItems='center' justifyContent='center'>
                      <Button onClick={() => {}} data-test-id='load-more-button'>
                        <FormattedMessage id='Search.Button.LoadMore' />
                      </Button>
                    </Flex>
                  }
                </Box>
              </Flex>
            }
          </Box>
        </Flex>
      </Container>
    </Layout>
  )
}

Search.propTypes = {
  router: PropTypes.object,
  results: PropTypes.array,
  testNamesKeyed: PropTypes.object,
  testNames: PropTypes.array,
  countries: PropTypes.array,
  nextURL: PropTypes.string,
  error: PropTypes.object
}

export default Search
