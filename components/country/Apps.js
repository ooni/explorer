import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import Chart from 'components/Chart'
import FormattedMarkdown from '../FormattedMarkdown'

const messagingTestNames = [
  'signal',
  'telegram',
  'whatsapp',
  'facebook_messenger',
]
const circumventionTestNames = ['psiphon', 'tor', 'torsf']

const ChartsContainer = () => {
  const intl = useIntl()
  const router = useRouter()
  const {
    query: { since, until, countryCode },
  } = router

  const queryMessagingApps = useMemo(
    () => ({
      axis_y: 'test_name',
      axis_x: 'measurement_start_day',
      probe_cc: countryCode,
      since,
      until,
      time_grain: 'day',
      test_name: messagingTestNames,
    }),
    [countryCode, since, until],
  )

  const queryCircumventionTools = useMemo(
    () => ({
      axis_y: 'test_name',
      axis_x: 'measurement_start_day',
      probe_cc: countryCode,
      since,
      until,
      time_grain: 'day',
      test_name: circumventionTestNames,
    }),
    [countryCode, since, until],
  )

  return (
    <>
      <div className="mt-4">
        <Chart
          title={intl.formatMessage({
            id: 'Tests.Groups.Instant Messagging.Name',
          })}
          queryParams={queryMessagingApps}
        />
      </div>
      <div className="mt-4">
        <Chart
          title={intl.formatMessage({ id: 'Tests.Groups.Circumvention.Name' })}
          queryParams={queryCircumventionTools}
        />
      </div>
    </>
  )
}

const AppsSection = () => (
  <>
    <h2 name="apps">
      <FormattedMessage id="Country.Heading.Apps" />
    </h2>
    <div className="mt-2 bg-gray-50 px-4 py-2 text-sm">
      <FormattedMarkdown id="Country.Apps.Description" />
    </div>
    <ChartsContainer />
  </>
)

export default AppsSection
