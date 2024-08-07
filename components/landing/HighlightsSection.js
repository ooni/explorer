import Link from 'next/link'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import HighlightBox from './HighlightBox'

const HighlightSection = ({ title, highlights, description }) => {
  const intl = useIntl()

  return (
    <section>
      <div className="mt-8 mb-4 font-bold text-blue-900 text-2xl">{title}</div>
      {/* Optional Description */}
      {description && <div className="mt-8 mb-4 text-xl">{description}</div>}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* HighlightBoxes */}
        {highlights.map((item, index) => (
          <HighlightBox
            key={index}
            title={item.title ? intl.formatMessage({ id: item.title }) : ''}
            text={item.text ? intl.formatMessage({ id: item.text }) : ''}
            countryCode={item.countryCode}
            footer={
              <div className="flex justify-between">
                {item.explore && (
                  <Link href={item.explore}>
                    <button
                      className="btn btn-primary-hollow btn-sm"
                      type="button"
                    >
                      {intl.formatMessage({ id: 'Home.Highlights.Explore' })}
                    </button>
                  </Link>
                )}
                {item.report && (
                  <Link href={item.report}>
                    <button
                      className="btn btn-primary-hollow btn-sm"
                      type="button"
                    >
                      {intl.formatMessage({ id: 'Home.Highlights.ReadReport' })}
                    </button>
                  </Link>
                )}
              </div>
            }
          />
        ))}
      </div>
    </section>
  )
}

HighlightSection.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      countryCode: PropTypes.string.isRequired,
      title: PropTypes.string,
      text: PropTypes.string,
      report: PropTypes.string,
      explore: PropTypes.string,
    }),
  ),
}

export default HighlightSection
