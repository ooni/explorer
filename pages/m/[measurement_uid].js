import Head from 'next/head'
import { colors } from 'ooni-components'
import { createContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import useSWR from 'swr'

import CommonDetails from 'components/measurement/CommonDetails'
import CommonSummary from 'components/measurement/CommonSummary'
import DetailsHeader from 'components/measurement/DetailsHeader'
import FeedbackBox from 'components/measurement/FeedbackBox'
import HeadMetadata from 'components/measurement/HeadMetadata'
import Hero from 'components/measurement/Hero'
import MeasurementContainer from 'components/measurement/MeasurementContainer'
import SummaryText from 'components/measurement/SummaryText'
import useUser from 'hooks/useUser'
import ErrorPage from 'pages/_error'
import NotFound from '../../components/NotFound'
import { fetcher } from '/lib/api'
import { getLocalisedRegionName } from '/utils/i18nCountries'
import SpinLoader from 'components/vendor/SpinLoader'

const pageColors = {
  default: colors.blue['500'],
  anomaly: colors.yellow['900'],
  reachable: colors.green['800'],
  error: colors.gray['600'],
  down: colors.gray['600'],
  confirmed: colors.red['700'],
}

export const EmbeddedViewContext = createContext(false)

export async function getServerSideProps({
  query,
  req,
  locale,
  defaultLocale,
}) {
  const measurement_uid = query?.measurement_uid
  // If there is no measurement_uid to use, fail early with NotFound
  if (typeof measurement_uid !== 'string' || measurement_uid.length < 10)
    return {
      props: {
        notFound: true,
      },
    }

  const isEmbeddedView =
    !!req.headers['enable-embedded-view'] || !!query?.webview
  const languageQuery = query?.language

  if (
    isEmbeddedView &&
    locale === 'en' &&
    languageQuery &&
    languageQuery !== 'en' &&
    languageQuery !== 'en-US'
  ) {
    if (process.env.LOCALES?.includes(languageQuery)) {
      return {
        redirect: {
          destination: `/${languageQuery}${req.url}`,
          permanent: false,
        },
      }
    }
    const fallbackLang = languageQuery.split('-')[0]
    if (process.env.LOCALES?.includes(fallbackLang)) {
      return {
        redirect: {
          destination: `/${fallbackLang}${req.url}`,
          permanent: false,
        },
      }
    }
  }

  return {
    props: {
      isEmbeddedView,
      measurementUid: measurement_uid,
    },
  }
}

const measurementFetcher = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`,
    )
  }
  return response.json()
}

const Measurement = ({
  isEmbeddedView,
  measurementUid,
  notFound = false,
  ...rest
}) => {
  const intl = useIntl()

  const { user } = useUser()
  const [showModal, setShowModal] = useState(false)

  const {
    data: measurementData,
    error,
    isValidating: isLoadingMeasurementData,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_OONI_API}/api/v1/measurement_meta?measurement_uid=${measurementUid}&full=true`,
    measurementFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  )

  let {
    confirmed,
    anomaly,
    failure,
    test_name,
    measurement_start_time,
    probe_cc,
    probe_asn,
    raw_measurement,
    measurement_uid,
    report_id,
    scores,
    input,
  } = measurementData ?? {}
  notFound = raw_measurement === ''
  raw_measurement = raw_measurement ? JSON.parse(raw_measurement) : null
  scores = scores ? JSON.parse(scores) : null

  const country = probe_cc
    ? getLocalisedRegionName(probe_cc, intl.locale)
    : null

  // Add the 'AS' prefix to probe_asn when API chooses to send just the number
  const formattedProbeAsn = String(probe_asn).startsWith('AS')
    ? probe_asn
    : `AS${probe_asn}`

  const {
    data: userFeedback,
    // error: userFeedbackError,
    mutate: mutateUserFeedback,
  } = useSWR(`/api/_/measurement_feedback/${measurementUid}`, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  const userFeedbackItems = useMemo(() => {
    return userFeedback
      ? Object.entries(userFeedback.summary).map(([key, value]) => ({
          label: intl.formatMessage({ id: `Measurement.Feedback.${key}` }),
          value,
        }))
      : []
  }, [userFeedback, intl])

  if (error) {
    return <ErrorPage statusCode={501} error={error} />
  }

  return (
    <EmbeddedViewContext.Provider value={isEmbeddedView}>
      <Head>
        <title>{intl.formatMessage({ id: 'General.OoniExplorer' })}</title>
        <meta name="robots" content="noindex" />
      </Head>
      {notFound ? (
        <>
          <NotFound
            title={intl.formatMessage({ id: 'Measurement.NotFound' })}
          />
        </>
      ) : (
        <>
          {isLoadingMeasurementData && (
            <div className="flex-1 flex justify-center items-center bg-gray-100 border-t-[62px] border-blue-500">
              <SpinLoader />
            </div>
          )}
          {measurementData && Object.keys(measurementData).length > 0 && (
            <MeasurementContainer
              isConfirmed={confirmed}
              isAnomaly={anomaly}
              isFailure={failure}
              testName={test_name}
              country={country}
              measurement={raw_measurement}
              input={input}
              measurement_start_time={measurement_start_time}
              probe_asn={formattedProbeAsn}
              scores={scores}
              {...rest}
              render={({
                status = 'default',
                statusIcon,
                statusLabel,
                statusInfo,
                legacy = false,
                summaryText,
                headMetadata,
                details,
              }) => {
                const color =
                  failure === true ? pageColors.error : pageColors[status]
                const info = scores?.msg ?? statusInfo
                return (
                  <>
                    {headMetadata && (
                      <HeadMetadata
                        content={headMetadata}
                        testName={test_name}
                        testUrl={input}
                        country={country}
                        date={measurement_start_time}
                      />
                    )}
                    {showModal && (
                      <FeedbackBox
                        user={user}
                        measurement_uid={measurement_uid}
                        setShowModal={setShowModal}
                        previousFeedback={userFeedback?.user_feedback}
                        mutateUserFeedback={mutateUserFeedback}
                      />
                    )}
                    <CommonSummary
                      measurement_start_time={measurement_start_time}
                      probe_asn={formattedProbeAsn}
                      probe_cc={probe_cc}
                      networkName={raw_measurement?.probe_network_name}
                      color={color}
                      country={country}
                      hero={
                        <Hero
                          status={status}
                          icon={statusIcon}
                          label={statusLabel}
                          info={info}
                        />
                      }
                      onVerifyClick={() => setShowModal(true)}
                    />
                    <div className="container">
                      <DetailsHeader
                        testName={test_name}
                        runtime={raw_measurement?.test_runtime}
                        notice={legacy}
                        url={`measurement/${measurement_uid}`}
                      />
                      {summaryText && (
                        <SummaryText
                          testName={test_name}
                          testUrl={input}
                          network={formattedProbeAsn}
                          country={country}
                          date={measurement_start_time}
                          content={summaryText}
                        />
                      )}
                      {details}
                      <CommonDetails
                        measurement={raw_measurement}
                        reportId={report_id}
                        measurementUid={measurement_uid}
                        userFeedbackItems={userFeedbackItems}
                      />
                    </div>
                  </>
                )
              }}
            />
          )}
        </>
      )}
    </EmbeddedViewContext.Provider>
  )
}

export default Measurement
