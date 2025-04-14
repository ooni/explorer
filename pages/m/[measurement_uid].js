import axios from 'axios'
import Head from 'next/head'
import { colors } from 'ooni-components'
import PropTypes from 'prop-types'
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

const pageColors = {
  default: colors.blue['500'],
  anomaly: colors.yellow['900'],
  reachable: colors.green['800'],
  error: colors.gray['600'],
  down: colors.gray['600'],
  confirmed: colors.red['700'],
}

export const EmbeddedViewContext = createContext(false)

export async function getServerSideProps({ query, req }) {
  let initialProps = {
    error: null,
    userFeedback: null,
    isEmbeddedView: !!req.headers['enable-embedded-view'] || !!query?.webview,
  }

  const measurement_uid = query?.measurement_uid
  // If there is no measurement_uid to use, fail early with NotFound
  if (typeof measurement_uid !== 'string' || measurement_uid.length < 10) {
    initialProps.notFound = true
    return {
      props: initialProps,
    }
  }

  let response
  let client
  try {
    client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
    const params = {
      measurement_uid,
      full: true,
    }
    if (query.input) {
      params.input = query.input
    }

    try {
      response = await client.get('/api/v1/measurement_meta', {
        params,
      })
    } catch (e) {
      throw new Error(
        `Failed to fetch measurement data. Server message: ${e.response.status}, ${e.response.statusText}`,
      )
    }

    // If response `data` is an empty object, the measurement was
    // probably not found
    if (
      Object.prototype.hasOwnProperty.call(response, 'data') &&
      Object.keys(response.data).length !== 0
    ) {
      initialProps = { ...initialProps, ...response.data }

      if (typeof initialProps.scores === 'string') {
        try {
          initialProps.scores = JSON.parse(initialProps.scores)
        } catch (e) {
          throw new Error(`Failed to parse JSON in scores: ${e.toString()}`)
        }
      }

      initialProps.raw_measurement
        ? // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
          (initialProps.raw_measurement = JSON.parse(
            initialProps.raw_measurement,
          ))
        : // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
          (initialProps.notFound = true)
    } else {
      // Measurement not found
      initialProps.notFound = true
    }
  } catch (e) {
    initialProps.error = e.message
  }
  return {
    props: initialProps,
  }
}

const Measurement = ({
  error,
  confirmed,
  anomaly,
  failure,
  test_name,
  measurement_start_time,
  probe_cc,
  probe_asn,
  notFound = false,
  input,
  raw_measurement,
  measurement_uid,
  report_id,
  scores,
  isEmbeddedView,
  ...rest
}) => {
  const intl = useIntl()
  const country = getLocalisedRegionName(probe_cc, intl.locale)

  const { user, setSubmitted } = useUser()
  const [showModal, setShowModal] = useState(false)

  const {
    data: userFeedback,
    error: userFeedbackError,
    mutate: mutateUserFeedback,
  } = useSWR(`/api/_/measurement_feedback/${measurement_uid}`, fetcher)

  const userFeedbackItems = useMemo(() => {
    return userFeedback
      ? Object.entries(userFeedback.summary).map(([key, value]) => ({
          label: intl.formatMessage({ id: `Measurement.Feedback.${key}` }),
          value,
        }))
      : []
  }, [userFeedback, intl])

  // Add the 'AS' prefix to probe_asn when API chooses to send just the number
  probe_asn = typeof probe_asn === 'number' ? `AS${probe_asn}` : probe_asn
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
          <MeasurementContainer
            isConfirmed={confirmed}
            isAnomaly={anomaly}
            isFailure={failure}
            testName={test_name}
            country={country}
            measurement={raw_measurement}
            input={input}
            measurement_start_time={measurement_start_time}
            probe_asn={probe_asn}
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
                    probe_asn={probe_asn}
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
                        network={probe_asn}
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
        </>
      )}
    </EmbeddedViewContext.Provider>
  )
}

Measurement.propTypes = {
  anomaly: PropTypes.bool,
  confirmed: PropTypes.bool,
  error: PropTypes.string,
  failure: PropTypes.bool,
  input: PropTypes.any,
  notFound: PropTypes.bool,
  probe_asn: PropTypes.any,
  probe_cc: PropTypes.string,
  raw_measurement: PropTypes.object,
  report_id: PropTypes.string,
  measurement_uid: PropTypes.string,
  test_name: PropTypes.string,
  measurement_start_time: PropTypes.string,
}

export default Measurement
