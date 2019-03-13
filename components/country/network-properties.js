import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Heading, Input } from 'ooni-components'

import SectionHeader from './section-header'
import { SimpleBox } from './box'

const NetworkPropertiesSection = ({
  testedUrls
}) => (
  <React.Fragment>
    <SectionHeader>
      <SectionHeader.Title name='network-properties' >
        <FormattedMessage id='Country.Heading.NetworkProperties' />
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
      <FormattedMessage id='Country.NetworkProperties.Description' />
    </SimpleBox>
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
    </SimpleBox>
    {/* Network-wise infoboxes */}
    <Heading h={4}><FormattedMessage id='Country.NetworkProperties.Heading.Networks' /></Heading>
    <SimpleBox>
      <Flex flexDirection='column'>
        <FormattedMessage id='Country.NetworkProperties.InfoBox.Label.AverageStreaming' />
        <FormattedMessage id='Country.NetworkProperties.InfoBox.Label.AveragePing' />
        <FormattedMessage id='Country.NetworkProperties.InfoBox.Units.Milliseconds' />
        <FormattedMessage id='Country.NetworkProperties.InfoBox.Label.Middleboxes.Found' />
        <FormattedMessage id='Country.NetworkProperties.InfoBox.Label.Middleboxes.NotFound' />
      </Flex>
    </SimpleBox>
    <FormattedMessage id='Country.NetworkProperties.Button.ShowMore' />

  </React.Fragment>
)

export default NetworkPropertiesSection
