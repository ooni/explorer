import { FormattedMessage } from 'react-intl'
import { FeaturedArticle } from './country/Overview'
import { BoxWithTitle } from './country/boxes'

const ReportsSection = ({ title, reports }) => {
  return (
    <BoxWithTitle title={title}>
      {/* <section className="my-12"> */}
      {/* <h3>{title}</h3> */}
      {reports?.length === 0 ? (
        <FormattedMessage id="Country.Overview.FeaturedResearch.None" />
      ) : (
        <ul>
          {reports?.map((article, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <li key={index}>
              <FeaturedArticle link={article.href} title={article.title} />
            </li>
          ))}
        </ul>
      )}
    </BoxWithTitle>
  )
}

export default ReportsSection
