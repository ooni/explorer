import axios from 'axios'
import CallToActionBox from 'components/CallToActionBox'
import Chart from 'components/Chart'
import CountryList from 'components/CountryBox'
import { StyledSticky } from 'components/SharedStyledComponents'
import ThirdPartyDataChart from 'components/ThirdPartyDataChart'
import Calendar from 'components/as/Calendar'
import Loader from 'components/as/Loader'
import Form from 'components/domain/Form'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import { fetcherWithPreprocessing, simpleFetcher } from 'services/fetchers'
import useSWR from 'swr'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import { SectionText } from '../../components/ThirdPartyDataChart'
import { toCompactNumberUnit } from '../../utils'
import TestGroupBadge from '/components/Badge'
import RecentMeasurements from '../../components/RecentMeasurements'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const prepareDataForCalendar = (data) => {
  return data.map((r) => ({
    value: r.measurement_count,
    day: r.measurement_start_day,
  }))
}

const messagingTestNames = [
  'signal',
  'telegram',
  'whatsapp',
  'facebook_messenger',
]
const circumventionTestNames = ['psiphon', 'tor', 'torsf']

const ChartsContainer = () => {
  const router = useRouter()
  const {
    query: { since, until, probe_asn, probe_cc },
  } = router

  const queryWebsites = useMemo(
    () => ({
      axis_y: 'domain',
      axis_x: 'measurement_start_day',
      probe_asn,
      since,
      until,
      ...(probe_cc && { probe_cc }),
      test_name: 'web_connectivity',
      time_grain: 'day',
    }),
    [probe_asn, since, until, probe_cc],
  )

  const queryMessagingApps = useMemo(
    () => ({
      axis_y: 'test_name',
      axis_x: 'measurement_start_day',
      probe_asn,
      since,
      until,
      test_name: messagingTestNames,
      ...(probe_cc && { probe_cc }),
      time_grain: 'day',
    }),
    [probe_asn, since, until, probe_cc],
  )

  const queryCircumventionTools = useMemo(
    () => ({
      axis_y: 'test_name',
      axis_x: 'measurement_start_day',
      probe_asn,
      since,
      until,
      test_name: circumventionTestNames,
      ...(probe_cc && { probe_cc }),
      time_grain: 'day',
    }),
    [probe_asn, since, until, probe_cc],
  )

  return (
    <>
      <section className="my-8">
        <div className="mb-4">
          <TestGroupBadge testName="web_connectivity" />
        </div>
        <Chart queryParams={queryWebsites} />
      </section>
      <section className="my-8">
        <div className="mb-4">
          <TestGroupBadge testName="signal" />
        </div>
        <Chart queryParams={queryMessagingApps} />
      </section>
      <section className="my-8">
        <div className="mb-4">
          <TestGroupBadge testName="tor" />
        </div>
        <Chart queryParams={queryCircumventionTools} />
      </section>
    </>
  )
}

const StatsItem = ({ label, unit = null, value }) => (
  <div>
    <div className="font-bold">{label}</div>
    <div className="text-4xl font-light">
      {value}
      {unit && <span className="text-3xl">{unit}</span>}
    </div>
  </div>
)

const Summary = ({ measurementsTotal, firstMeasurement, lastMeasurement }) => {
  const intl = useIntl()
  const formattedFirstMeasurement = new Intl.DateTimeFormat(intl.locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(firstMeasurement))
  measurementsTotal =
    measurementsTotal < 10000
      ? { value: measurementsTotal }
      : toCompactNumberUnit(measurementsTotal)
  const formattedLastMeasurement = new Intl.DateTimeFormat(intl.locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(lastMeasurement))

  return (
    <>
      <h3 className="mt-8 mb-4">
        <FormattedMessage id="Network.Summary.Coverage" />
      </h3>
      <div className="flex gap-8 mb-4">
        <StatsItem
          label={intl.formatMessage({
            id: 'Network.Summary.TotalMeasurements',
          })}
          unit={measurementsTotal.unit}
          value={measurementsTotal.value}
        />
        <StatsItem
          label={intl.formatMessage({ id: 'Network.Summary.FirstMeasurement' })}
          value={formattedFirstMeasurement}
        />
        <StatsItem
          label={intl.formatMessage({ id: 'Network.Summary.LastMeasurement' })}
          value={formattedLastMeasurement}
        />
      </div>
    </>
  )
}

const CountriesList = ({ countriesData }) => {
  const { locale } = useIntl()

  const sortedCountries = useMemo(() =>
    countriesData
      .sort((a, b) => b.measurements - a.measurements)
      .map((c) => ({
        ...c,
        localisedName: getLocalisedRegionName(c.alpha_2, locale),
      })),
  )
  console.log('countriesData', countriesData)

  const numberOfCountries = countriesData.length

  return (
    <>
      <h3>
        <FormattedMessage
          id="Network.Summary.Countries"
          values={{ numberOfCountries }}
        />
      </h3>
      <CountryList countries={sortedCountries} />
    </>
  )
}

const NetworkDashboard = ({ probe_asn, networkName, countriesData }) => {
  const intl = useIntl()
  const router = useRouter()
  const { query } = router
  const displayASN = probe_asn.replace('AS', '')

  const { since, until } = useMemo(() => {
    const today = dayjs.utc().add(1, 'day')
    const monthAgo = dayjs.utc(today).subtract(1, 'month')

    return {
      since: query.since ?? monthAgo.format('YYYY-MM-DD'),
      until: query.until ?? today.format('YYYY-MM-DD'),
    }
  }, [query])
  console.log('since', since, until)

  const { data: calendarData, error: calendarDataError } = useSWR(
    [
      '/api/v1/aggregation',
      {
        params: {
          probe_asn,
          since: dayjs.utc().subtract(12, 'year').format('YYYY-MM-DD'),
          until: dayjs.utc().add(1, 'day').format('YYYY-MM-DD'),
          axis_x: 'measurement_start_day',
        },
        resultKey: 'result',
        preprocessFn: prepareDataForCalendar,
      },
    ],
    fetcherWithPreprocessing,
    swrOptions,
  )

  const measurementsTotal = useMemo(() => {
    return calendarData?.length
      ? calendarData.reduce((a, b) => a + b.value, 0)
      : null
  }, [calendarData])

  // Sync page URL params with changes from form values
  const onSubmit = (data) => {
    const params = {}
    for (const p of Object.keys(data)) {
      if (data[p]) {
        params[p] = data[p]
      }
    }
    params.probe_asn = probe_asn
    // since: "2022-01-02",
    // until: "2022-02-01",

    const { since, until, probe_cc } = params

    if (
      query.since !== since ||
      query.until !== until ||
      query.probe_cc !== probe_cc
    ) {
      router.push({ query: params }, undefined, { shallow: true })
    }
  }

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({ id: 'General.OoniExplorer' })} | {probe_asn}{' '}
          {networkName}
        </title>
      </Head>
      <div className="container">
        <h1 className="mb-8 mt-16">
          {probe_asn} {networkName}
        </h1>
        {router.isReady && (
          <>
            {calendarData === undefined && <Loader />}
            {calendarData?.length > 0 && (
              <>
                <CountriesList countriesData={countriesData} />
                <Summary
                  measurementsTotal={measurementsTotal}
                  firstMeasurement={calendarData[0].day}
                  lastMeasurement={calendarData[calendarData.length - 1].day}
                />
                <Calendar data={calendarData} />
                <h3 className="my-8">
                  {intl.formatMessage({ id: 'Network.Stats.Title' })}
                </h3>
                <div>
                  {/* we want sticky header only while scrolling over the charts */}
                  <StyledSticky>
                    <div className="pb-4 pt-2">
                      <Form
                        onSubmit={onSubmit}
                        availableCountries={countriesData.map((c) => c.alpha_2)}
                      />
                    </div>
                  </StyledSticky>
                  <ChartsContainer />
                </div>
                {since && until && (
                  <>
                    <h3>{intl.formatMessage({ id: 'Country.Outages' })}</h3>
                    <SectionText asn={displayASN} from={since} until={until} />
                    <ThirdPartyDataChart
                      since={since}
                      until={until}
                      asn={displayASN}
                    />
                  </>
                )}
                <RecentMeasurements query={{ probe_asn }} />
              </>
            )}
            {calendarData?.length === 0 && (
              <CallToActionBox
                title={<FormattedMessage id="Network.NoData.Title" />}
                text={<FormattedMessage id="Network.NoData.Text" />}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { probe_asn } = context.query

  if (/^AS[0-9]+$/.test(probe_asn)) {
    const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
    const path = '/api/v1/aggregation'

    const countriesData = await client
      .get(path, {
        params: {
          probe_asn,
          axis_x: 'probe_cc',
        },
      })
      .then((response) =>
        response.data.result.map((res) => ({
          alpha_2: res.probe_cc,
          count: res.measurement_count,
        })),
      )

    const networkName = await client
      .get('/api/_/asnmeta', { params: { asn: probe_asn.replace('AS', '') } })
      .then((response) => response?.data?.org_name)

    return {
      props: {
        probe_asn,
        countriesData,
        networkName,
      },
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  }
}

export default NetworkDashboard
