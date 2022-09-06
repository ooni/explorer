import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Text } from 'ooni-components'

import SectionHeader from './SectionHeader'
import { SimpleBox } from './boxes'
import ChartCountry from './ChartCountry'
import FormattedMarkdown from '../FormattedMarkdown'

const messagingTestNames = ['signal', 'telegram', 'whatsapp', 'facebook_messenger']
const circumventionTestNames = ['vanilla_tor', 'psiphon', 'tor', 'torsf']

const ChartsContainer = () => {
  const intl = useIntl()

  return (
    <>
      <ChartCountry
        testGroup={{name: 'messaging_apps', tests: messagingTestNames}}
        title={intl.formatMessage({id: 'Tests.Groups.Instant Messagging.Name'})}
      />
      <ChartCountry
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
    </SectionHeader>
    <SimpleBox>
      <Text fontSize={16}>
        <FormattedMarkdown id='Country.Apps.Description' />
      </Text>
    </SimpleBox>
    <ChartsContainer />
  </>
)

export default AppsSection
