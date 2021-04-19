import React from 'react'
import { inCountry } from './CountryContext'
import { FormattedMessage } from 'react-intl'
import axios from 'axios'
import { Flex, Box, Heading, Text, theme } from 'ooni-components'

import SectionHeader from './SectionHeader'
import { SimpleBox } from './boxes'
import PeriodFilter from './PeriodFilter'
import TestsByCategoryInNetwork from './WebsitesCharts'
import FormattedMarkdown from '../FormattedMarkdown'
import Badge from '../Badge'

import * as icons from 'ooni-components/dist/icons'

const CATEGORY_CODES = {
  "ALDR": "Alcohol & Drugs",
  "REL": "Religion",
  "PORN": "Pornography",
  "PROV": "Provocative Attire",
  "POLR": "Political Criticism",
  "HUMR": "Human Rights Issues",
  "ENV": "Environment",
  "MILX": "Terrorism and Militants",
  "HATE": "Hate Speech",
  "NEWS": "News Media",
  "XED": "Sex Education",
  "PUBH": "Public Health",
  "GMB": "Gambling",
  "ANON": "Anonymization and circumvention tools",
  "DATE": "Online Dating",
  "GRP": "Social Networking",
  "LGBT": "LGBT",
  "FILE": "File-sharing",
  "HACK": "Hacking Tools",
  "COMT": "Communication Tools",
  "MMED": "Media sharing",
  "HOST": "Hosting and Blogging Platforms",
  "SRCH": "Search Engines",
  "GAME": "Gaming",
  "CULTR": "Culture",
  "ECON": "Economics",
  "GOVT": "Government",
  "COMM": "E-commerce",
  "CTRL": "Control content",
  "IGO": "Intergovernmental Organizations",
  "MISC": "Miscelaneous content",
}

const CategoryBadge = ({categoryCode}) => {
  const categoryDesc = CATEGORY_CODES[categoryCode]
  if (categoryDesc === undefined) {
    return <div/>
  }

  const CategoryIcon = icons[`CategoryCode${categoryCode}`]
  return (
    <Badge bg={theme.colors.gray6} color='white' style={{display: 'inline-block', marginRight: '10px'}}>
      <Flex alignItems='center'>
        <Box>
        <CategoryIcon size={32} />
        </Box>
        <Box>
        <Text>{categoryDesc}</Text>
        </Box>
      </Flex>
    </Badge>
  )
}

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
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
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
    // TODO these should be obtained by querying the aggregation API endpoint for the last month like so:
    // https://api.ooni.io/api/v1/aggregation?since=2021-03-19&until=2021-04-19&test_name=web_connectivity&axis_y=category_code&probe_cc=IR
    // It shall then include the category codes which have a confirmed_count > 0
    const blockedCategories = [
      'DATE',
      'ANON',
      'HUMR'
    ]
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
        
        <Box>
          <Heading h={4}>Confirmed blocked categories</Heading>
          {blockedCategories.map(categoryCode => (<CategoryBadge categoryCode={categoryCode} />))}
        </Box>

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
