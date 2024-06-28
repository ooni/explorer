import Markdown from 'markdown-to-jsx'
import { Heading } from 'ooni-components'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { getLocalisedRegionName } from 'utils/i18nCountries'

import Flag from '../Flag'

const HighlightBox = ({ countryCode, title, text, dates, footer }) => {
  const intl = useIntl()

  return (
    <div className="flex py-8 px-6 flex-col justify-between border border-gray-400 border-l-[10px] border-l-blue-600 min-h-[328px]">
      <div>
        {countryCode && (
          <div className="flex items-center">
            <Flag countryCode={countryCode} size={32} />
            <Heading h={28} ml={2} my={0}>
              {getLocalisedRegionName(countryCode, intl.locale)}
            </Heading>
          </div>
        )}
        {dates}
        {/* <Text color="gray6">{startDate && formatLongDate(startDate, intl.locale)} - {endDate ? formatLongDate(endDate, intl.locale) : 'ongoing'}</Text> */}
        <h4>{title}</h4>
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
