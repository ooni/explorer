import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Heading, Text } from 'ooni-components'
import axios from 'axios'

import SectionHeader from './section-header'
import { SimpleBox } from './box'
import PeriodFilter from './period-filter'
import NetworkStats from './network-stats'
import SpinLoader from '../vendor/spin-loader'
import FormattedMarkdown from '../formatted-markdown'

const NETWORK_STATS_PER_PAGE = 4

class NetworkPropertiesSection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fetching: true,
      visibleNetworks: 0,
      data: [],
      currentPage: 0
    }
    this.showMoreNetworks = this.showMoreNetworks.bind(this)
  }

  showMoreNetworks() {
    // Ensure not to add more rows than available
    const { visibleNetworks, totalNetworks } = this.state

    let rowsToAdd = NETWORK_STATS_PER_PAGE

    if (visibleNetworks + NETWORK_STATS_PER_PAGE > totalNetworks) {
      rowsToAdd = totalNetworks - visibleNetworks
    }

    this.setState((state) => ({
      visibleNetworks: state.visibleNetworks + rowsToAdd
    }))
  }

  componentDidMount() {
    this.fetchNetworkStats()
  }

  componentDidUpdate(prevProps, prevState) {
    const { data, totalNetworks } = this.state
    if (prevState.data.length === data.length && data.length < totalNetworks) {
      this.fetchNetworkStats()
    }
  }

  async fetchNetworkStats() {
    const { countryCode } = this.props
    const { currentPage } = this.state
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const result = await client.get('/api/_/network_stats', {
      params: {
        probe_cc: countryCode,
        limit: NETWORK_STATS_PER_PAGE,
        offset: (currentPage > 0 ? currentPage : 0) * NETWORK_STATS_PER_PAGE
      }
    })

    this.setState((state) => ({
      data: [...state.data, ...result.data.results],
      totalNetworks: result.data.metadata.total_count,
      currentPage: result.data.metadata.current_page,
      fetching: false,
      visibleNetworks: state.data.length + result.data.results.length
    }))
  }

  renderStats() {
    const { fetching, visibleNetworks, totalNetworks, data } = this.state

    if (fetching) {
      return (<SpinLoader />)
    }
    const content = []

    for ( let i = 0; i < data.length && i < visibleNetworks; i++) {
      content.push(
        <NetworkStats
          key={i}
          asn={data[i].asn}
          asnName={data[i].asn_name}
          avgDownload={data[i].download_speed_mbps_median}
          avgUpload={data[i].upload_speed_mbps_median}
          avgPing={data[i].rtt_avg}
          middleboxes={data[i].middlebox_detected}
        />
      )
    }
    return (
      <React.Fragment>
        {content}
        {(visibleNetworks < totalNetworks) &&
          <Flex justifyContent='center'>
            <a href='javascript:void(0)' onClick={() => this.showMoreNetworks()}>
              <FormattedMessage id='Country.NetworkProperties.Button.ShowMore' />
            </a>
          </Flex>
        }
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <SectionHeader>
          <SectionHeader.Title name='network-properties' >
            <FormattedMessage id='Country.Heading.NetworkProperties' />
          </SectionHeader.Title>
          {/* <Box ml='auto'>
            <PeriodFilter onChange={() => {}} />
          </Box> */}
        </SectionHeader>
        <SimpleBox>
          <Text fontSize={16}>
            <FormattedMarkdown id='Country.NetworkProperties.Description' />
          </Text>
        </SimpleBox>
        {/* Country Level Summary
          <Heading h={4}><FormattedMessage id='Country.NetworkProperties.Heading.Summary' /></Heading>
          <SimpleBox>
          <Flex flexDirection='column'>
            <FormattedMessage id='Country.NetworkProperties.InfoBox.Label.AverageDownload' />
            <FormattedMessage id='Country.NetworkProperties.InfoBox.Label.AverageUpload' />
            <FormattedMessage id='Country.NetworkProperties.InfoBox.Label.Covered' />
            <FormattedMessage id='Country.NetworkProperties.InfoBox.Label.Middleboxes' />
            <FormattedMessage id='Country.NetworkProperties.InfoBox.Units.Mbits' />
            <FormattedMessage id='Country.NetworkProperties.InfoBox.Units.Networks.Singular' />
            <FormattedMessage id='Country.NetworkProperties.InfoBox.Units.Networks.Plural' />
          </Flex>
        </SimpleBox> */}
        {/* Network-wise infoboxes */}
        <Heading h={4}><FormattedMessage id='Country.NetworkProperties.Heading.Networks' /></Heading>
        {this.renderStats()}


      </React.Fragment>
    )
  }
}

export default NetworkPropertiesSection
