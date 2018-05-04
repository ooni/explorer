import React from 'react'
import Head from 'next/head'
import Router from 'next/router'

import styled from 'styled-components'
import axios from 'axios'

import {
  Flex, Box,
  Container
} from 'ooni-components'

import NavBar from '../components/NavBar'
import Layout from '../components/layout'

import ResultsList from '../components/search/results-list'
import FilterTabs from '../components/search/filter-tabs'
import FilterSidebar from '../components/search/filter-sidebar'
import Loader from '../components/search/loader'
import Pagination from '../components/search/pagination'

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
  if (query.page) {
    params['offset'] = (parseInt(query.page) - 1) * show
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

export default class extends React.Component {
  static async getInitialProps ({ query }) {
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})
    const params = queryToParams({ query })
    let [msmtR, testNamesR, countriesR] = await Promise.all([
      client.get('/api/v1/measurements', { params } ),
      client.get('/api/_/test_names'),
      client.get('/api/_/countries')
    ])
    const measurements = msmtR.data

    let countries = countriesR.data.countries
    countries.sort(sortByKey('name'))
    // We use XX to denote anything
    countries.unshift({ name: 'Any', alpha_2: 'XX' })

    let testNames = testNamesR.data.test_names
    let testNamesKeyed = {}
    testNames.forEach(v => testNamesKeyed[v.id] = v.name)
    testNames.sort(sortByKey('name'))
    testNames.unshift({ name: 'Any', id: 'XX' })
    return {
      measurements,
      testNamesKeyed,
      testNames,
      countries,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      testNameFilter: props.url.query.test_name,
      inputFilter: props.url.query.input,
      countryFilter: props.url.query.probe_cc,
      asnFilter: props.url.query.probe_asn,
      sinceFilter: props.url.query.since,
      untilFilter: props.url.query.until,

      onlyFilter: props.url.query.only || 'all',

      search: null,

      loading: true
    }
    this.getFilterQuery = this.getFilterQuery.bind(this)
    this.onApplyFilter = this.onApplyFilter.bind(this)
    this.goToPage = this.goToPage.bind(this)
    this.onShowCount = this.onShowCount.bind(this)

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
    if (this.state.loading != nextState.loading) {
      return true
    }
    return false
  }

  goToPage (n) {
    if (n < 1) {
      n = 1
    }
    let onHandler = () => {
      this.setState({
        loading: true
      })
      Router.push({
        pathname: '/search',
        query: {...this.props.url.query, page: n}
      }).then(() => {
        this.setState({
          loading: false
        })
        window.scrollTo(0, 0)
      })
    }
    onHandler = onHandler.bind(this)
    return onHandler
  }

  onShowCount ({target}) {
    this.setState({
      loading: true
    })
    Router.push({
      pathname: '/search',
      query: {...this.props.url.query, show: parseInt(target.value)}
    }).then(() => {
      this.setState({
        loading: false
      })
    })
  }

  onApplyFilter (state) {
    this.setState({
      loading: true,
      ...state
    }, () => {
      Router.push({
        pathname: '/search',
        query: this.getFilterQuery()
      }).then(() => {
        this.setState({
          loading: false
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
    Router.push({
      pathname: '/search',
      query: {...this.props.url.query, only: value}
    }).then(() => {
      this.setState({
        loading: false
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
      measurements,
      testNames,
      testNamesKeyed,
      countries,
      url
    } = this.props
    const {
      onlyFilter,
      inputFilter,
      testNameFilter,
      countryFilter,
      asnFilter,
      sinceFilter,
      untilFilter
    } = this.state

    const currentPage = measurements.metadata.current_page,
      totalPages = measurements.metadata.pages,
      nextUrl = measurements.metadata.next_url

    let showCount = 50
    if (url.query.show) {
      showCount = parseInt(url.query.show)
    }

    return (
      <Layout>
        <Head>
          <title>Search Measurements - OONI Explorer</title>
        </Head>

        <NavBar />

        <Container>
          <Flex>
            <Box w={1/4} pr={2}>
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
            <Box w={3/4}>
              <Flex pt={2}>
                <Box w={1/2}>
                  <FilterTabs onClick={this.onChangeOnly} onlyFilter={onlyFilter} />
                </Box>
              </Flex>

              <Loader loading={this.state.loading} />

              {measurements.results.length == 0 && <h2>No results found</h2>}
              {!this.state.loading
            && <ResultsList measurements={measurements} testNamesKeyed={testNamesKeyed} />
              }
              <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={this.goToPage} showCount={showCount} />
            </Box>
          </Flex>
        </Container>
      </Layout>
    )
  }
}
