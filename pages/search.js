import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { withRouter } from 'next/router'
import moment from 'moment'
import axios from 'axios'

import {
  Flex, Box,
  Container,
  Button,
  Heading
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import NavBar from '../components/nav-bar'
import Layout from '../components/Layout'

import ResultsList from '../components/search/results-list'
import FilterSidebar from '../components/search/filter-sidebar'
import { Loader } from '../components/search/loader'

import { sortByKey } from '../utils'

const queryToParams = ({ query }) => {
  // XXX do better validation
  let params = {},
    show = 50
  const supportedParams = ['probe_cc', 'input', 'probe_asn', 'test_name', 'since', 'until']
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

const formatError = (error) => {
  let errorString = ''
  if (error.code) {
    errorString += `Error code: ${error.code}`
  }
  if (error.errno) {
    errorString += ` (${error.errno})`
  }
  if (errorString === '') {
    errorString = JSON.stringify(error)
  }
  return errorString
}

const ErrorBox = ({ error }) => {
  if (!error) {
    return <div></div>
  }

  return (
    <div>
      <Heading h={2}>Error</Heading>
      <p>{formatError(error)}</p>
    </div>
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
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})  // eslint-disable-line

    // By default, on '/search' show measurements published until today
    // This prevents the search page from showing time-travelling future
    // measurements from showing up
    const today = moment().format('YYYY-MM-DD')
    if (!query.until) {
      query.until = today
    }

    try {
      [msmtR, testNamesR, countriesR] = await Promise.all([
        getMeasurements(query),
        client.get('/api/_/test_names'),
        client.get('/api/_/countries')
      ])
    } catch (err) {
      return {
        error: err,
        results: [],
        testNamesKeyed: {},
        testNames: [],
        countries: [],
      }
    }
    const measurements = msmtR.data

    let countries = countriesR.data.countries
    countries.sort(sortByKey('name'))

    let testNames = testNamesR.data.test_names
    let testNamesKeyed = {}
    testNames.forEach(v => testNamesKeyed[v.id] = v.name)
    testNames.sort(sortByKey('name'))

    return {
      results: measurements.results,
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
      inputFilter: props.router.query.input,
      countryFilter: props.router.query.probe_cc,
      asnFilter: props.router.query.probe_asn,
      sinceFilter: props.router.query.since,
      untilFilter: props.router.query.until,
      results: props.results,
      nextURL: props.nextURL,

      onlyFilter: props.router.query.only || 'all',

      search: null,
      error: props.error,

      loading: true
    }
    this.getFilterQuery = this.getFilterQuery.bind(this)
    this.onApplyFilter = this.onApplyFilter.bind(this)
    this.loadMore = this.loadMore.bind(this)
  }

  componentDidMount () {
    const { query, replace } = this.props.router
    replace({
      pathname: '/search',
      query
    })
    this.setState({
      loading: false
    })
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
        this.setState({
          results: this.state.results.concat(res.data.results),
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
      loading: true,
      ...state
    }, () => {
      const query = this.getFilterQuery()
      this.props.router.push({
        pathname: '/search',
        query
      }).then(() => {
        // XXX do error handling
        getMeasurements(query)
          .then((res) => {
            this.setState({
              loading: false,
              results: res.data.results,
              nextURL: res.data.metadata.next_url
            })
          })
          .catch((err) => {
            this.setState({
              error: err
            })
          })
      })
    })
  }

  getFilterQuery () {
    const mappings = [
      ['inputFilter', 'input'],
      ['countryFilter', 'probe_cc'],
      ['asnFilter', 'probe_asn'],
      ['testNameFilter', 'test_name'],
      ['sinceFilter', 'since'],
      ['untilFilter', 'until'],
      ['onlyFilter', 'only']
    ]
    let query = {...this.props.router.query}
    mappings.forEach((m) => {
      if (!this.state[m[0]] || this.state[m[0]] === 'XX') {
        // If it's unset or marked as XX, let's be sure the path is clean
        if (query[m[1]]) {
          delete query[m[1]]
        }
      } else if (m[0] === 'onlyFilter' && this.state[m[0]] == 'all') {
        // If the onlyFilter is not set to 'confirmed' or 'anomalies'
        // remove it from the path
        if (query[m[1]]) {
          delete query[m[1]]
        }
      } else {
        query[m[1]] = this.state[m[0]]
      }
    })
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
      inputFilter,
      testNameFilter,
      countryFilter,
      asnFilter,
      sinceFilter,
      untilFilter
    } = this.state

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
                inputFilter={inputFilter}
                testNameFilter={testNameFilter}
                countryFilter={countryFilter}
                asnFilter={asnFilter}
                sinceFilter={sinceFilter}
                untilFilter={untilFilter}
                onlyFilter={onlyFilter}
                onApplyFilter={this.onApplyFilter}
                testNames={testNames}
                countries={countries}
              />
            </Box>
            <Box width={[1, 3/4]} px={2}>
              {error && <ErrorBox error={error} />}
              {loading && <Loader />}

              {!error && !loading && results.length === 0 && <NoResults />}
              {!error && !loading && results.length > 0
                && <div>
                  <ResultsList results={results} testNamesKeyed={testNamesKeyed} />
                  {
                    this.state.nextURL &&
                    <Flex alignItems='center' justifyContent='center'>
                      <Button onClick={this.loadMore}><FormattedMessage id='Search.Button.LoadMore' /></Button>
                    </Flex>
                  }
                </div>
              }
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
