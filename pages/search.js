import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { withRouter } from 'next/router'
import moment from 'moment'
import axios from 'axios'
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
  params['limit'] = show

  // Allow only `failure=false`. `true` results in showing only failures
  if ('failure' in query && query['failure'] === false) {
    params['failure'] = false
  }

  for (const p of supportedParams) {
    if (p in query && query[p] !== undefined) {
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
  let client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL})  // eslint-disable-line
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

class Search extends React.Component {
  static async getInitialProps ({ query }) {
    let msmtR, testNamesR, countriesR
    let client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL})  // eslint-disable-line

    // By default, on '/search' show measurements published until today
    // including the measurements of today (so the date of tomorrow).
    // This prevents the search page from showing time-travelling future
    // measurements from showing up
    const since = moment(query.until).utc().subtract(30, 'day').format('YYYY-MM-DD')
    if (!query.since) {
      query.since = since
    }

    const until = moment.utc().add(1, 'day').format('YYYY-MM-DD')
    if ('until' in query === false) {
      query.until = until
    }

    if ('failure' in query === false) {
      query.failure = false
    }

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


    try {
      msmtR = await getMeasurements(query)
    } catch (err) {
      let error
      if (err.response) {
        error = err.response.data
      } else {
        error = err.message
      }
      return {
        error,
        results: [],
        nextURL: null,
        testNamesKeyed,
        testNames,
        countries
      }
    }

    const measurements = msmtR.data
    // drop results with probe_asn === 'AS0'
    const results = measurements.results.filter(item => item.probe_asn !== 'AS0')

    return {
      error: null,
      results,
      nextURL: measurements.metadata.next_url,
      testNamesKeyed,
      testNames,
      countries,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      testNameFilter: props.router.query.test_name,
      domainFilter: props.router.query.domain,
      countryFilter: props.router.query.probe_cc,
      asnFilter: props.router.query.probe_asn,
      sinceFilter: props.router.query.since,
      untilFilter: props.router.query.until,
      onlyFilter: props.router.query.only || 'all',
      hideFailed: true,
      results: props.results,
      nextURL: props.nextURL,
      error: props.error,

      loading: false
    }
    this.getFilterQuery = this.getFilterQuery.bind(this)
    this.onApplyFilter = this.onApplyFilter.bind(this)
    this.loadMore = this.loadMore.bind(this)
  }

  componentDidMount () {
    const { query, replace } = this.props.router
    const href = {
      pathname: '/search',
      query
    }
    replace(href, href, { shallow: true })
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props != nextProps) {
      return true
    }
    if (this.state.results != nextState.results) {
      return true
    }
    if (this.state.loading != nextState.loading) {
      return true
    }
    return false
  }

  loadMore() {
    axios.get(this.state.nextURL)
      .then((res) => {
        // XXX update the query
        const nextPageResults = res.data.results.filter(item => item.probe_asn !== 'AS0')
        this.setState({
          results: this.state.results.concat(nextPageResults),
          nextURL: res.data.metadata.next_url,
          show: this.state.show + 50
        })
      })
      .catch((err) => {
        this.setState({
          error: err
        })
      })
  }

  onApplyFilter (state) {
    this.setState({
      error: null,
      loading: true,
      ...state
    }, () => {
      const query = this.getFilterQuery()
      const href = {
        pathname: '/search',
        query
      }
      this.props.router.push(href, href, { shallow: true }).then(() => {
        // XXX do error handling
        getMeasurements(query)
          .then((res) => {
            const results = res.data.results.filter(item => item.probe_asn !== 'AS0')
            this.setState({
              loading: false,
              results,
              nextURL: res.data.metadata.next_url
            })
          })
          .catch((err) => {
            this.setState({
              error: err,
              loading: false
            })
          })
      })
    })
  }

  getFilterQuery () {
    const mappings = [
      ['domainFilter', 'domain'],
      ['countryFilter', 'probe_cc'],
      ['asnFilter', 'probe_asn'],
      ['testNameFilter', 'test_name'],
      ['sinceFilter', 'since'],
      ['untilFilter', 'until'],
      ['onlyFilter', 'only'],
      ['hideFailed', 'failure']
    ]
    let query = {...this.props.router.query}
    for (const [key, queryParam] of mappings) {
      if (this.state[key] === undefined || this.state[key] === 'XX') {
        // If it's unset or marked as XX, let's be sure the path is clean
        if (query[queryParam]) {
          delete query[queryParam]
        }
      } else if (key === 'onlyFilter' && this.state[key] == 'all') {
        // If the onlyFilter is not set to 'confirmed' or 'anomalies'
        // remove it from the path
        if (query[queryParam]) {
          delete query[queryParam]
        }
      } else if (key === 'hideFailed') {
        if (this.state[key] === true) {
          // When `hideFailure` is true, add `failure=false` in the query
          query[queryParam] = false
        } else {
          delete query[queryParam]
        }
      } else {
        query[queryParam] = this.state[key]
      }
    }
    return query
  }

  render () {
    const {
      testNames,
      testNamesKeyed,
      countries
    } = this.props

    const {
      loading,
      error,
      results,
      onlyFilter,
      domainFilter,
      testNameFilter,
      countryFilter,
      asnFilter,
      sinceFilter,
      untilFilter,
      hideFailed
    } = this.state

    return (
      <Layout>
        <Head>
          <title>Search through millions of Internet censorship measurements | OONI Explorer</title>
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
                onlyFilter={onlyFilter}
                hideFailed={hideFailed}
                onApplyFilter={this.onApplyFilter}
                testNames={testNames}
                countries={countries}
              />
            </Box>
            <Box width={[1, 3/4]} px={2}>
              {error && <ErrorBox error={error} />}
              {loading && <Loader />}

              {!error && !loading && results.length === 0 && <NoResults />}
              {!error && !loading && results.length > 0 && <React.Fragment>
                <ResultsList results={results} testNamesKeyed={testNamesKeyed} />
                {this.state.nextURL &&
                  <Flex alignItems='center' justifyContent='center'>
                    <Button onClick={this.loadMore} data-test-id='load-more-button'>
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

export default withRouter(Search)
