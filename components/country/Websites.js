import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'

import Chart from 'components/Chart'
import FormattedMarkdown from '../FormattedMarkdown'
import ConfirmedBlockedCategory from './ConfirmedBlockedCategory'

const WebsitesSection = ({ countryCode }) => {
  const router = useRouter()
  const {
    query: { since, until },
  } = router

  const query = useMemo(
    () => ({
      axis_y: 'domain',
      axis_x: 'measurement_start_day',
      probe_cc: countryCode,
      since,
      until,
      test_name: 'web_connectivity',
      time_grain: 'day',
    }),
    [countryCode, since, until],
  )

  return (
    <>
      <div
        id="websites"
        className="h-[200px] mt-[-200px] md:h-[200px] md:mt-[-200px]"
      />
      <h2 className="mt-8">
        <FormattedMessage id="Country.Heading.Websites" />
      </h2>
      <div className="mt-2 bg-gray-50 px-4 py-2 text-sm">
        <FormattedMarkdown id="Country.Websites.Description" />
      </div>
      <ConfirmedBlockedCategory />
      <div className="my-8">
        <Chart testName="web_connectivity" queryParams={query} />
      </div>
    </>
  )
}

export default WebsitesSection
