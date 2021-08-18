/* global process */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Container, Flex, Box, Button } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import useSWR from 'swr'
import axios from 'axios'
import moment from 'moment'

import Layout from 'components/Layout'
import NavBar from 'components/NavBar'
import FilterSidebar from 'components/search/FilterSidebar'
import ErrorBox from 'components/search/ErrorBox'
import NoResults from 'components/search/NoResults'
import { Loader } from 'components/search/Loader'
import ResultsList from 'components/search/ResultsList'
import { sortByKey } from '../utils'


const SUPPORTED_PARAMS = ['probe_cc', 'domain', 'probe_asn', 'test_name', 'since', 'until']
const API_SERVER = process.env.NEXT_PUBLIC_MEASUREMENTS_URL
const API_ENDPOINT_TESTNAMES = '/api/_/test_names'
const API_ENDPOINT_COUNTRIES = '/api/_/countries'
const API_ENDPOINT_SEARCH = '/api/v1/measurements'

// Fetcher for SWR
const queryToParams = ({show = 50, ...query}) => {
  // XXX do better validation
  let params = {}

  if (show) {
    show = Number(show)
  }

  SUPPORTED_PARAMS.forEach((p) => {
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

const fetcher = (url, query) => {
  let params = {}
  if (typeof query === 'object') {
    params = queryToParams(query)
  }
  return axios.get(API_SERVER + url, { params }).then(res => res.data)
}

// SWR Configurations
const swrOptionsSearch = {
  // revalidateOnFocus: false,
  // revalidateOnReconnect: false,
  // dedupingInterval: 60000,
  errorRetryCount: 1,
}

const Search = () => {
  const router = useRouter()
  const [countries, setCountries] = useState(null)
  const [testNames, setTestNames] = useState([])
  const [nextURL, setNextURL] = useState(null)

  // About `today`
  // By default, on '/search' show measurements published until today
  // including the measurements of today (so the date of tomorrow).
  // This prevents the search page from showing time-travelling future
  // measurements from showing up

  const loadMore = useCallback(() => {

  }, [])

  useEffect(() => {
    const { query, replace } = router
    const until = moment.utc().add(1, 'day').format('YYYY-MM-DD')
    if (!query.until) {
      query.until = until
    }

    const since = moment(query.until).utc().subtract(30, 'day').format('YYYY-MM-DD')
    if (!query.since) {
      query.since = since
    }

    const href = {
      pathname: '/search',
      query
    }
    replace(href, href, { shallow: true })
  }, [])

  useEffect(() => {
    axios.get(API_SERVER + API_ENDPOINT_COUNTRIES).then(res => {
      const sortedCountries = res.data.countries.sort(sortByKey('name'))
      setCountries(sortedCountries)
    })

    axios.get(API_SERVER + API_ENDPOINT_TESTNAMES).then(res => {
      const sortedTestNames = res.data.test_names
        .sort(sortByKey('name'))
      setTestNames(sortedTestNames)
    })
  }, [])

  const { data: searchApiResponse, error: searchQueryError } = useSWR(
    [API_ENDPOINT_SEARCH, router.query],
    fetcher,
    swrOptionsSearch
  )

  const { results, error } = useMemo(() => {
    return {
      results: searchApiResponse?.results,
      error: searchQueryError?.isAxiosError ? searchQueryError.response : searchQueryError
    }
  }, [searchApiResponse])

  return (
    <Layout>
      <Head>
        <title>Search through millions of Internet censorship measurements | OONI Explorer</title>
      </Head>
      <NavBar />
      
      <Container>
        <Flex flexDirection={['column', 'row']}>
          <Box width={[1, 1/4]} px={2}>
            Sidebar
            {/* <FilterSidebar
              domainFilter={domainFilter}
              testNameFilter={testNameFilter}
              countryFilter={countryFilter}
              asnFilter={asnFilter}
              sinceFilter={sinceFilter}
              untilFilter={untilFilter}
              onlyFilter={onlyFilter}
              onApplyFilter={this.onApplyFilter}
              testNames={testNames}
              countries={countries}
            /> */}
          </Box>
          <Box width={[1, 3/4]} px={2}>
            {error && <ErrorBox error={error} />}
            {!results && !error && <Loader />}

            {!error && results?.length === 0 && <NoResults />}
            {!error && results && results?.length > 0 && testNames?.length > 0 && <React.Fragment>
              <ResultsList results={results} testNames={testNames} />
              {nextURL &&
                <Flex alignItems='center' justifyContent='center'>
                  <Button onClick={loadMore} data-test-id='load-more-button'>
                    <FormattedMessage id='Search.Button.LoadMore' />
                  </Button>
                </Flex>
              }
            </React.Fragment>}
          </Box>
        </Flex>
      </Container>
    </Layout>
  )
}

export default Search