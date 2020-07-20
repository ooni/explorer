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

export default class Measurement extends React.Component {

  static async getInitialProps ({ query }) {
    let initialProps = {}
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    let params = {
      report_id: query.report_id
    }
    if (query.input) {
      params['input'] = query.input
    }
    let msmtResult = await client.get('/api/v1/measurements', {
      params
    })
    if (msmtResult.data.results.length > 0) {
      const results = msmtResult.data.results
      const measurementURL = results[0].measurement_url
      if (results.length > 1) {
        initialProps['warning'] = 'dupes'
      }
      let msmtContent = await client.get(measurementURL)
      initialProps['measurement'] = msmtContent.data
      initialProps['measurementURL'] = measurementURL
      initialProps['isAnomaly'] = results[0].anomaly
      initialProps['isFailure'] = results[0].failure
      initialProps['isConfirmed'] = results[0].confirmed
      initialProps['scores'] = results[0].scores || null
      const countryObj = countryUtil.countryList.find(country => (
        country.iso3166_alpha2 === msmtContent.data.probe_cc
      ))

      initialProps['country'] = countryObj ? countryObj.name : 'Unknown'
    }
    return initialProps
  }

  constructor(props) {
    super(props)
  }

  render () {
    let {
      measurement,
      scores,
      country,
      measurementURL,
      isConfirmed,
      isAnomaly,
      isFailure
    } = this.props

    return (
      <Layout>
        <Head>
          <title>OONI Explorer</title>
        </Head>
        <MeasurementContainer
          isConfirmed={isConfirmed}
          isAnomaly={isAnomaly}
          isFailure={isFailure}
          country={country}
          measurement={measurement}
          scores={scores}
          render={({
            status = 'default',
            statusIcon,
            statusLabel,
            statusInfo,
            legacy = false,
            summaryText,
            details }) => (

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
                color={pageColors[status]}
                measurement={measurement}
                country={country} />

              <Container>
                <DetailsHeader
                  testName={measurement.test_name}
                  runtime={measurement.test_runtime}
                  notice={legacy}
                  url={`measurement/${measurement.report_id}`}
                />

                {summaryText && <SummaryText
                  testName={measurement.test_name}
                  testUrl={measurement.input}
                  network={measurement.probe_asn}
                  country={country}
                  date={measurement.test_start_time}
                  content={summaryText}
                />}
                {details}
                <CommonDetails
                  measurementURL={measurementURL}
                  measurement={measurement} />
              </Container>
            </React.Fragment>
          )} />
      </Layout>
    )
  }
}

Measurement.propTypes = {
  measurement: PropTypes.object.isRequired,
  measurementURL: PropTypes.string,
  isAnomaly: PropTypes.bool,
  isFailure: PropTypes.bool,
  isConfirmed: PropTypes.bool,
  country: PropTypes.string
}
