/* global process */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import axios from 'axios'
import { Container, theme, Flex } from 'ooni-components'
import { getLocalisedRegionName } from '../../utils/i18nCountries'
import NLink from 'next/link'

import Hero from 'components/measurement/Hero'
import CommonSummary from 'components/measurement/CommonSummary'
import DetailsHeader from 'components/measurement/DetailsHeader'
import SummaryText from 'components/measurement/SummaryText'
import CommonDetails from 'components/measurement/CommonDetails'
import MeasurementContainer from 'components/measurement/MeasurementContainer'
import MeasurementNotFound from 'components/measurement/MeasurementNotFound'
import HeadMetadata from 'components/measurement/HeadMetadata'
import FeedbackBox from 'components/measurement/FeedbackBox'
import { LoginModal } from 'components/login/LoginForm'

import Layout from 'components/Layout'
import NavBar from 'components/NavBar'
import ErrorPage from '../_error'
import { useIntl } from 'react-intl'
import useUser from 'hooks/useUser'
import { DetailsBoxTable } from 'components/measurement/DetailsBox'
import { FormattedMessage } from 'react-intl'
import useSWR from 'swr'

const pageColors = {
  default: theme.colors.base,
  anomaly: theme.colors.yellow9,
  reachable: theme.colors.green8,
  error: theme.colors.gray6,
  down: theme.colors.gray6,
  confirmed: theme.colors.red7
}

export async function getServerSideProps({ query }) {
  let initialProps = {
    error: null,
    userFeedback: null
  }

  // Get `report_id` using optional catch all dynamic route of Next.js
  // Doc: https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes 
  // e.g /measurement/20211015T162758Z_webconnectivity_TH_23969_n1_d11S0T15FaOuXgFO
  // It can also catch /measurement/report_id/extra/segments
  // in which case, the extra segments are available inside query.report_id[1+]
  const report_id = query?.report_id?.[0]
  // If there is no report_id to use, fail early with MeasurementNotFound
  if (typeof report_id !== 'string' || !report_id.match(/[a-zA-Z0-9_-]{40,100}/)) {
    initialProps.notFound = true
    return {
      props: initialProps
    }
  }

  let response
  let client
  try {
    client = axios.create({baseURL: process.env.NEXT_PUBLIC_OONI_API}) // eslint-disable-line
    let params = {
      report_id: report_id,
      full: true
    }
    if (query.input) {
      params['input'] = query.input
    }

    try {
      response = await client.get('/api/v1/measurement_meta', {
        params
      })
    } catch (e) {
      throw new Error(`Failed to fetch measurement data. Server message: ${e.response.status}, ${e.response.statusText}`)
    }

    // If response `data` is an empty object, the measurement was
    // probably not found
    if (Object.prototype.hasOwnProperty.call(response, 'data') && Object.keys(response.data).length !== 0) {
      initialProps = {...initialProps, ...response.data}

      if (typeof initialProps['scores'] === 'string') {
        try {
          initialProps['scores'] = JSON.parse(initialProps['scores'])
        } catch (e) {
          throw new Error(`Failed to parse JSON in scores: ${e.toString()}`)
        }
      }

      initialProps['raw_measurement'] ? 
        initialProps['raw_measurement'] = JSON.parse(initialProps['raw_measurement']) : 
        initialProps.notFound = true
    } else {
      // Measurement not found
      initialProps.notFound = true
    }
  } catch (e) {
    initialProps.error = e.message
  }
  return {
    props: initialProps
  }
}

const FeedbackLabel = ({reason}) => <FormattedMessage id={`Measurement.Feedback.${reason}`} />

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
  report_id,
  scores,
  ...rest
}) => {
  const intl = useIntl()
  const country = getLocalisedRegionName(probe_cc, intl.locale)

  const { user, submitted, reqError, setSubmitted } = useUser()
  const [showModal, setShowModal] = useState(false)
  
  const client = axios.create({baseURL: process.env.NEXT_PUBLIC_OONI_API, withCredentials: true})
  const fetcher = url => client.get(url).then(res => res.data)

  const {data: userFeedback, error: userFeedbackError} = useSWR(`/api/_/measurement_feedback/${report_id}`, fetcher)

  const userFeedbackItems = useMemo(() => {
    return userFeedback ? 
      Object.entries(userFeedback.summary).map(([key, value]) => ({label: <FeedbackLabel reason={key} />, value})) : 
      null
  }, [userFeedback])

  // Add the 'AS' prefix to probe_asn when API chooses to send just the number
  probe_asn = typeof probe_asn === 'number' ? `AS${probe_asn}` : probe_asn
  if (error) {
    return (
      <ErrorPage statusCode={501} error={error} />
    )
  }

  const hideModal = () => {
    setShowModal(false)
    setSubmitted(false)
  }

  return (
    <>
      <Head>
        <title>{intl.formatMessage({id: 'General.OoniExplorer'})}</title>
      </Head>
      {notFound ? (
        <MeasurementNotFound />
      ): (
        <>
          <LoginModal 
            isShowing={showModal}
            hide={() => hideModal()}
            reqError={reqError}
            submitted={submitted}
            onLogin={() => setSubmitted(true)} />
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
              details
            }) => {
              const color = failure === true ? pageColors['error'] : pageColors[status]
              const info = scores?.msg ?? statusInfo
              return (
                <>
                  {headMetadata &&
                    <HeadMetadata
                      content={headMetadata}
                      testName={test_name}
                      testUrl={input}
                      country={country}
                      date={measurement_start_time}
                    />
                  }
                  <NavBar color={color} />
                  <FeedbackBox 
                    user={user}
                    report_id={report_id}
                    setShowModal={setShowModal}
                    previousFeedback={userFeedback?.user_feedback}
                  />
                  <Hero
                    color={color}
                    status={status}
                    icon={statusIcon}
                    label={statusLabel}
                    info={info}
                  />
                  <CommonSummary
                    measurement_start_time={measurement_start_time}
                    probe_asn={probe_asn}
                    probe_cc={probe_cc}
                    color={color}
                    country={country}
                  />

                  <Container>
                    <DetailsHeader
                      testName={test_name}
                      runtime={raw_measurement?.test_runtime}
                      notice={legacy}
                      url={`measurement/${report_id}`}
                    />
                    {summaryText &&
                      <SummaryText
                        testName={test_name}
                        testUrl={input}
                        network={probe_asn}
                        country={country}
                        date={measurement_start_time}
                        content={summaryText}
                      />
                    }
                    {userFeedbackItems && 
                      <Flex my={2}>
                        <DetailsBoxTable
                          title={<FormattedMessage id='Measurement.CommonDetails.Label.UserFeedback' />}
                          items={userFeedbackItems}
                        />
                      </Flex>
                    }
                    {details}
                    <CommonDetails
                      measurement={raw_measurement}
                      reportId={report_id}
                    />
                  </Container>
                </>
              )
            }
          } />
        </>
      )}
    </>
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
  test_name: PropTypes.string,
  measurement_start_time: PropTypes.string
}

export default Measurement
