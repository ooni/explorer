import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Heading } from 'ooni-components'

import SectionHeader from './section-header'
import { SimpleBox } from './box'

const AppsSection = () => (
  <React.Fragment>
    <SectionHeader>
      <SectionHeader.Title name='apps'>
        <FormattedMessage id='Country.Heading.Apps' />
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
      <FormattedMessage id='Country.Apps.Description' />
    </SimpleBox>
    {/* App-wise graphs */}
    <FormattedMessage id='Country.Apps.Label.LastTested' />
    <FormattedMessage id='Country.Apps.Button.ShowMore' />
  </React.Fragment>
)

export default AppsSection
