import Markdown from 'markdown-to-jsx'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { getLocalisedRegionName } from 'utils/i18nCountries'

import Flag from '../Flag'

const HighlightBox = ({ countryCode, title, text, dates, footer }) => {
  const intl = useIntl()

  return (
    <div className="flex py-8 px-6 flex-col justify-between border border-gray-300 border-l-[10px] border-l-blue-500 min-h-[328px]">
      <div>
        {countryCode && (
          <div className="flex items-center">
            <Flag countryCode={countryCode} size={32} />
            <h3 className="ml-2 my-0">
              {getLocalisedRegionName(countryCode, intl.locale)}
            </h3>
          </div>
        )}
        {dates}
        <h4 className="text-2xl my-2 leading-tight">{title}</h4>
        <p className="text-xl">
          <Markdown>{text}</Markdown>
        </p>
      </div>
      {footer}
    </div>
  )
}

HighlightBox.propTypes = {
  countryCode: PropTypes.string,
  countryName: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string.isRequired,
  footer: PropTypes.element,
  dates: PropTypes.element,
}

export default HighlightBox
