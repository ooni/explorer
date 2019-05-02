import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text } from 'ooni-components'

import SectionHeader from './section-header'
import { SimpleBox } from './box'
import PeriodFilter from './period-filter'
import AppsStatsGroup from './apps-stats'
import AppsStatsCircumvention from './apps-stats-circumvention'
import FormattedMarkdown from '../formatted-markdown'

const AppsSection = () => (
  <React.Fragment>
    <SectionHeader>
      <SectionHeader.Title name='apps'>
        <FormattedMessage id='Country.Heading.Apps' />
      </SectionHeader.Title>
      {/* <Box ml='auto'>
        <PeriodFilter onChange={onPeriodChange} />
      </Box> */}
    </SectionHeader>
    <SimpleBox>
      <Text fontSize={16}>
        <FormattedMarkdown id='Country.Apps.Description' />
      </Text>
    </SimpleBox>
    {/* App-wise graphs */}
    <AppsStatsGroup
      title={<FormattedMessage id='Country.Overview.TestsByClass.InstantMessaging' />}
      testGroup='im'
    />
    {<AppsStatsCircumvention
      title={<FormattedMessage id='Country.Overview.TestsByClass.Circumvention'/>}
      testGroup='circumvention'
    />}
  </React.Fragment>
)

export default AppsSection
