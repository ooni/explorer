import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Text } from 'ooni-components'

import SectionHeader from './SectionHeader'
import { SimpleBox } from './boxes'
// import PeriodFilter from './PeriodFilter'
import AppsStatsGroup from './AppsStats'
import AppsStatsCircumvention from './AppsStatsCircumvention'
import Chart from './Chart'
import FormattedMarkdown from '../FormattedMarkdown'

const messagingTestNames = ['signal', 'telegram', 'whatsapp', 'facebook_messenger']
const circumventionTestNames = ['vanilla_tor', 'psiphon', 'tor', 'torsf']

const ChartsContainer = () => {
  const intl = useIntl()

  return (
    <>
      <Chart
        testGroup={{name: 'messaging_apps', tests: messagingTestNames}}
        title={intl.formatMessage({id: 'Tests.Groups.Instant Messagging.Name'})}
      />
      <Chart
        testGroup={{name: 'circumvention_tools', tests: circumventionTestNames}}
        title={intl.formatMessage({id: 'Tests.Groups.Circumvention.Name'})}
      />
    </>
  )
}

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
    <ChartsContainer />
    {/* <AppsStatsGroup
      title={<FormattedMessage id='Country.Overview.TestsByClass.InstantMessaging' />}
      testGroup='im'
    />
    {<AppsStatsCircumvention
      title={<FormattedMessage id='Country.Overview.TestsByClass.Circumvention'/>}
      testGroup='circumvention'
    />} */}
  </>
)

export default AppsSection
