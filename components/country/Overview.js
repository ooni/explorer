import BlockText from 'components/BlockText'
import Calendar from 'components/country/Calendar'
import { FormattedMessage, useIntl } from 'react-intl'
import FormattedMarkdown from '../FormattedMarkdown'
import { useCountry } from './CountryContext'
import { BoxWithTitle } from './boxes'
import ReportsSection from 'components/ReportsSection'
import FindingsSection from 'components/FindingsSection'
import useFindings from 'hooks/useFindings'

export const OONI_BLOG_BASE_URL = 'https://ooni.org'

export const FeaturedArticle = ({ link, title }) => (
  <div className="py-1">
    <a
      className="text-blue-700"
      href={OONI_BLOG_BASE_URL + link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {title}
    </a>
  </div>
)

const Overview = ({
  countryName,
  networkCount,
  measurementCount,
  measuredSince,
  featuredArticles = [],
}) => {
  const intl = useIntl()
  const { countryCode } = useCountry()
  const {
    sortedAndFilteredData: findings,
    isLoading,
    error: findingsError,
  } = useFindings({
    params: { country_code: countryCode },
  })

  return (
    <>
      <BlockText className="my-4">
        <FormattedMarkdown
          id="Country.Overview.SummaryTextTemplate"
          values={{
            measurementCount: intl.formatNumber(measurementCount),
            linkToMeasurements: `/search?probe_cc=${countryCode}`,
            countryName,
            networkCovered: intl.formatNumber(networkCount),
          }}
        />
      </BlockText>

      <h4 className="my-2">
        <FormattedMessage id="Country.Overview.Heading.TestsByClass" />
      </h4>
      <div className="my-6 bg-gray-50 px-4 py-2 text-sm">
        <FormattedMarkdown id="Country.Overview.Heading.TestsByClass.Description" />
      </div>
      <Calendar startYear={measuredSince} />
      <FindingsSection
        title={intl.formatMessage({ id: 'ThematicPage.NavBar.Findings' })}
        findings={findings}
      />
      <ReportsSection
        title={intl.formatMessage({ id: 'Country.Overview.FeaturedResearch' })}
        reports={featuredArticles}
      />
    </>
  )
}
export default Overview
