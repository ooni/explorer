import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import axios from 'axios'

import {
  Flex, Grid, Box,
  Divider,
  Container,
  Button,
  ButtonOutline,
  Input,
  Select,
  Panel,
  PanelHeader,
  Text,
  InlineForm
} from 'rebass'

import Layout from '../components/layout'
import Flag from '../components/flag'

import { colors } from '../components/layout'

import { sortByKey } from '../utils'

const inputTrunc = 50

const queryToParams = ({ query }) => {
  // XXX do better validation
  let params = {},
    show = 50
  const supportedParams = ["probe_cc", "input", "probe_asn", "test_name", "since", "until"]
  if (query.show) {
    show = parseInt(query.show)
  }
  supportedParams.forEach((p) => {
    if (query[p]) {
      params[p] = query[p]
    }
  })
  params["limit"] = show
  if (query.page) {
    params["offset"] = (parseInt(query.page) - 1) * show
  }
  return params
}

const OnlyFilterButton = ({
    text,
    onlyFilter,
    thisValue,
    onChangeOnly,
    rounded
}) => {
  const style = {
    marginLeft: -1
  }
  if (onlyFilter == thisValue) {
    return (
        <Button
          onClick={() => { onChangeOnly(thisValue) }}
          backgroundColor='primary'
          color='white'
          inverted
          rounded={rounded}
          style={style}>{text}</Button>
    )
  } else {
    return (
        <ButtonOutline
          onClick={() => { onChangeOnly(thisValue) }}
          color='primary'
          rounded={rounded}
          style={style}>{text}</ButtonOutline>
    )
  }
}

export default class extends React.Component {
  static async getInitialProps ({ req, query }) {
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})
    const params = queryToParams({ query })
    let [msmtR, testNamesR, countriesR] = await Promise.all([
        client.get('/api/v1/measurements', { params } ),
        client.get('/api/_/test_names'),
        client.get('/api/_/countries')
    ])
    return {
      measurements: msmtR.data,
      testNames: testNamesR.data.test_names,
      countries: countriesR.data.countries,
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
    this.onChangeFilter = this.onChangeFilter.bind(this)
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
        pathname: '/explore',
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
      pathname: '/explore',
      query: {...this.props.url.query, show: parseInt(target.value)}
    }).then(() => {
      this.setState({
        loading: false
      })
    })
  }

  onApplyFilter () {
    this.setState({
      loading: true
    })
    Router.push({
      pathname: '/explore',
      query: this.getFilterQuery()
    }).then(() => {
      this.setState({
        loading: false
      })
    })
  }

  onChangeFilter ({target}) {
    this.setState({[target.name]: target.value})
  }

  onChangeOnly (value) {
    this.setState({
      onlyFilter: value
    })
    this.setState({
      loading: true
    })
    Router.push({
      pathname: '/explore',
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
      if (this.state[m[0]]) {
        query[m[1]] = this.state[m[0]]
      }
    })
    return query
  }

  render () {
    const { measurements, testNames, countries, url } = this.props
    const currentPage = measurements.metadata.current_page,
      totalPages = measurements.metadata.pages,
      nextUrl = measurements.metadata.next_url;

    let showCount = 50;
    if (url.query.show) {
      showCount = parseInt(url.query.show)
    }

    let testOptions = []
    testNames.forEach((v) => {
      testOptions.push({
        children: v.name,
        value: v.id
      })
    })
	  testOptions.sort(sortByKey('children'))
    testOptions.unshift({ children: 'Any', value: '' })

    let countryOptions = []
    countries.forEach((v) => {
      countryOptions.push({
        children: v.name,
        value: v.alpha_2
      })
    })
	  countryOptions.sort(sortByKey('children'))
    countryOptions.unshift({ children: 'Any', value: '' })

    return (
      <Layout>
        <Head>
          <title>Explore - OONI Explorer</title>
        </Head>
        <div className='mini-header'>
          <h1>Search</h1>
        </div>

        <div className='explore-view'>
        <Container>
        <Flex col={12} wrap>
          <Box col={12}>
          <div className='search-bar'>
            <InlineForm
              buttonLabel="Search"
              label="Search"
              name="search"
              style={{ backgroundColor: 'white' }}
              onChange={function noRefCheck() {}}
              onClick={function noRefCheck() {}}
            />
          </div>
          </Box>
          <Box col={2}>
            <div className='filter-tab'>
              <Input
                label="Input"
                name="inputFilter"
                defaultValue={this.state.inputFilter}
                onChange={this.onChangeFilter}
                placeholder="ex. torproject.org"
                rounded
                type="text" />
              <Select
                label="Test Name"
                defaultValue={this.state.testNameFilter}
                name="testNameFilter"
                onChange={this.onChangeFilter}
                options={testOptions}
                rounded />
              <Select
                label="Country"
                defaultValue={this.state.countryFilter}
                name="countryFilter"
                onChange={this.onChangeFilter}
                options={countryOptions}
                rounded />
              <Input
                label="ASN"
                defaultValue={this.state.asnFilter}
                name="asnFilter"
                onChange={this.onChangeFilter}
                rounded />
              <Input
                label="Since"
                defaultValue={this.state.sinceFilter}
                name="sinceFilter"
                onChange={this.onChangeFilter}
                rounded />
              <Input
                label="Until"
                defaultValue={this.state.untilFilter}
                name="untilFilter"
                onChange={this.onChangeFilter}
                rounded />
              <Button
                onClick={this.onApplyFilter}
                backgroundColor="primary"
                inverted
                rounded>
                Apply filter
              </Button>
            </div>
          </Box>
          <Box col={10}>
          <div className='result-container'>
            <div className='result-selectors'>
              <Flex>
              <Box>
                <OnlyFilterButton
                  text="All"
                  onlyFilter={this.state.onlyFilter}
                  thisValue="all"
                  onChangeOnly={this.onChangeOnly}
                  rounded="left" />
                <OnlyFilterButton
                  text="Confirmed censorship"
                  onlyFilter={this.state.onlyFilter}
                  thisValue="confirmed_censorship"
                  rounded={false}
                  onChangeOnly={this.onChangeOnly} />
                <OnlyFilterButton
                  text="Anomalies"
                  onlyFilter={this.state.onlyFilter}
                  thisValue="anomalies"
                  rounded="right"
                  onChangeOnly={this.onChangeOnly} />
              </Box>
              <Box style={{marginLeft: 'auto'}}>
                {currentPage > 1
                 && <ButtonOutline style={{marginRight: '10px'}} color="primary" onClick={this.goToPage(currentPage - 1)}>{'<'}</ButtonOutline>
                }
                {(totalPages == -1 || totalPages > currentPage)
                 && <ButtonOutline color="primary" onClick={this.goToPage(currentPage + 1)}>{'>'}</ButtonOutline>
                }
              </Box>
            </Flex>

            </div>
            {this.state.loading && <h2>Loading</h2>}
            {measurements.results.length == 0 && <h2>No results found</h2>}
            {!this.state.loading && measurements.results.map((msmt) => {
              if (msmt.input && msmt.input.length > inputTrunc) {
                msmt.input = `${msmt.input.substr(0, inputTrunc - 10)}…${msmt.input.substr(msmt.input.length - 10, msmt.input.length)}`
              }
              return (
                <div className='result-item'>
                <Divider />
                <Flex>
                  <Box>
                    <Flag withCountryName={true} countryCode={msmt.probe_cc} withAsn={msmt.probe_asn} />
                  </Box>
                  <Flex column pl={2}>
                    {msmt.input && <Box>
                      <div className='input'>
                        <span className='input-name'>{msmt.input}</span>
                        <span className='input-cat'>({msmt.input_category})</span>
                      </div>
                    </Box>}
                    <Box>
                      <div className='test-name'>
                        <span>{msmt.test_name}</span>
                      </div>
                    </Box>
                    <Box>
                      <div className='test-result'>
                        <Flex align='center'>
                          <Box pr={1}>
                          <div className={`test-result-dot test-result-dot-${msmt.anomaly_color}`}></div>
                          </Box>
                          <Box>
                          <span className='test-result-text'>{msmt.anomaly_text}</span>
                          </Box>
                        </Flex>
                      </div>
                    </Box>
                  </Flex>
                  <Flex style={{marginLeft: 'auto'}} column>
                    <Box style={{marginLeft: 'auto'}}>
                      <div className='view'>
                        <Link href={`/measurement/${msmt.id}`}><a>»</a></Link>
                      </div>
                    </Box>
                    <Box style={{marginTop: 'auto'}}>
                      <div className='timestamp'>
                        <span>{msmt.measurement_start_time}</span>
                      </div>
                    </Box>
                  </Flex>
                </Flex>
                </div>
              )
            })}

            <div className='result-pagination'>
              <Divider />
              <Flex>
              <Box col={10}>
              </Box>
              <Box style={{marginLeft: 'auto'}}>
              <Select
                label="show"
                name="showCount"
                defaultValue={showCount}
                onChange={this.onShowCount}
                options={[
                  {children: '10', value: 10},
                  {children: '50', value: 50},
                  {children: '100', value: 100},
                  {children: '200', value: 200}
                ]}
                rounded />
              </Box>
              </Flex>
            </div>
          </div>
          </Box>
        </Flex>
        </Container>
        </div>
        <style jsx>{`
          .mini-header {
            color: ${ colors.offWhite };
            background-color: ${ colors.ooniBlue };
            padding-top: 30px;
            padding-bottom: 30px;
            padding-left: 30px;
          }
          .explore-view {
            min-height: 85vh;
          }
          .result-container {
            background-color: ${ colors.white };
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
          }
          .result-item {
          }
          .input {
            padding-bottom: 10px;
          }
          .input .input-name {
            font-weight: bold;
          }
          .input .input-cat {
            padding-left: 5px;
            color: ${ colors.offBlack };
          }
          .test-name {
            padding-bottom: 10px;
          }
          .search-bar {
            margin-top: 20px;
            margin-bottom: 20px;
          }
          .filter-tab {
            padding-right: 10px;
          }
          .test-result-dot-red {
            background: red;
          }
          .test-result-dot-green {
            background: green;
          }
          .test-result-dot-yellow {
            background: yellow;
          }
          .test-result-dot {
            width: 20px;
            height: 20px;
            margin-top: 3px;
            display: inline-block;
            border-radius: 20px;
            border: 2px solid black;
          }
        `}</style>
      </Layout>
    )
  }
}
