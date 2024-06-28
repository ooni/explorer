import NLink from 'next/link'
import { Button } from 'ooni-components'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import HighlightBox from './HighlightBox'

const HighlightSection = ({ title, highlights, description }) => {
  const intl = useIntl()

  return (
    <section>
      <div className="mt-8 mb-4 font-bold text-blue-1000 text-2xl bebebe">
        {title}
      </div>
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
                  <NLink href={item.explore}>
                    <Button type="button" hollow size="small">
                      {intl.formatMessage({ id: 'Home.Highlights.Explore' })}
                    </Button>
                  </NLink>
                )}
                {item.report && (
                  <NLink href={item.report}>
                    <Button type="button" hollow size="small">
                      {intl.formatMessage({ id: 'Home.Highlights.ReadReport' })}
                    </Button>
                  </NLink>
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
