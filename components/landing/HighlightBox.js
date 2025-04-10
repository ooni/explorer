import Markdown from 'markdown-to-jsx'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { getLocalisedRegionName } from 'utils/i18nCountries'

import Link from 'next/link'
import { formatLongDateUTC } from '../../utils'
import Flag from '../Flag'

const HighlightBox = ({ countryCode, title, text, dates, footer }) => {
  const intl = useIntl()

  return (
    <div className="flex py-8 px-6 flex-col justify-between border border-gray-300 border-l-[10px] border-l-blue-500">
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
        <div className="text-lg">
          <Markdown>{text}</Markdown>
        </div>
      </div>
      <div className="mt-6">{footer}</div>
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

export const FindingBox = ({ incident }) => {
  const intl = useIntl()

  return (
    <HighlightBox
      key={incident.id}
      countryCode={incident.CCs[0]}
      title={incident.title}
      text={incident.short_description}
      dates={
        <div className="text-gray-600">
          <div className=" mb-2">
            {incident.start_time &&
              formatLongDateUTC(incident.start_time, intl.locale)}{' '}
            -{' '}
            {incident.end_time
              ? formatLongDateUTC(incident.end_time, intl.locale)
              : 'ongoing'}
          </div>
          <div>
            {intl.formatMessage(
              { id: 'Findings.Index.HighLightBox.CreatedOn' },
              {
                date:
                  incident?.create_time &&
                  formatLongDateUTC(incident?.create_time, intl.locale),
              },
            )}
          </div>
        </div>
      }
      footer={
        <div className="mx-auto mt-4">
          <Link href={`/findings/${incident.id}`} prefetch={false}>
            <button className="btn btn-primary-hollow btn-sm" type="button">
              {intl.formatMessage({
                id: 'Findings.Index.HighLightBox.ReadMore',
              })}
            </button>
          </Link>
        </div>
      }
    />
  )
}

export const FindingBoxSmall = ({ incident }) => {
  const intl = useIntl()

  return (
    <Link
      href={`/findings/${incident.id}`}
      className="flex text-black"
      prefetch={false}
    >
      <HighlightBox
        key={incident.id}
        countryCode={incident.CCs[0]}
        title={incident.title}
        text={incident.short_description}
        dates={
          <div className="text-gray-600">
            <div className=" mb-2">
              {incident.start_time &&
                formatLongDateUTC(incident.start_time, intl.locale)}{' '}
              -{' '}
              {incident.end_time
                ? formatLongDateUTC(incident.end_time, intl.locale)
                : 'ongoing'}
            </div>
          </div>
        }
      />
    </Link>
  )
}
