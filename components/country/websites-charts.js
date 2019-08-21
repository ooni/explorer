import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Heading, Text, Link } from 'ooni-components'
import axios from 'axios'
import URLChart from './url-chart'
import ASNSelector from './asn-selector'
import { WebsiteSectionLoader } from './WebsiteChartLoader'

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

  // This is dead code now. Made so to ensure the loader
  // is rendered even when <ASNSelector> is not ready to render because
  // list of networks is still being fetched by the parent component.
  // This prevents the jump in the layout.
  //
  // componentDidMount() {
  //   if (this.props.network !== null) {
  //     this.fetchUrlsInNetwork()
  //   }
  // }

  componentDidUpdate() {
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
    const { network, countryCode, networks, onNetworkChange } = this.props
    const { testedUrlsCount, testedUrls, currentPage, resultsPerPage, fetching } = this.state

    const renderLoader = () => (
      <Flex my={3}>
        <Box>
          <WebsiteSectionLoader />
        </Box>
      </Flex>
    )

    return (
      <React.Fragment>
        {/* <Heading h={4}><FormattedMessage id='Country.Websites.Heading.BlockedByCategory' /></Heading> */}
        {/* <FormattedMessage id='Country.Websites.BlockedByCategory.Description'
          defaultMessage='Websites that fall under the following categories are blocked in the {selectedASN} Network. To examine whether other types of websites are blocked as well, run OONI Probe!'
          values={{
            selectedASN: <b>{'AS'+network}</b>
          }}
        /> */}
        {/* Category Selection */}
        <Flex justifyContent='space-between' alignItems='center' my={3}>
          {(network !== null && networks !== null) ?
            <React.Fragment>
              <Box>
                <ASNSelector selectedNetwork={network} networks={networks} onNetworkChange={onNetworkChange} />
              </Box>
              <Box>
                <strong>{testedUrlsCount}</strong> <FormattedMessage id='Country.Websites.TestedWebsitesCount' />
              </Box>
            </React.Fragment>
          :
          <Box my={2}></Box>
          }
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
        {fetching && renderLoader()}
        {(!fetching && testedUrls) &&
          testedUrls.map((testedUrl, index) => (
            <URLChart key={index} metadata={testedUrl} network={network} countryCode={countryCode} />
          ))}
        {(!fetching && testedUrlsCount > 0) && <Flex flexWrap='wrap' justifyContent='space-between' alignItems='center'>
          <Link color='blue7' href='javascript:void(0)' onClick={() => this.prevPage()}>{'< '}<FormattedMessage id='Country.Websites.URLCharts.Pagination.Previous' /></Link>
          <Text>{currentPage} of { Math.ceil(testedUrlsCount / resultsPerPage)} pages</Text>
          <Link color='blue7' href='javascript:void(0)' onClick={() => this.nextPage()}><FormattedMessage id='Country.Websites.URLCharts.Pagination.Next' />{' >'}</Link>
        </Flex>}
        {/* URL-wise barcharts End */}
      </React.Fragment>
    )
  }
}

export default TestsByCategoryInNetwork
