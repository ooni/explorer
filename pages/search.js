import React from 'react'
import Head from 'next/head'
import { withRouter } from 'next/router'

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
import FilterTabs from '../components/search/filter-tabs'
import FilterSidebar from '../components/search/filter-sidebar'
import Loader from '../components/search/loader'

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

const ErrorBox = ({error}) => {
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

class Search extends React.Component {
  static async getInitialProps ({ query }) {
    let msmtR, testNamesR, countriesR
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})  // eslint-disable-line
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

    this.onChangeOnly = this.onChangeOnly.bind(this)
  }

  componentDidMount () {
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

  onChangeOnly (value) {
    this.setState({
      onlyFilter: value
    })
    this.setState({
      loading: true
    })
    const query = {...this.props.url.query, only: value}
    this.props.router.push({
      pathname: '/search',
      query
    }).then(() => {
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
  }

  getFilterQuery () {
    const mappings = [
      ['inputFilter', 'input'],
      ['countryFilter', 'probe_cc'],
      ['asnFilter', 'probe_asn'],
      ['testNameFilter', 'test_name'],
      ['sinceFilter', 'since'],
      ['untilFilter', 'until'],
    ]
    let query = {...this.props.url.query}
    mappings.forEach((m) => {
      if (!this.state[m[0]] || this.state[m[0]] === 'XX') {
        // If it's unset or marked as XX, let's be sure the path is clean
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
          <Flex pt={3}>
            <Box width={1/4}>
              <FilterSidebar
                inputFilter={inputFilter}
                testNameFilter={testNameFilter}
                countryFilter={countryFilter}
                asnFilter={asnFilter}
                sinceFilter={sinceFilter}
                untilFilter={untilFilter}

                onApplyFilter={this.onApplyFilter}
                testNames={testNames}
                countries={countries}
              />
            </Box>
            <Box width={3/4} ml={4}>
              <Flex pt={2}>
                <Box width={1/2}>
                  <FilterTabs onClick={this.onChangeOnly} onlyFilter={onlyFilter} />
                </Box>
              </Flex>

              <ErrorBox error={this.state.error} />
              <Loader loading={this.state.loading} />

              {!this.state.error && results.length == 0 && <h2>No results found</h2>}
              {!this.state.error && !this.state.loading
            && <div>
              <ResultsList results={results} testNamesKeyed={testNamesKeyed} />
              <Flex alignItems='center' justifyContent='center'>
                <Button onClick={this.loadMore}><FormattedMessage id='Search.Button.LoadMore' /></Button>
              </Flex>
            </div>
              }
            </Box>
          </Flex>
        </Container>
      </Layout>
    )
  }
}

export default withRouter(Search)
