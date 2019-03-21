import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Heading, theme } from 'ooni-components'
import styled from 'styled-components'

import SectionHeader from './section-header'
import { SimpleBox } from './box'
import PeriodFilter from './period-filter'
import AppsStatsGroup from './apps-stats-group'

const AppsSection = ({ onPeriodChange }) => (
  <React.Fragment>
    <SectionHeader>
      <SectionHeader.Title name='apps'>
        <FormattedMessage id='Country.Heading.Apps' />
      </SectionHeader.Title>
      <Box ml='auto'>
        <PeriodFilter onChange={onPeriodChange} />
      </Box>
    </SectionHeader>
    <SimpleBox>
      <FormattedMessage id='Country.Apps.Description' />
    </SimpleBox>
    {/* App-wise graphs */}
    <AppsStatsGroup
      title={<FormattedMessage id='Country.Overview.TestsByClass.InstantMessaging' />}
      testGroup='im'
    />
    {/* <AppsStatGroup
      title={<FormattedMessage id='Country.Overview.TestsByClass.Circumvention'/>}
      testGroup='circumvention'
    /> */}
    <FormattedMessage id='Country.Apps.Label.LastTested' />
    <FormattedMessage id='Country.Apps.Button.ShowMore' />
  </React.Fragment>
)

export default AppsSection
