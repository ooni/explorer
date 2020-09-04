import React, { useState, useEffect } from 'react'
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
import MeasurementNotFound from '../components/measurement/MeasurementNotFound'

import Layout from '../components/Layout'
import NavBar from '../components/NavBar'

const pageColors = {
  default: theme.colors.base,
  anomaly: theme.colors.yellow9,
  reachable: theme.colors.green8,
  error: theme.colors.gray6,
  down: theme.colors.gray6,
  confirmed: theme.colors.red7
}

export async function getServerSideProps({ query }) {
  let initialProps = {}

  let client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
  let params = {
    report_id: query.report_id
  }
  if (query.input) {
    params['input'] = query.input
  }
  let msmtResult = {}
  // let msmtResult = await client.get('/api/v1/measurement_meta', {
  //   params
  // }).catch(e => { })

  msmtResult = { data: {}}

  msmtResult.data = {
    anomaly: false,
    confirmed: false,
    failure: false,
    input: 'inp',
    measurement_start_time: '2020-02-09T23:57:26Z',
    probe_asn: 22773,
    probe_cc: 'US',
    report_id: 'rid',
    scores: '{"blocking_general":0.0,"blocking_global":0.0,"blocking_country":0.0,"blocking_isp":0.0,"blocking_local":0.0}',
    test_name: 'web_connectivity',
    test_start_time: '2020-02-09T23:56:06Z',
    category_code: 'CULTR',
  }


  if (msmtResult?.data) {
    initialProps = Object.assign({}, msmtResult.data)
    const {
      // anomaly,
      // confirmed,
      // failure,
      // input,
      // measurement_start_time,
      // probe_asn,
      probe_cc,
      // report_id,
      // scores,
      // test_name,
      // test_start_time,
      // category_code
    } = msmtResult.data

    if (typeof initialProps['scores'] === 'string') {
      try {
        initialProps['scores'] = JSON.parse(initialProps['scores'])
      } catch (e) {
        console.error(`Failed to parse JSON in scores: ${e.toString()}`)
      }
    }

    const countryObj = countryUtil.countryList.find(country => (
      country.iso3166_alpha2 === probe_cc
    ))

    initialProps['country'] = countryObj?.name || 'Unknown'
  } else {
    // Measurement not found
    initialProps.notFound = true
  }

  return {
    props: initialProps
  }
}

const mock = {
  test_runtime: 10,
  test_keys: {
    accessible: true,
    blocking: 'http-diff',
    queries: [],
    tcp_connect: [],
    requests: [],
    client_resolver: null,
    http_experiment_failure: false,
    dns_experiment_failure: false,
    control_failure: false
  }
}

const Measurement = ({
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
  ...rest
}) => {
  const [measurement, setMeasurement] = useState(null)

  // Fetch full measurement here `&full=1`
  useEffect(() => {
    setTimeout(() => {
      setMeasurement(mock)
    }, 1000)
  }, [])

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
          measurement={measurement}
          {...rest}

          render={({
            status = 'default',
            statusIcon,
            statusLabel,
            statusInfo,
            legacy = false,
            summaryText,
            details
          }) => (
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

              <Container>
                <DetailsHeader
                  testName={test_name}
                  runtime={measurement?.test_runtime}
                  notice={legacy}
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
                {/* <CommonDetails
                  measurementURL={''}
                  measurement={measurement}
                /> */}
              </Container>
            </React.Fragment>
          )} />
      )}
    </Layout>
  )
}

Measurement.propTypes = {
  measurement: PropTypes.object,
  measurementURL: PropTypes.string,
  isAnomaly: PropTypes.bool,
  isFailure: PropTypes.bool,
  isConfirmed: PropTypes.bool,
  country: PropTypes.string
}

export default Measurement
