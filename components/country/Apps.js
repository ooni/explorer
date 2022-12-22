import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text } from 'ooni-components'

import SectionHeader from './SectionHeader'
import { SimpleBox } from './boxes'
// import PeriodFilter from './PeriodFilter'
import AppsStatsGroup from './AppsStats'
import AppsStatsCircumvention from './AppsStatsCircumvention'
import FormattedMarkdown from '../FormattedMarkdown'

const AppsSection = () => (
  <>
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
  </>
)

export default AppsSection
