import { ResponsiveLine } from '@nivo/line'
import axios from 'axios'
import Slices from 'components/chart/Slices'
import { colors } from 'ooni-components'
import { memo, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import FormattedMarkdown from './FormattedMarkdown'
import SectionHeader from './country/SectionHeader'
import { SimpleBox } from './country/boxes'

const iodaLineColors = {
  gtr: colors.blue['500'],
  'merit-nt': colors.red['500'],
  bgp: colors.green['500'],
  'ping-slash24': colors.fuchsia['500'],
}

const SectionText = ({ location, asn, country, from, until }) => {
  let dateParams = ''
  if (from && until) {
    const formattedFrom = Math.round(dayjs(from).utc().valueOf() / 1000)
    const formattedTo = Math.round(dayjs(until).utc().valueOf() / 1000)

    dateParams = `?from=${formattedFrom}&until=${formattedTo})`
  }

  return (
    <FormattedMarkdown
      id="Country.Outages.Description"
      values={{
        'ioda-link': (string) =>
          `[${string}](https://ioda.inetintel.cc.gatech.edu/${country ? 'country' : 'asn'}/${location}${dateParams}`,
        'cloudflare-link': (string) =>
          `[${string}](https://radar.cloudflare.com/${asn ? 'as' : ''}${location}?range=28d)`,
      }}
    />
  )
}

const ThirdPartyDataChart = ({ since, until, country, asn, ...props }) => {
  const intl = useIntl()
  const location = country || asn
  const [graphData, setGraphData] = useState([])
  const [error, setError] = useState(null)

  const [from, to] = useMemo(() => {
    if (!since || !until) return []
    // make sure the date is not in the future to avoid receiving error from CloudFlare
    const to = dayjs(until).isBefore(dayjs(), 'day')
      ? dayjs.utc(until).toISOString()
      : dayjs().subtract(30, 'minute').utc().toISOString()
    const from = dayjs.utc(since).toISOString()
    return [from, to]
  }, [since, until])

  const cloudflareData = useEffect(() => {
    if (!since && !until) return

    setGraphData([])
    setError(null)

    Promise.allSettled([
      axios.get(
        `/api/cloudflare?from=${from}&to=${to}&${asn ? `asn=${asn}` : `country=${country}`}`,
      ),
      axios.get(
        `/api/ioda?from=${from}&to=${to}&${asn ? `asn=${asn}` : `country=${country}`}`,
      ),
    ])
      .then((results) => {
        const cloudflareData = results[0]
        const iodaData = results[1]

        const cloudflareChartData =
          cloudflareData.status === 'fulfilled'
            ? [
                {
                  id: intl.formatMessage({
                    id: 'ThirdPartyChart.Label.cloudflare',
                  }),
                  color: colors.yellow['500'],
                  data: cloudflareData.value.data,
                },
              ]
            : []

        const iodaChartData =
          iodaData.status === 'fulfilled'
            ? iodaData.value.data.map((item) => {
                return {
                  id: intl.formatMessage({
                    id: `ThirdPartyChart.Label.${item.datasource}`,
                  }),
                  color: iodaLineColors[item.datasource],
                  data: item.values,
                }
              })
            : []

        setGraphData([...iodaChartData, ...cloudflareChartData])
      })
      .catch((err) => {})
  }, [since, until])

  return (
    <>
      {/* keep distinct styles for country and network pages */}
      {country ? (
        <>
          <SectionHeader>
            <SectionHeader.Title name="outages">
              {intl.formatMessage({ id: 'Country.Outages' })}
            </SectionHeader.Title>
          </SectionHeader>
          <SimpleBox>
            <div className="text-base">
              <SectionText
                location={location}
                asn={asn}
                country={country}
                from={from}
                until={to}
              />
            </div>
          </SimpleBox>
        </>
      ) : (
        <>
          <h3>{intl.formatMessage({ id: 'Country.Outages' })}</h3>
          <SectionText
            location={location}
            asn={asn}
            country={country}
            from={from}
            until={to}
          />
        </>
      )}

      <div className="w-full h-[500px]">
        {!!graphData.length && !error && (
          <ResponsiveLine
            data={graphData}
            margin={{ top: 50, right: 20, bottom: 70, left: 30 }}
            enablePoints={false}
            lineWidth={1}
            xScale={{
              type: 'time',
              format: '%Y-%m-%dT%H:%M:%SZ',
              precision: 'minute',
              useUTC: true,
            }}
            yScale={{
              type: 'linear',
              stacked: false,
              min: 0,
              max: 1,
            }}
            axisBottom={{
              format: '%Y-%m-%d',
            }}
            enableSlices="x"
            colors={(d) => d.color}
            layers={['grid', 'axes', 'lines', 'legends', 'crosshair', Slices]}
            sliceTooltip={(props) => {
              if (props?.slice?.points?.length) {
                const points = props.slice.points
                return (
                  <div
                    style={{
                      background: 'white',
                      padding: '9px 12px',
                      border: '1px solid #ccc',
                    }}
                  >
                    <div className="mb-2 font-bold">
                      {new Intl.DateTimeFormat(intl.locale, {
                        dateStyle: 'long',
                        timeStyle: 'long',
                        timeZone: 'UTC',
                      }).format(new Date(points[0].data.x))}
                    </div>
                    {points.map((point) => (
                      <div className="flex items-center" key={point.id}>
                        <div
                          key={point.id}
                          style={{
                            backgroundColor: point.serieColor,
                            padding: '3px 0',
                            width: '10px',
                            height: '10px',
                          }}
                        />
                        <div className="ml-2">
                          <strong>{point.serieId}</strong> [
                          {Number(point.data.yFormatted).toFixed(4)}]
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            }}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                translateY: 70,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 140,
                itemHeight: 20,
                symbolSize: 12,
                symbolShape: 'circle',
              },
            ]}
          />
        )}
        {error && (
          <div className="mt-4 text-base">Unable to retrieve the data</div>
        )}
      </div>
    </>
  )
}

export default memo(ThirdPartyDataChart)
