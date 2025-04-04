import BlockText from 'components/BlockText'
import Calendar from 'components/country/Calendar'
import { FormattedMessage, useIntl } from 'react-intl'
import FormattedMarkdown from '../FormattedMarkdown'
import { useCountry } from './CountryContext'
import SectionHeader from './SectionHeader'
import { BoxWithTitle } from './boxes'

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

  return (
    <>
      <SectionHeader>
        <SectionHeader.Title name="overview">
          <FormattedMessage id="Country.Heading.Overview" />
        </SectionHeader.Title>
      </SectionHeader>
      {/* <SummaryText> */}
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
      {/* </SummaryText> */}

      <h4 className="my-2">
        <FormattedMessage id="Country.Overview.Heading.TestsByClass" />
      </h4>
      <FormattedMarkdown id="Country.Overview.Heading.TestsByClass.Description" />
      <Calendar startYear={measuredSince} />
      <BoxWithTitle
        title={<FormattedMessage id="Country.Overview.FeaturedResearch" />}
      >
        {featuredArticles.length === 0 ? (
          <FormattedMessage id="Country.Overview.FeaturedResearch.None" />
        ) : (
          <ul>
            {featuredArticles.map((article, index) => (
              <li key={index}>
                <FeaturedArticle link={article.href} title={article.title} />
              </li>
            ))}
          </ul>
        )}
      </BoxWithTitle>
      {/* Highlight Box */}
    </>
  )
}
export default Overview
