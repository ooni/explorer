import Chart from 'components/Chart'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedMarkdown from '../FormattedMarkdown'
import ConfirmedBlockedCategory from './ConfirmedBlockedCategory'
import SectionHeader from './SectionHeader'
import { SimpleBox } from './boxes'

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
      <SectionHeader>
        <SectionHeader.Title name="websites">
          <FormattedMessage id="Country.Heading.Websites" />
        </SectionHeader.Title>
      </SectionHeader>
      <SimpleBox>
        <FormattedMarkdown id="Country.Websites.Description" />
      </SimpleBox>
      <ConfirmedBlockedCategory />
      <div className="my-8">
        <Chart testName="web_connectivity" queryParams={query} />
      </div>
    </>
  )
}

export default WebsitesSection
