import React from 'react'
import { inCountry } from './country-context'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Heading, Text, Input } from 'ooni-components'

import SectionHeader from './section-header'
import { SimpleBox } from './box'
import PeriodFilter from './period-filter'
import ASNSelector from './asn-selector'

const WebsitesSection = ({
  countryCode,
  onPeriodChange,
  testedUrls
}) => (
  <React.Fragment>
    <SectionHeader>
      <SectionHeader.Title name='websites'>
        <FormattedMessage id='Country.Heading.Websites' />
      </SectionHeader.Title>
      <Box ml='auto'>
        <PeriodFilter onChange={onPeriodChange} />
      </Box>
    </SectionHeader>
    <SimpleBox>
      <Text>
        <FormattedMessage id='Country.Websites.Description' />
      </Text>
      {/* Why rel='noopener noreferrer'? See: https://mathiasbynens.github.io/rel-noopener/ */}
      <a href='https://ooni.io' target='_blank' rel='noopener noreferrer'>
        <FormattedMessage id='Country.Websites.SummaryText.MoreLinkText' />
      </a>
    </SimpleBox>

    {/* Select ASN */}
    <ASNSelector onNetworkChange={() => {}} />

    <Heading h={4}><FormattedMessage id='Country.Websites.Heading.BlockedByCategory' /></Heading>
    <FormattedMessage id='Country.Websites.BlockedByCategory.Description'
      defaultMessage='Websites that fall under the following categories are blocked in the {selectedASN} Network. To examine whether other types of websites are blocked as well, run OONI Probe!'
    />
    {/* Category Selection */}
    {testedUrls} <FormattedMessage id='Country.Websites.TestedWebsitesCount' />
    <FormattedMessage id='Country.Websites.Labels.ResultsPerPage' />
    {/* Results per page dropdown */}
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
    <Flex flexDirection='column'>
      <FormattedMessage id='Country.Websites.URLCharts.Legend.Label.Blocked' />
      <FormattedMessage id='Country.Websites.URLCharts.Legend.Label.Anomaly' />
      <FormattedMessage id='Country.Websites.URLCharts.Legend.Label.Accessible' />
    </Flex>
    {/* Pagination */}
    <FormattedMessage id='Country.Websites.URLCharts.Pagination.Previous' />
    <FormattedMessage id='Country.Websites.URLCharts.Pagination.Next' />
    {/* URL-wise barcharts End */}
  </React.Fragment>
)

export default inCountry(WebsitesSection)
