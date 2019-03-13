import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Heading, Input } from 'ooni-components'

import SectionHeader from './section-header'
import { SimpleBox } from './box'

const WebsitesSection = ({
  testedUrls
}) => (
  <React.Fragment>
    <SectionHeader>
      <SectionHeader.Title name='websites' >
        <FormattedMessage id='Country.Heading.Websites' />
      </SectionHeader.Title>
      <Flex flexDirection='column'>
        <FormattedMessage id='Country.PeriodFilter.Label' />
        <FormattedMessage id='Country.PeriodFilter.Option.30Days' />
        <FormattedMessage id='Country.PeriodFilter.Option.2Months' />
        <FormattedMessage id='Country.PeriodFilter.Option.3Months' />
        <FormattedMessage id='Country.PeriodFilter.Option.6Months' />
      </Flex>
    </SectionHeader>
    <SimpleBox>
      <FormattedMessage id='Country.Websites.SummaryText' />
      {/* Why rel='noopener noreferrer'? See: https://mathiasbynens.github.io/rel-noopener/ */}
      <a href='https://ooni.io' target='_blank' rel='noopener noreferrer'>
        <FormattedMessage id='Country.Websites.SummaryText.MoreLinkText' />
      </a>
    </SimpleBox>

    <Heading h={4}><FormattedMessage id='Country.Websites.Heading.BlockedByCategory' /></Heading>
    <FormattedMessage id='Country.Websites.BlockedByCategory.Description'
      defaultMessage='Websites that fall under the following categories are blocked in the {selectedASN} Network. To examine whether other types of websites are blocked as well, run OONI Probe!'
    />
    {/* Category Selection */}
    {testedUrls} <FormattedMessage id='Country.Websites.TestedWebsitesCount' />
    <FormattedMessage id='Country.Websites.Labels.ResultsPerPage' />
    {/* Results per page dropdown */}
    <FormattedMessage id='Country.Websites.URLSearch.Placeholder'>
      {(msg) => (
        <Input
          name='searchByURL'
          placeholder={msg}
        />
      )}
    </FormattedMessage>
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

export default WebsitesSection
