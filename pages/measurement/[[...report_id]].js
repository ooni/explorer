/* global process */
import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import countryUtil from 'country-util'
import axios from 'axios'
import { Container, theme } from 'ooni-components'

import Hero from '../../components/measurement/Hero'
import CommonSummary from '../../components/measurement/CommonSummary'
import DetailsHeader from '../../components/measurement/DetailsHeader'
import SummaryText from '../../components/measurement/SummaryText'
import CommonDetails from '../../components/measurement/CommonDetails'
import MeasurementContainer from '../../components/measurement/MeasurementContainer'
import MeasurementNotFound from '../../components/measurement/MeasurementNotFound'
import HeadMetadata from '../../components/measurement/HeadMetadata'

import Layout from '../../components/Layout'
import NavBar from '../../components/NavBar'
import ErrorPage from '../_error'
import { axiosPluginLogRequest } from 'components/axios-plugins'

const pageColors = {
  default: theme.colors.base,
  anomaly: theme.colors.yellow9,
  reachable: theme.colors.green8,
  error: theme.colors.gray6,
  down: theme.colors.gray6,
  confirmed: theme.colors.red7
}

async function getInitialProps({ query }) {
  let initialProps = {
    errors: [],
    ssrRequests: {}
  }

  // Get `report_id` using optional catch all dynamic route of Next.js
  // Doc: https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes 
  // e.g /measurement/20211015T162758Z_webconnectivity_TH_23969_n1_d11S0T15FaOuXgFO
  // It can also catch /measurement/report_id/extra/segments
  // in which case, the extra segments are available inside query.report_id[1+]
  const report_id = query?.report_id?.[0]
  // If there is no report_id to use, fail early with MeasurementNotFound
  if (typeof report_id !== 'string' || report_id.length < 1) {
    initialProps.notFound = true
    initialProps.ssrRequests = {
      message: `failed early. could not find a report_id: ${report_id} (${typeof report_id})`
    }
    return {
      ...initialProps
    }
  }

  let response
  let client
  try {
    client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL}) // eslint-disable-line
    axiosPluginLogRequest(axios)
    let params = {
      report_id: report_id,
      full: true
    }
    if (query.input) {
      params['input'] = query.input
    }

    try {
      response = await client.get('/api/v1/measurement_meta', {
        params: params
      })
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.message)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      throw error
    }

    // If response `data` is an empty object, the measurement was
    // probably not found
    if (Object.prototype.hasOwnProperty.call(response, 'data') && Object.keys(response.data).length !== 0) {
      initialProps = {...initialProps, ...response.data}

      if (typeof initialProps['scores'] === 'string') {
        try {
          initialProps['scores'] = JSON.parse(initialProps['scores'])
        } catch (e) {
          const scoresParseError = new Error(`Failed to parse JSON in scores: ${e.toString()}`)
          scoresParseError.data = response.data
          throw scoresParseError
        }
      }

      try {
        initialProps['raw_measurement'] = JSON.parse(initialProps['raw_measurement'])
      } catch (e) {
        const rawMeasurementParseError = new Error(`Failed to parse raw_measurement: ${e.toString()}`)
        rawMeasurementParseError.data = response.data
        throw rawMeasurementParseError
      }

      const { probe_cc } = response.data
      const countryObj = countryUtil.countryList.find(country => (
        country.iso3166_alpha2 === probe_cc
      ))
      initialProps['country'] = countryObj?.name || 'Unknown'
    } else {
      // Measurement not found
      initialProps.notFound = true
      const notFoundError = new Error('response.data was empty')
      notFoundError.data = response?.data
      throw notFoundError
    }
  } catch (e) {
    initialProps.errors.push(e.message)
    if (response?.config) {
      const { url, method, headers, params, baseURL } = response?.config
      const responseUrl = response?.request?.res?.responseUrl
      const serverError = response?.data?.error ?? response?.message ?? 'nothing in `response.data.error` or `$exception.message`'
      const config = { url, method, headers, params, baseURL, responseUrl, serverError }
      initialProps.ssrRequests = {
        ...initialProps.ssrRequests,
        ...config
      }
    }
    response = e
  }

  // searchReqConfig:
  if (response?.config) {
    const { url, method, headers, params, baseURL } = response?.config
    const responseUrl = response?.request?.res?.responseUrl
    const serverError = response?.data?.error ?? response?.message ?? 'nothing in `response.data.error` or `$exception.message`'
    initialProps.ssrRequests.config = { url, method, headers, params, baseURL, responseUrl, serverError }
  } else {
    console.log('last step in getServerSidProps', Object.keys(response))
    initialProps.ssrRequests = {
      ...initialProps.ssrRequests,
      message: response?.message,
      data: response.data
    }
  }

  return {
    ...initialProps
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
  ssrRequests,
  ...rest
}) => {
  // Add the 'AS' prefix to probe_asn when APi chooses to snd just the number
  probe_asn = typeof probe_asn === 'number' ? `AS${probe_asn}` : probe_asn

  console.log('server side requests:')
  console.log(ssrRequests)

  if (errors.length > 0) {
    return (
      <ErrorPage err={errors} />
    )
  }

  return (
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
            </React.Fragment>
          )} />
      )}
    </Layout>
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

Measurement.getInitialProps = getInitialProps

export default Measurement
