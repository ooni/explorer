import { useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Text } from 'ooni-components'

import SectionHeader from './SectionHeader'
import { SimpleBox } from './boxes'
import Chart from 'components/Chart'
import FormattedMarkdown from '../FormattedMarkdown'
import { useRouter } from 'next/router'

const messagingTestNames = ['signal', 'telegram', 'whatsapp', 'facebook_messenger']
const circumventionTestNames = ['vanilla_tor', 'psiphon', 'tor', 'torsf']

const ChartsContainer = () => {
  const intl = useIntl()
  const router = useRouter()
  const { query: { since, until, countryCode } } = router

  const queryMessagingApps = useMemo(() => ({
    axis_x: 'measurement_start_day',
    probe_cc: countryCode,
    since,
    until,
  }), [countryCode, since, until])

  const queryCircumventionTools = useMemo(() => ({
    axis_x: 'measurement_start_day',
    probe_cc: countryCode,
    since,
    until,
  }), [countryCode, since, until])

  return (
    <>
      <Chart
        testGroup={{name: 'messaging_apps', tests: messagingTestNames}}
        title={intl.formatMessage({id: 'Tests.Groups.Instant Messagging.Name'})}
        queryParams={queryMessagingApps}
      />
      <Chart
        testGroup={{name: 'circumvention_tools', tests: circumventionTestNames}}
        title={intl.formatMessage({id: 'Tests.Groups.Circumvention.Name'})}
        queryParams={queryCircumventionTools}
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
