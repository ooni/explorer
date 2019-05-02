import React from 'react'
import { inCountry } from './country-context'
import { FormattedMessage } from 'react-intl'
import axios from 'axios'
import { Flex, Box, Heading, Text, Input } from 'ooni-components'

import SectionHeader from './section-header'
import { SimpleBox } from './box'
import PeriodFilter from './period-filter'
import ASNSelector from './asn-selector'
import TestsByCategoryInNetwork from './websites-charts'
import FormattedMarkdown from '../formatted-markdown'

class WebsitesSection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedNetwork: null,
      networks: []
    }
    this.onNetworkChange = this.onNetworkChange.bind(this)
  }

  onNetworkChange(asn) {
    this.setState({
      selectedNetwork: asn
    })
  }

  async componentDidMount() {
    const { countryCode } = this.props
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const result = await client.get('/api/_/website_networks', {
      params: {
        probe_cc: countryCode
      }
    })
    this.setState({
      networks: result.data.results,
      selectedNetwork: result.data.results[0].probe_asn
    })
  }

  render () {
    const { onPeriodChange, countryCode } = this.props
    const { selectedNetwork } = this.state
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
          {/* Select ASN */}
          <ASNSelector onNetworkChange={this.onNetworkChange} networks={this.state.networks} />

          {selectedNetwork &&
            <TestsByCategoryInNetwork
              network={selectedNetwork}
              countryCode={countryCode}
            />
          }
        </Box>
      </React.Fragment>
    )
  }
}

export default inCountry(WebsitesSection)
