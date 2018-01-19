import React from 'react'
import Head from 'next/head'
import NLink from 'next/link'
import Router from 'next/router'

import styled from 'styled-components'
import axios from 'axios'
import moment from 'moment'

import { BarLoader } from 'react-css-loaders'
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
  Label,
  Link,
  Heading
} from 'ooni-components'

import DatePicker from '../components/date-picker'
import NavBar from '../components/NavBar'
import Flag from '../components/Flag'
import Layout from '../components/layout'

import { sortByKey } from '../utils'

const inputTrunc = 26

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
  if (query.only) {
    if (query.only === 'anomalies') {
      params['anomaly'] = true
    } else if (query.only === 'confirmed') {
      params['confirmed'] = true
    }
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

class FilterSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputFilter: props.inputFilter || '',
      testNameFilter: props.testNameFilter || '',
      countryFilter: props.countryFilter || '',
      asnFilter: props.asnFilter || '',
      sinceFilter: props.sinceFilter || '',
      untilFilter: props.untilFilter || '',
      showSinceCalendar: true,
      showUntilCalendar: false,
    }
    this.onChangeFilter = this.onChangeFilter.bind(this)
    this.onClickApplyFilter = this.onClickApplyFilter.bind(this)
  }

  onChangeFilter (filterName) {
    return ((e) => {
      this.setState({[filterName]: e.target.value})
    }).bind(this)
  }

  onClickApplyFilter() {
    this.props.onApplyFilter({
      inputFilter: this.state.inputFilter,
      testNameFilter: this.state.testNameFilter,
      countryFilter: this.state.countryFilter,
      asnFilter: this.state.asnFilter,
      sinceFilter: this.state.sinceFilter,
      untilFilter: this.state.untilFilter,
    })
  }

  render() {
    const {
      testNames,
      countries,
      onApplyFilter
    } = this.props

    const {
      inputFilter,
      testNameFilter,
      countryFilter,
      asnFilter,
      sinceFilter,
      untilFilter,
      showSinceCalendar,
      showUntilCalendar
    } = this.state
    return (
    <StyledFilterSidebar>
      <InputWithLabel
        label="Input"
        name="inputFilter"
        value={inputFilter}
        onChange={this.onChangeFilter('inputFilter')}
        placeholder="ex. torproject.org"
        type="text" />
      <SelectWithLabel
        pt={2}
        label="Test Name"
        value={testNameFilter}
        onChange={this.onChangeFilter('testNameFilter')}>
        {testNames.map((v, idx) => {
          return (
            <option key={idx} value={v.id}>{v.name}</option>
          )
        })}
      </SelectWithLabel>

      <SelectWithLabel
        pt={2}
        label="Country"
        value={countryFilter}
        name="countryFilter"
        onChange={this.onChangeFilter('countryFilter')}>
        {countries.map((v, idx) => {
          return (
            <option key={idx} value={v.alpha_2}>{v.name}</option>
          )
        })}
      </SelectWithLabel>

      <InputWithLabel
        label="ASN"
        value={asnFilter}
        name="asnFilter"
        onChange={this.onChangeFilter('asnFilter')} />

      <Flex>
      <Box w={1/2} pr={1}>
        <StyledLabel>
        Since
        </StyledLabel>
        <DatePicker
          value={sinceFilter}
          onChange={this.onChangeFilter('sinceFilter')}
          timeFormat={false}
          />
      </Box>
      <Box w={1/2} pl={1}>
        <StyledLabel>
        Until
        </StyledLabel>
        <DatePicker
          value={untilFilter}
          onChange={this.onChangeFilter('untilFilter')}
          timeFormat={false}
          />
      </Box>
      </Flex>
      <Button
        mt={3}
        onClick={this.onClickApplyFilter}>
        Apply filter
      </Button>
    </StyledFilterSidebar>
    )
  }
}

const FilterTab = (props) => {
  return <StyledFilterTab {...props}>
  {props.text}
  </StyledFilterTab>
}

const StyledFilterTab = styled.button`
  font-size: 14px;
  height: 32px;
  text-transform: none;
  padding: 0 16px;
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  // Gets rid of tap active state
  -webkit-tap-highlight-color: transparent;

  outline: 0;

  // Specific
  font-family: inherit;
  font-weight: 600;
  text-decoration: none;

  text-align: center;
  letter-spacing: .5px;
  z-index: 1;
  transition: .2s ease-out;
  cursor: pointer;

  background-color: ${props => props.active ? props.theme.colors.blue5 : 'transparent'};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.blue5};
  &:active {
    transition: .2s ease-in;
    background-color: ${props => props.theme.colors.blue4};
    color: ${props => props.theme.colors.white};
  }
  &:hover {
    background-color: ${props => props.theme.colors.blue4};
    color: ${props => props.theme.colors.white};
    transition: .2s ease-in;
  }
`

const FilterTabLeft = styled(StyledFilterTab)`
  border-radius: 32px 0px 0px 32px;
  border: 1px solid ${props => props.theme.colors.blue5};
  border-right: 0px;
`
const FilterTabRight = styled(StyledFilterTab)`
  border: 1px solid ${props => props.theme.colors.blue5};
  border-radius: 0px 32px 32px 0px;
  border-left: 0px;
`

const FilterTabCenter = styled(StyledFilterTab)`
  border: 1px solid ${props => props.theme.colors.blue5};
  border-radius: 0px;
`

const FilterTabs = ({onClick, onlyFilter}) => (
  <Flex>
  <Box>
  <FilterTabLeft
    onClick={() => {onClick('all')}}
    active={onlyFilter === 'all'}>
    All Results
  </FilterTabLeft>
  </Box>
  <Box>
  <FilterTabCenter
    onClick={() => {onClick('confirmed')}}
    active={onlyFilter === 'confirmed'}>
    Confirmed
  </FilterTabCenter >
  </Box>
  <Box>
  <FilterTabRight
    onClick={() => {onClick('anomalies')}}
    active={onlyFilter === 'anomalies'}>
    Anomalies
  </FilterTabRight>
  </Box>
  </Flex>
)

const ResultRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  align-items: center;
  justify-content: center;
`

const ResultColumn = styled.div`
  display: flex;
  flex-flow: row nowrap;
  flex-grow: ${props => props.grow || 1};
  flex-basis: 0;
  padding: 7px 5px;
  word-break: break-word;
  color: ${props => props.theme.colors.gray6};
  font-weight: 500;
`

const ResultInput = styled.div`
  font-size: 16px;
  color: ${props => props.theme.colors.blue9};
`

const StyledResultTag = styled.div`
  border-radius: 16px;
  padding: 8px 16px;
  height: 32px;
  line-height: 1;
  font-size: 16px;
`

const ResultTagFilled = StyledResultTag.extend`
  background-color: ${props => props.theme.colors.gray7};
  color: ${props => props.theme.colors.white};
`

const ResultTagHollow = StyledResultTag.extend`
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.gray7};
  color: ${props => props.theme.colors.gray7};
`

const ResultTag = ({msmt}) => {
  if (msmt.confirmed === true) {
    return <ResultTagFilled>
      Confirmed
    </ResultTagFilled>
  //} else if (msmt.failure === true) {
  //  return <StyledResultTag>
  //    Failure
  //  </StyledResultTag>
  } else if (msmt.anomaly === true) {
    return <ResultTagHollow>
      Anomaly
    </ResultTagHollow>
  } else {
    return <StyledResultTag>Normal</StyledResultTag>
  }
}


const ASNBox = ({asn}) => {
  const justNumber = asn.split('AS')[1]
  return <Flex column>
  <Box>ASN</Box>
  <Box>{justNumber}</Box>
  </Flex>
}

// XXX add this to the design system
const StyledViewDetailsLink = styled(Link)`
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.blue9};
  }
`

const ViewDetailsLink = ({reportId, input}) => {
  let href = `/measurement?report_id=${reportId}`
  if (input) {
    href += `&input=${input}`
  }
  return (
    <NLink href={href}>
      <StyledViewDetailsLink href={href}>View details</StyledViewDetailsLink>
    </NLink>
  )
}

const StyledColorCode = styled.div`
  height: 80px;
  width: 5px;
  margin-right: 10px;
`

const ColorCodeFailed = styled(StyledColorCode)`
  background-color: ${props => props.theme.colors.orange4};
`
const ColorCodeConfirmed = styled(StyledColorCode)`
  background-color: ${props => props.theme.colors.pink5};
`
const ColorCodeAnomaly = styled(StyledColorCode)`
  background-color: ${props => props.theme.colors.yellow3};
`
const ColorCodeNormal = styled(StyledColorCode)`
  background-color: ${props => props.theme.colors.cyan3};
`

const ColorCode = ({msmt}) => {
  if (msmt.confirmed === true) {
    return <ColorCodeConfirmed />
  //} else if (msmt.failure === true) {
  //  return <ColorCodeFailed />
  } else if (msmt.anomaly === true) {
    return <ColorCodeAnomaly />
  }
  return <ColorCodeNormal />
}
const ResultItem = ({msmt}) => (
  <ResultRow>
    <ColorCode msmt={msmt} />
    <ResultColumn grow={0.5}>
      {msmt.probe_cc}
    </ResultColumn>
    <ResultColumn grow={1}>
      <Flag alpha2={msmt.probe_cc} />
    </ResultColumn>
    <ResultColumn grow={1.5}>
      <ASNBox asn={msmt.probe_asn} />
    </ResultColumn>
    <ResultColumn grow={4}>
      <Flex column>
      <Box>
      {msmt.input &&
        <ResultInput>
          {msmt.input}
        </ResultInput>}
      </Box>
      <Box>{msmt.testName}</Box>
      </Flex>
    </ResultColumn>
    <ResultColumn grow={2}>
      {moment(msmt.measurement_start_time).format('YYYY-MM-DD')}
    </ResultColumn>
    <ResultColumn grow={2}>
      <ResultTag msmt={msmt} />
    </ResultColumn>
    <ResultColumn grow={2}>
      <ViewDetailsLink reportId={msmt.report_id} input={msmt.input} />
    </ResultColumn>
  </ResultRow>
)

const ResultTable = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  margin: 8px;
  line-height: 1.5;
`

const ResultsList = ({measurements, testNamesKeyed}) => {
  return (
    <ResultTable>
    {measurements.results.map((msmt, idx) => {
      if (msmt.input && msmt.input.length > inputTrunc) {
        msmt.input = `${msmt.input.substr(0, inputTrunc - 10)}…${msmt.input.substr(msmt.input.length - 10, msmt.input.length)}`
      }
      msmt.testName = testNamesKeyed[msmt.test_name]
      return <div key={idx}>
        <Divider />
        <ResultItem msmt={msmt} />
      </div>
    })}
    </ResultTable>
  )
}

const PreviousPage = styled.div`
  cursor: pointer;
`

const NextPage = styled.div`
  cursor: pointer;
`

const Pagination = ({currentPage, totalPages, goToPage, showCount, onShowCount}) => (
  <Flex align='baseline' justify='space-around' pb={3}>
    <Box>
    <Flex>
    <Box styled={{width: '100px'}} pr={2}>
    {currentPage > 1
    && <PreviousPage onClick={goToPage(currentPage - 1)}>
        &lsaquo; Previous Page
    </PreviousPage>
    }
    </Box>
    <Box>
    {currentPage}/{totalPages === -1 ? '?' : totalPages }
    </Box>
    <Box styled={{width: '100px'}} pl={2}>
    {(totalPages == -1 || totalPages > currentPage)
    && <NextPage onClick={goToPage(currentPage + 1)}>
    Next Page &rsaquo;
    </NextPage>
    }
    </Box>
    </Flex>
    </Box>
  </Flex>
)

const StyledLoader = styled.div`
  width: 100%;
  padding-bottom: 100px;
  display: ${props => props.loading === true ? 'block' : 'none'};
`

const Loader = ({loading}) => (
  <StyledLoader loading={loading}>
    <Flex align='baseline' justify='space-around'>
    <Box>
      <Flex column>
      <Box style={{height: '200px'}}>
      <BarLoader />
      </Box>
      <Box style={{textAlign: 'center'}}>
      <Heading h={3}>Loading</Heading>
      </Box>
      </Flex>
    </Box>
    </Flex>
  </StyledLoader>
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
      nextUrl = measurements.metadata.next_url;

    let showCount = 50;
    if (url.query.show) {
      showCount = parseInt(url.query.show)
    }

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
            <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={this.goToPage} />
          </Box>
        </Flex>
        </Container>
      </Layout>
    )
  }
}
