import { useTheme } from '@nivo/theming'
import { Chip } from '@nivo/tooltip'
import Link from 'next/link'
import { colors } from 'ooni-components'
import { memo, useMemo } from 'react'

import { MdClear } from 'react-icons/md'
import { useIntl } from 'react-intl'
import { colorMap } from './colorMap'
import { useMATContext } from './MATContext'

export const themeForInvisibleTooltip = {
  tooltip: {
    container: {
      boxShadow: '',
      background: '',
    },
  },
}

export const InvisibleTooltip = () => <></>

export const barThemeForTooltip = {
  tooltip: {
    container: {
      pointerEvents: 'initial',
      boxShadow: `1px 1px 4px 1px ${colors.gray['600']}`,
    },
  },
}

export const generateSearchQuery = (data, query) => {
  const { since, until } = query

  let sinceFilter = since
  let untilFilter = until

  // For charts with data indexed by `measurement_start_day`,
  // use that value to limit date range on `/search` page
  if ('measurement_start_day' in data) {
    sinceFilter = data.measurement_start_day
    const untilDateObj = new Date(Date.parse(sinceFilter))
    switch (query.time_grain) {
      case 'hour':
        untilDateObj.setUTCHours(untilDateObj.getUTCHours() + 1)
        break
      case 'week':
        untilDateObj.setUTCDate(untilDateObj.getUTCDate() + 7)
        break
      case 'month':
        untilDateObj.setUTCMonth(untilDateObj.getUTCMonth() + 1)
        break
      default:
        untilDateObj.setUTCDate(untilDateObj.getUTCDate() + 1)
        break
    }
    untilFilter = untilDateObj.toISOString()
    if (query.time_grain !== 'hour') {
      untilFilter = untilFilter.split('T')[0]
    } else {
      untilFilter = `${untilFilter.split('.')[0]}Z`
    }
  }

  const queryObj = [
    'probe_cc',
    'test_name',
    'category_code',
    'probe_asn',
    'input',
    'domain',
  ].reduce((q, k) => {
    if (k in data) q[k] = data[k]
    else if (query[k]) q[k] = query[k]
    return q
  }, {})

  // Filter for anomalies if blocking_type is set
  const isBlockingType =
    Object.values(query).includes('blocking_type') && 'blocking_type' in data
  if (isBlockingType) {
    queryObj.only = 'anomalies'
  }

  return {
    since: sinceFilter,
    until: untilFilter,
    ...queryObj,
  }
}

const keys = ['anomaly_count', 'confirmed_count', 'failure_count', 'ok_count']

const CustomToolTip = memo(({ data, onClose, title, link = true }) => {
  const theme = useTheme()
  const intl = useIntl()
  const { state } = useMATContext()
  const { query } = state

  const [linkToMeasurements, derivedTitle] = useMemo(() => {
    const searchQuery = generateSearchQuery(data, query)
    const linkObj = {
      pathname: '/search',
      query: { ...searchQuery, failure: true },
    }

    const derivedTitle =
      title ??
      `${data[query?.axis_x]} ${query?.axis_y ? ` - ${data[query.axis_y]}` : ''}`

    return [linkObj, derivedTitle]
  }, [data, query, title])

  return (
    <div className="flex flex-col" style={{ ...theme.tooltip.container }}>
      <div className="flex my-1">
        <div className="font-bold mr-auto">{derivedTitle}</div>
        <MdClear title="Close" strokeWidth={2} onClick={onClose} />
      </div>
      <div className="flex flex-col pr-4 my-1">
        {query?.data === 'observations' && (
          <>
            {state?.selected?.map((key) => (
              <div key={key}>
                {!!Number(data[key] ?? 0) && (
                  <div className="flex items-center">
                    <div className="mr-4">
                      <Chip color={state.colors[key]} />
                    </div>
                    <div className="mr-8">{key}</div>
                    <div className="ml-auto">
                      {intl.formatNumber(Number(data[key] ?? 0))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {query?.data === 'analysis' && (
          <>
            <div>
              Outcome:{' '}
              <span className="font-semibold">{data.blocked_max_outcome}</span>
            </div>
            {!!data?.likely_blocked_protocols.length && (
              <div>
                Likely blocked protocols:{' '}
                <ul>
                  {data?.likely_blocked_protocols.map(([protocol, value]) => (
                    <li key={protocol}>
                      {protocol}: {Math.floor(value * 100) / 100}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              Measurement count:{' '}
              <span className="font-semibold">{data.count || 0}</span>
            </div>
          </>
        )}

        {(!query?.data || query?.data === 'anomalies') && (
          <>
            {keys.map((k) => (
              <div className="my-1" key={k}>
                <div className="flex items-center">
                  <div className="mr-4">
                    <Chip color={colorMap[k]} />
                  </div>
                  <div className="mr-8">
                    {intl.formatMessage({ id: `MAT.Table.Header.${k}` })}
                  </div>
                  <div className="ml-auto">
                    {intl.formatNumber(Number(data[k] ?? 0))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {link && (
        <div className="my-2 ml-auto pr-4">
          <Link target="_blank" href={linkToMeasurements}>
            {intl.formatMessage({ id: 'MAT.CustomTooltip.ViewMeasurements' })}{' '}
            &gt;
          </Link>
        </div>
      )}
    </div>
  )
})

CustomToolTip.displayName = 'CustomTooltip'

const CustomTooltipNoLink = memo((props) =>
  createElement(CustomToolTip, { ...props, link: false }),
)
CustomTooltipNoLink.displayName = 'CustomTooltip'

export { CustomToolTip, CustomTooltipNoLink }
