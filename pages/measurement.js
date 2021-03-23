/* global process */
import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import countryUtil from 'country-util'
import axios from 'axios'
import { Container, theme } from 'ooni-components'

import Hero from '../components/measurement/Hero'
import CommonSummary from '../components/measurement/CommonSummary'
import DetailsHeader from '../components/measurement/DetailsHeader'
import SummaryText from '../components/measurement/SummaryText'
import CommonDetails from '../components/measurement/CommonDetails'
import MeasurementContainer from '../components/measurement/MeasurementContainer'
import { ScreenshotProvider } from '../components/ScreenshotContext'
import ScreenshotWrapper from '../components/ScreenshotWrapper'
import MeasurementNotFound from '../components/measurement/MeasurementNotFound'
import HeadMetadata from '../components/measurement/HeadMetadata'

import Layout from '../components/Layout'
import NavBar from '../components/NavBar'
import ErrorPage from './_error'

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
    errors: []
  }

  // If there is no report_id to use, fail early with MeasurementNotFound
  if (typeof query.report_id !== 'string' || query.report_id.length < 1) {
    initialProps.notFound = true
    return {
      props: initialProps
    }
  }

  let response
  let client
  try {
    client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    let params = {
      report_id: query.report_id,
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

      try {
        initialProps['raw_measurement'] = JSON.parse(initialProps['raw_measurement'])
      } catch (e) {
        throw new Error(`Failed to parse raw_measurement: ${e.toString()}`)
      }

      const { probe_cc } = response.data
      const countryObj = countryUtil.countryList.find(country => (
        country.iso3166_alpha2 === probe_cc
      ))
      initialProps['country'] = countryObj?.name || 'Unknown'
    } else {
      // Measurement not found
      initialProps.notFound = true
    }
    initialProps['screenshot'] = query.screenshot ? true : false
  } catch (e) {
    initialProps.errors.push(e.message)
  }
  return {
    props: initialProps
  }
}

const Measurement = ({
  errors,
  country,
  confirmed,
  anomaly,
  failure,
  test_name,
  test_start_time,
  probe_cc,
  probe_asn,
  notFound = false,
  input,
  raw_measurement,
  report_id,
  screenshot,
  ...rest
}) => {

  // Add the 'AS' prefix to probe_asn when APi chooses to snd just the number
  probe_asn = typeof probe_asn === 'number' ? `AS${probe_asn}` : probe_asn

  if (errors.length > 0) {
    return (
      <ErrorPage errorCode={501} errors={errors} />
    )
  }

  return (
    <ScreenshotProvider screenshot={screenshot}>
      <Layout>
        <Head>
          <title>OONI Explorer</title>
        </Head>
        {notFound ? (
          <MeasurementNotFound />
        ): (
          <MeasurementContainer
            isConfirmed={confirmed}
            isAnomaly={anomaly}
            isFailure={failure}
            testName={test_name}
            country={country}
            measurement={raw_measurement}
            input={input}
            test_start_time={test_start_time}
            probe_asn={probe_asn}
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
            }) => (
              <React.Fragment>
                {headMetadata &&
                  <HeadMetadata
                    content={headMetadata}
                    testName={test_name}
                    testUrl={input}
                    country={country}
                    date={test_start_time}
                  />
                }
                {screenshot ? (
                  <React.Fragment>
                    <ScreenshotWrapper
                      color={pageColors[status]}
                    >
                      <NavBar color={pageColors[status]} />
                      <Hero
                        color={pageColors[status]}
                        status={status}
                        icon={statusIcon}
                        label={statusLabel}
                        info={statusInfo}
                      />
                      <CommonSummary
                        test_start_time={test_start_time}
                        probe_asn={probe_asn}
                        probe_cc={probe_cc}
                        color={pageColors[status]}
                        country={country}
                      />
                    </ScreenshotWrapper>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <NavBar color={pageColors[status]} />
                    <Hero
                      color={pageColors[status]}
                      status={status}
                      icon={statusIcon}
                      label={statusLabel}
                      info={statusInfo}
                    />
                    <CommonSummary
                      test_start_time={test_start_time}
                      probe_asn={probe_asn}
                      probe_cc={probe_cc}
                      color={pageColors[status]}
                      country={country}
                    />
                  </React.Fragment>
                )}

                {!screenshot &&
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
                        date={test_start_time}
                        content={summaryText}
                      />
                    }
                    {details}
                    <CommonDetails
                      measurement={raw_measurement}
                      reportId={report_id}
                    />
                  </Container>
                }
              </React.Fragment>
            )} />
        )}
      </Layout>
    </ScreenshotProvider>
  )
}

Measurement.propTypes = {
  anomaly: PropTypes.bool,
  confirmed: PropTypes.bool,
  country: PropTypes.string,
  errors: PropTypes.arrayOf(PropTypes.string),
  failure: PropTypes.bool,
  input: PropTypes.any,
  notFound: PropTypes.bool,
  probe_asn: PropTypes.any,
  probe_cc: PropTypes.string,
  raw_measurement: PropTypes.object,
  report_id: PropTypes.string,
  test_name: PropTypes.string,
  test_start_time: PropTypes.string
}

export default Measurement
