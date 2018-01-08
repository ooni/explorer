import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'

import styled from 'styled-components'
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
  InlineForm,
  Label
} from 'ooni-components'

import NavBar from '../components/NavBar'
import Layout from '../components/layout'

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

const StyledInputWithLabel = styled.div``
const StyledLabel = styled(Label)`
  color: ${props => props.theme.colors.blue5};
  padding-top: 32px;
`
const InputWithLabel = (props) => (
  <StyledInputWithLabel>
    <StyledLabel>
    {props.label}
    </StyledLabel>
    <Input {...props} />
  </StyledInputWithLabel>
)

const StyledSelectWithLabel = styled.div``

const SelectWithLabel = (props) => (
  <StyledSelectWithLabel>
  <StyledLabel>
  {props.label}
  </StyledLabel>
    <Select {...props}>
    {props.children}
    </Select>
  </StyledSelectWithLabel>
)

const StyledFilterSidebar = styled.div`
`

const FilterSidebar = ({
  inputFilter,
  testNameFilter,
  testOptions,
  countryFilter,
  countryOptions,
  asnFilter,
  sinceFilter,
  untilFilter,
  onChangeFilter,
  onApplyFilter
}) => (
  <StyledFilterSidebar>
    <InputWithLabel
      label="Input"
      name="inputFilter"
      defaultValue={inputFilter}
      onChange={onChangeFilter}
      placeholder="ex. torproject.org"
      rounded
      type="text" />
    <SelectWithLabel
      pt={2}
      label="Test Name"
      defaultValue={testNameFilter}
      name="testNameFilter"
      onChange={onChangeFilter}
      options={testOptions}
      rounded>
      <option value='web_connectivity'>Web Connectivity</option>
      <option value='telegram'>Telegram</option>
      <option value='whatsapp'>WhatsApp</option>
    </SelectWithLabel>

    <SelectWithLabel
      pt={2}
      label="Country"
      defaultValue={countryFilter}
      name="countryFilter"
      onChange={onChangeFilter}
      options={countryOptions}
      rounded>
      <option value='IT'>Italy</option>
      <option value='RU'>Russia</option>
      <option value='GR'>Greece</option>
      <option value='AL'>Albania</option>
    </SelectWithLabel>

    <InputWithLabel
      label="ASN"
      defaultValue={asnFilter}
      name="asnFilter"
      onChange={onChangeFilter}
      rounded />

    <Flex>
    <Box w={1/2} pr={1}>
    <InputWithLabel
      label="Since"
      defaultValue={sinceFilter}
      name="sinceFilter"
      onChange={onChangeFilter}
      rounded />
    </Box>
    <Box w={1/2} pl={1}>
    <InputWithLabel
      label="Until"
      defaultValue={untilFilter}
      name="untilFilter"
      onChange={onChangeFilter}
      rounded />
    </Box>
    </Flex>
    <Button
      mt={3}
      onClick={onApplyFilter}>
      Apply filter
    </Button>
  </StyledFilterSidebar>
)

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

const StyledFilterTab = styled(Button)`
  font-size: 14px;
  text-transform: none;
  padding: 0 10px;

  background-color: ${props => props.active ? props.theme.colors.blue5 : 'transparent'};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.blue5};

  ${props => {
    if (props.pos == 'left') {
      return `border-radius: 32px 0px 0px 32px;
      border-right: 0px;
      border: 1px solid ${props.theme.colors.blue5};
      `
    }
    if (props.pos == 'right') {
      return `border-radius: 0px 32px 32px 0px;
      border-left: 0px;
      border: 1px solid ${props.theme.colors.blue5};
      `
    }
    return `border-radius: 0px;
    border: 1px solid ${props.theme.colors.blue5};`
  }}

  &:hover {
    background-color: ${props => props.theme.colors.blue4};
    color: ${props => props.theme.colors.white};
    transition: .2s ease-in;
    ${props => {
      if (props.pos == 'right') {
        return 'border-left: 0px;'
      } else if (props.pos == 'left') {
        return 'border-right: 0px;'
      }
    }}
  }
  &:active {
    transition: .2s ease-in;
    background-color: ${props => props.theme.colors.blue4};
    color: ${props => props.theme.colors.white};
    ${props => {
      if (props.pos == 'right') {
        return 'border-left: 0px;'
      } else if (props.pos == 'left') {
        return 'border-right: 0px;'
      } else {
        return 'border-radius: 0px;'
      }
    }}
  }
`

const FilterTab = (props) => {
  return <StyledFilterTab {...props}>
  {props.text}
  </StyledFilterTab>
}

const FilterTabs = () => (
  <Flex>
  <Box>
  <FilterTab text='All Results' pos='left' onClick={() => {}} active />
  </Box>
  <Box>
  <FilterTab text='Confirmed' pos='center' onClick={() => {}} />
  </Box>
  <Box>
  <FilterTab text='Anomalies' pos='right' onClick={() => {}} />
  </Box>
  </Flex>
)

const ResultItem = ({msmt}) => (
  <Flex>
    <Box>
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
)

const ResultsList = ({measurements}) => {
  return measurements.results.map((msmt) => {
    if (msmt.input && msmt.input.length > inputTrunc) {
      msmt.input = `${msmt.input.substr(0, inputTrunc - 10)}…${msmt.input.substr(msmt.input.length - 10, msmt.input.length)}`
    }
    return <ResultItem msmt={msmt} />
  })
}

const Pagination = ({showCount, onShowCount}) => (
  <Select
    label="show"
    name="showCount"
    defaultValue={showCount}
    onChange={onShowCount}
    options={[
      {children: '10', value: 10},
      {children: '50', value: 50},
      {children: '100', value: 100},
      {children: '200', value: 200}
    ]}
    rounded />
)


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

    const navItems = [
      {
        label: 'Search',
        href: '/search',
        active: true
      },
      {
        label: 'Results',
        href: '/results',
        active: false
      },
      {
        label: 'Countries',
        href: '/countries',
        active: false
      },
      {
        label: 'About',
        href: '/about',
        active: false
      },
    ]

    return (
      <Layout>
        <Head>
          <title>Search Measurements - OONI Explorer</title>
        </Head>

        <NavBar items={navItems} />

        <Container>
        <Flex>
          <Box w={1/4} pr={2}>
            <FilterSidebar />
          </Box>
          <Box w={3/4}>
            <Flex pt={2}>
              <Box w={1/2}>
                <FilterTabs />
              </Box>
              <Box w={1/2}>
                <Flex>
                <Box w={3/4}>
                  <Input
                    name="search"
                    onChange={function noRefCheck() {}}
                    onClick={function noRefCheck() {}}
                  />
                </Box>
                <Box w={1/4} pl={2}>
                  <Button>Search</Button>
                </Box>
                </Flex>
              </Box>
            </Flex>
            {currentPage > 1
             && <ButtonOutline style={{marginRight: '10px'}} color="primary" onClick={this.goToPage(currentPage - 1)}>{'<'}</ButtonOutline>
            }
            {(totalPages == -1 || totalPages > currentPage)
             && <ButtonOutline color="primary" onClick={this.goToPage(currentPage + 1)}>{'>'}</ButtonOutline>
            }
            {this.state.loading && <h2>Loading</h2>}
            {measurements.results.length == 0 && <h2>No results found</h2>}
            {!this.state.loading && <ResultsList measurements={measurements} />}
            <Pagination />
          </Box>
        </Flex>
        </Container>
      </Layout>
    )
  }
}
