import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import axios from 'axios'

import {
  Flex, Grid, Box
} from 'reflexbox'

import {
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

const inputTrunc = 50

const queryToParams = ({ query }) => {
  // XXX do better validation
  let params = {}
  const supportedParams = ["probe_cc", "input", "probe_asn", "test_name", "since", "until"]
  supportedParams.forEach((p) => {
    if (query[p]) {
      params[p] = query[p]
    }
  })
  return params
}

export default class extends React.Component {
  static async getInitialProps ({ req, query }) {
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})
    console.log(query)
    const params = queryToParams({ query })
    const res = await client.get('/api/v1/measurements', { params } )
    return { measurements: res.data.results }
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

      search: null,

      loading: true
    }
    this.getFilterQuery = this.getFilterQuery.bind(this)
    this.onChangeFilter = this.onChangeFilter.bind(this)
    this.onApplyFilter = this.onApplyFilter.bind(this)
  }

  componentDidMount () {
    this.setState({
      loading: false
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log("Should I update?")
    if (this.props != nextProps) {
      return true
    }
    if (this.state.loading != nextState.loading) {
      return true
    }
    return false
  }

  onApplyFilter () {
    this.setState({
      loading: true
    })
    Router.push({
      pathname: '/explore',
      query: this.getFilterQuery()
    })
    Router.onRouteChangeComplete = () => {
      this.setState({
        loading: false
      })
    }
  }

  onChangeFilter ({target}) {
    console.log("Setting", target.value)
    console.log("Setting", target.name)
    this.setState({[target.name]: target.value})
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
    let query = {}
    mappings.forEach((m) => {
      if (this.state[m[0]]) {
        query[m[1]] = this.state[m[0]]
      }
    })
    return query
  }

  render () {
    const testOptions = [
      { children: 'Any', value: '' },
      { children: 'Web Connectivity', value: 'web_connectivity' },
      { children: 'HTTP Invalid Request Line', value: 'http_invalid_request_line' }
    ]

    const countryOptions = [
      { children: 'Any', value: '' },
      { children: 'Italy', value: 'IT' },
      { children: 'China', value: 'CN' }
    ]

    const currentPage = 1,
      totalPages = 10;
    const { measurements } = this.props
    return (
      <Layout>
        <Head>
          <title>Explore - OONI Explorer</title>
        </Head>
        <div className='mini-header'>
          <h1>Explore</h1>
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
              <Button
                backgroundColor="primary"
                color="white"
                inverted
                rounded="left"
                style={{
                  marginLeft: -1
                }}>All</Button>
             <ButtonOutline
              color="primary"
              rounded={false}
             >
             Confirmed censorship
             </ButtonOutline>
             <ButtonOutline
              color="primary"
              rounded="right"
              style={{
                  marginLeft: -1
              }}
              >
              Anomalies
              </ButtonOutline>
            </div>
            {this.state.loading && <h2>Loading</h2>}
            {!this.state.loading && measurements.map((msmt) => {
              if (msmt.input && msmt.input.length > inputTrunc) {
                msmt.input = `${msmt.input.substr(0, inputTrunc - 10)}…${msmt.input.substr(msmt.input.length - 10, msmt.input.length)}`
              }
              return (
                <div className='result-item'>
                <Divider />
                <Flex>
                  <Box>
                    <Flag countryCode={msmt.probe_cc} withAsn={msmt.probe_asn} />
                  </Box>
                  <Flex column pl={2}>
                    <Box>
                      <div className='input'>
                        <span className='input-name'>{msmt.input}</span>
                        <span className='input-cat'>({msmt.input_category})</span>
                      </div>
                    </Box>
                    <Box>
                      <div className='test-name'>
                        <span>{msmt.test_name}</span>
                      </div>
                    </Box>
                    <Box>
                      <div className='test-result'>
                        <div className='test-result-dot'></div>
                        <span className='test-result-text'>{msmt.result_text}</span>
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
              <div className='pages'>
              <ButtonOutline style={{marginRight: '10px'}} color="primary">{'<'}</ButtonOutline>
              {Array.apply(null, Array(totalPages)).map((_, i) => {
                  let pageNum = i+1
                  const btnStyle = {
                    marginRight: '10px'
                  }
                  if (pageNum == currentPage) {
                    return <Button
                              style={btnStyle}
                              backgroundColor="primary"
                              color="white"
                              inverted>{pageNum}</Button>
                  }
                  return <ButtonOutline style={btnStyle} className='page-button' color="primary">{pageNum}</ButtonOutline>
                })}
                <ButtonOutline color="primary">{'>'}</ButtonOutline>
              </div>
              </Box>
              <Box style={{marginLeft: 'auto'}}>
              <Select
                label="show"
                name="show_number"
                options={[
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
          .search-bar {
            margin-top: 20px;
            margin-bottom: 20px;
          }
          .filter-tab {
            padding-right: 10px;
          }
        `}</style>
      </Layout>
    )
  }
}
