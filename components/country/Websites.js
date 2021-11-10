import React from 'react'
import { inCountry } from './CountryContext'
import { FormattedMessage } from 'react-intl'
import axios from 'axios'
import { Flex, Box, Heading, Text, Input } from 'ooni-components'

import SectionHeader from './SectionHeader'
import { SimpleBox } from './boxes'
import PeriodFilter from './PeriodFilter'
import TestsByCategoryInNetwork from './WebsitesCharts'
import FormattedMarkdown from '../FormattedMarkdown'
import { axiosPluginLogRequest } from 'components/axios-plugins'

class WebsitesSection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      noData: false,
      selectedNetwork: null,
      networks: []
    }
    this.onNetworkChange = this.onNetworkChange.bind(this)
  }

  onNetworkChange(asn) {
    this.setState({
      selectedNetwork: Number(asn)
    })
  }

  async componentDidMount() {
    const { countryCode } = this.props
    const client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL}) // eslint-disable-line
    axiosPluginLogRequest(client)
    const result = await client.get('/api/_/website_networks', {
      params: {
        probe_cc: countryCode
      }
    })
    if (result.data.results.length > 0) {
      this.setState({
        networks: result.data.results,
        selectedNetwork: Number(result.data.results[0].probe_asn)
      })
    } else {
      this.setState({
        noData: true,
        networks: null
      })
    }
  }

  render () {
    const { onPeriodChange, countryCode } = this.props
    const { noData, selectedNetwork } = this.state
    return (
      <React.Fragment>
        <SectionHeader>
          <SectionHeader.Title name='websites'>
            <FormattedMessage id='Country.Heading.Websites' />
          </SectionHeader.Title>
        </SectionHeader>
        {/* <Box ml='auto'>
            <PeriodFilter onChange={onPeriodChange} />
        </Box> */}
        <SimpleBox>
          <Text fontSize={16}>
            <FormattedMarkdown id='Country.Websites.Description' />
          </Text>
        </SimpleBox>

        <Box my={4}>
          {noData &&
            <Text fontSize={18} color='gray6'>
              <FormattedMessage id='Country.Label.NoData' />
            </Text>
          }
          <TestsByCategoryInNetwork
            network={selectedNetwork}
            countryCode={countryCode}
            onNetworkChange={this.onNetworkChange}
            networks={this.state.networks}
          />
        </Box>
      </React.Fragment>
    )
  }
}

export default inCountry(WebsitesSection)
