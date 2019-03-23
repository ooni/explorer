import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Heading, Text } from 'ooni-components'
import axios from 'axios'
import URLChart from './url-chart'

const defaultState = {
  resultsPerPage: 5,
  testedUrlsCount: 0,
  testedUrls: null,
  fetching: true
}

class TestsByCategoryInNetwork extends React.Component {
  constructor(props) {
    super(props)
    this.state = defaultState
  }

  componentDidMount() {
    this.fetchUrlsInNetwork()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.testedUrls === null) {
      this.fetchUrlsInNetwork()
    }
  }

  async fetchUrlsInNetwork() {
    const { network, countryCode } = this.props
    const { resultsPerPage, currentPage } = this.state
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const result = await client.get('/api/_/website_urls', {
      params: {
        probe_cc: countryCode,
        probe_asn: network,
        limit: resultsPerPage,
        offset: (currentPage > 0 ? (currentPage - 1) : 0) * resultsPerPage
      }
    })
    this.setState({
      testedUrlsCount: result.data.metadata.total_count,
      testedUrls: result.data.results,
      currentPage: result.data.metadata.current_page,
      fetching: false
    })
  }

  prevPage() {
    this.setState((state) => ({
      currentPage: state.currentPage - 1
    }))
  }

  nextPage() {
    this.setState((state) => ({
      currentPage: state.currentPage + 1
    }))
  }

  static getDerivedStateFromProps(props, state) {
    if (props.network !== state.prevNetwork) {
      return {
        prevNetwork: props.network,
        currentPage: 1,
        prevPage: 1,
        ...defaultState
      }
    }
    if (state.currentPage !== state.prevPage) {
      return {
        prevPage: state.currentPage || 1,
        ...defaultState
      }
    }
    return null
  }

  render() {
    const { network, countryCode } = this.props
    const { testedUrlsCount, testedUrls, currentPage, resultsPerPage, fetching } = this.state

    if (fetching) {
      return (<Heading h={4}>Loading...</Heading>)
    }

    return (
      <React.Fragment>
        <Heading h={4}><FormattedMessage id='Country.Websites.Heading.BlockedByCategory' /></Heading>
        <FormattedMessage id='Country.Websites.BlockedByCategory.Description'
          defaultMessage='Websites that fall under the following categories are blocked in the {selectedASN} Network. To examine whether other types of websites are blocked as well, run OONI Probe!'
          values={{
            selectedASN: <b>{'AS'+network}</b>
          }}
        />
        {/* Category Selection */}
        <Flex justifyContent='space-between'>
          <Box my={3}>
            <strong>{testedUrlsCount}</strong> <FormattedMessage id='Country.Websites.TestedWebsitesCount' />
          </Box>
          {/* Results per page dropdown
            <Box>
            <FormattedMessage id='Country.Websites.Labels.ResultsPerPage' />
            </Box>
          */}
        </Flex>
        {/* Hide until API is available
          <FormattedMessage id='Country.Websites.URLSearch.Placeholder'>
          {(msg) => (
          <Input
          name='searchByURL'
          placeholder={msg}
          />
          )}
          </FormattedMessage>
        */}
        {/* URL-wise barcharts Start */}
        {testedUrls &&
          testedUrls.map((testedUrl, index) => (
            <URLChart key={index} metadata={testedUrl} network={network} countryCode={countryCode} />
          ))}
        <Flex flexWrap='wrap' justifyContent='space-around' alignItems='center'>
          <a href='javascript:void(0)' onClick={() => this.prevPage()}>{'< '}<FormattedMessage id='Country.Websites.URLCharts.Pagination.Previous' /></a>
          <Text>{currentPage} of { Math.ceil(testedUrlsCount / resultsPerPage)} pages</Text>
          <a href='javascript:void(0)' onClick={() => this.nextPage()}><FormattedMessage id='Country.Websites.URLCharts.Pagination.Next' />{' >'}</a>
        </Flex>
        {/* URL-wise barcharts End */}
      </React.Fragment>
    )
  }
}

export default TestsByCategoryInNetwork
