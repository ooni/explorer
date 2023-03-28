import { useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Text, Box } from 'ooni-components'

import SectionHeader from './SectionHeader'
import { SimpleBox } from './boxes'
import Chart from 'components/Chart'
import FormattedMarkdown from '../FormattedMarkdown'
import { useRouter } from 'next/router'

const messagingTestNames = ['signal', 'telegram', 'whatsapp', 'facebook_messenger']
const circumventionTestNames = ['psiphon', 'tor', 'torsf']

const ChartsContainer = () => {
  const intl = useIntl()
  const router = useRouter()
  const { query: { since, until, countryCode } } = router

  const queryMessagingApps = useMemo(() => ({
    axis_y: 'test_name',
    axis_x: 'measurement_start_day',
    probe_cc: countryCode,
    since,
    until,
    time_grain: 'day',
    test_name: messagingTestNames
  }), [countryCode, since, until])

  const queryCircumventionTools = useMemo(() => ({
    axis_y: 'test_name',
    axis_x: 'measurement_start_day',
    probe_cc: countryCode,
    since,
    until,
    time_grain: 'day',
    test_name: circumventionTestNames
  }), [countryCode, since, until])

  return (
    <>
      <Box mt={3}>
        <Chart
          title={intl.formatMessage({id: 'Tests.Groups.Instant Messagging.Name'})}
          queryParams={queryMessagingApps}
        />
      </Box>
      <Box mt={3}>
        <Chart
          title={intl.formatMessage({id: 'Tests.Groups.Circumvention.Name'})}
          queryParams={queryCircumventionTools}
        />
      </Box>
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
