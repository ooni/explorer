import { Badge } from 'components/Badge'
import Flag from 'components/Flag'
import { MATChartWrapper } from 'components/MATChart'
import Markdown from 'markdown-to-jsx'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { formatLongDate } from 'utils'
import { getLocalisedRegionName } from 'utils/i18nCountries'

const FormattedMarkdown = ({ children }) => {
  return (
    <Markdown
      options={{
        overrides: {
          MAT: {
            component: MATChartWrapper,
          },
        },
      }}
    >
      {children}
    </Markdown>
  )
}

const FindingDisplay = ({ incident }) => {
  const intl = useIntl()

  const reportedBy = incident?.reported_by
  const formattedCreationDate =
    incident?.create_time && formatLongDate(incident?.create_time, intl.locale)
  const listOfNetworks = incident?.ASNs?.map((as) => (
    <Link key={as} href={`/as/AS${as}`}>{`AS${as}`}</Link>
  )).reduce((prev, curr) => (prev ? [prev, ', ', curr] : curr), null)

  return (
    <>
      <h1 className="my-8 pb-4 border-b border-gray-300">{incident?.title}</h1>
      {!!incident?.CCs?.length && (
        <div className="flex items-center">
          <Flag countryCode={incident.CCs[0]} size={32} />
          <h3 className="ml-2">
            {getLocalisedRegionName(incident.CCs[0], intl.locale)}
          </h3>
        </div>
      )}
      <div className="text-gray-600 mb-4">
        {incident?.start_time &&
          formatLongDate(incident?.start_time, intl.locale)}{' '}
        -{' '}
        {incident?.end_time
          ? formatLongDate(incident?.end_time, intl.locale)
          : 'ongoing'}
      </div>
      {!!incident?.tags?.length && (
        <div className="flex mb-4 flex-wrap gap-2">
          {incident.tags.map((tag) => (
            <div key={tag}>
              <Badge>{tag}</Badge>
            </div>
          ))}
        </div>
      )}
      <div className="text-gray-600 mb-4">
        {intl.formatMessage(
          { id: 'Findings.Display.CreatedByOn' },
          { reportedBy, formattedDate: formattedCreationDate },
        )}
      </div>
      {!!incident?.ASNs?.length && (
        <div className="mb-4 text-lg">
          {intl.formatMessage(
            { id: 'Findings.Display.Network' },
            { listOfNetworks },
          )}
        </div>
      )}
      <div className="text-lg">
        {incident?.text && (
          <FormattedMarkdown>{incident.text}</FormattedMarkdown>
        )}
      </div>
    </>
  )
}

export default FindingDisplay
