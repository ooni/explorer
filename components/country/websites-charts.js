import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Heading } from 'ooni-components'
import axios from 'axios'
import URLChart from './url-chart'

class TestsByCategoryInNetwork extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0,
      resultsPerPage: 10,
      testedUrlsCount: 0,
      testedUrls: []
    }
  }
  async componentDidMount() {
    this.fetchUrlsInNetwork()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.network !== this.props.network
      || prevState.currentPage !== this.state.currentPage) {
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
      currentPage: result.data.metadata.current_page

    })
  }
  render() {
    const { network, countryCode } = this.props
    const { testedUrlsCount, testedUrls, currentPage, resultsPerPage } = this.state
    return (
      <React.Fragment>
        <Heading h={4}><FormattedMessage id='Country.Websites.Heading.BlockedByCategory' /></Heading>
        <FormattedMessage id='Country.Websites.BlockedByCategory.Description'
          defaultMessage='Websites that fall under the following categories are blocked in the {selectedASN} Network. To examine whether other types of websites are blocked as well, run OONI Probe!'
        />
        {/* Category Selection */}
        <Flex justifyContent='space-between'>
          <Box>
            <strong>{testedUrlsCount}</strong> <FormattedMessage id='Country.Websites.TestedWebsitesCount' />
          </Box>
          <Box>
            <FormattedMessage id='Country.Websites.Labels.ResultsPerPage' />
            {/* Results per page dropdown */}
          </Box>
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
        </Flex>
        {/* Pagination */}
        <FormattedMessage id='Country.Websites.URLCharts.Pagination.Previous' />
        <FormattedMessage id='Country.Websites.URLCharts.Pagination.Next' />
        {/* URL-wise barcharts End */}
      </React.Fragment>
    )
  }
}

export default TestsByCategoryInNetwork
