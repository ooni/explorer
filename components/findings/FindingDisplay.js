import { Badge } from 'components/Badge'
import Flag from 'components/Flag'
import { MATChartWrapper } from 'components/MATChart'
import Markdown from 'markdown-to-jsx'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { formatLongDateUTC } from 'utils'
import { getLocalisedRegionName } from 'utils/i18nCountries'

const FormattedMarkdown = ({ children }) => {
  return (
    <Markdown
      options={{
        overrides: {
          MAT: {
            component: MATChartWrapper,
          },
          iframe: () => null,
          script: () => null,
          style: () => null,
          object: () => null,
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
  const formattedCreationDate = incident?.create_time && (
      <time dateTime={incident?.create_time?.split('T')[0]}>
        {formatLongDateUTC(incident?.create_time, intl.locale)}
      </time>
    )
  
  const listOfNetworks = incident?.ASNs?.map((as) => (
    <Link key={as} href={`/as/AS${as}`} prefetch={false}>{`AS${as}`}</Link>
  )).reduce((prev, curr) => (prev ? [prev, ', ', curr] : curr), null)

  return (
    <article className="mb-24">
      <header className="my-8 mb-4">
        <h1 className="pb-4 border-b border-gray-300 mb-8">{incident?.title}</h1>
        {!!incident?.CCs?.length && (
          <div className="flex items-center mt-2">
            <Flag countryCode={incident.CCs[0]} size={32} />
            <h3 className="ml-2">
              {getLocalisedRegionName(incident.CCs[0], intl.locale)}
            </h3>
          </div>
        )}
        <div className="text-gray-600">
          <time dateTime={incident?.start_time?.split('T')[0]}>
            {incident?.start_time &&
              formatLongDateUTC(incident?.start_time, intl.locale)}
          </time>
          {' – '}
          {incident?.end_time ? (
            <time dateTime={incident.end_time?.split('T')[0]}>
              {formatLongDateUTC(incident.end_time, intl.locale)}
            </time>
          ) : (
            'ongoing'
          )}
        </div>
      </header>

      {!!incident?.tags?.length && (
        <ul className="flex mb-4 flex-wrap gap-2 list-none p-0">
          {incident.tags
            .filter((t) => !t.includes('theme-'))
            .map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
        </ul>
      )}

      <div className="mb-4">
        <p className="text-gray-600">
          {intl.formatMessage(
            { id: 'Findings.Display.CreatedByOn' },
            { reportedBy, formattedDate: formattedCreationDate },
          )}
        </p>
        {!!incident?.ASNs?.length && (
          <p className="mt-1 text-lg">
            {intl.formatMessage(
              { id: 'Findings.Display.Network' },
              { listOfNetworks },
            )}
          </p>
        )}
      </div>

      {incident?.text && (
        <section className="text-lg">
          <FormattedMarkdown>{incident.text}</FormattedMarkdown>
        </section>
      )}
    </article>
  )
}

export default FindingDisplay
