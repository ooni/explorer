import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { BoxWithTitle } from './country/boxes'
import { FeaturedArticle, OONI_BLOG_BASE_URL } from './country/Overview'
import ReportBox from './ReportBox'

const ooniOrgPath = {
  human_rights: 'human-rights',
  circumvention: 'circumvention',
  social_media: 'social-media-im',
  news_media: 'news-media',
}
const ReportsSection = ({ title, reports, theme }) => {
  return (
    <section className="mb-12">
      <h2>{title}</h2>
      {reports?.length === 0 ? (
        <FormattedMessage id="Country.Overview.FeaturedResearch.None" />
      ) : (
        <div className="grid my-8 gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {reports?.map((article, index) => (
            <ReportBox
              key={article.href}
              link={article.href}
              date={article.date}
              title={article.title}
            />
          ))}
          <div className="flex items-center justify-center px-4 text-center">
            <Link href={`${OONI_BLOG_BASE_URL}/reports/${ooniOrgPath[theme]}`}>
              See all related research reports »
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

export default ReportsSection
