import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

import axios from 'axios'
import { Container } from 'ooni-components'

import StatusHeader from '../components/measurement/StatusHeader'
import CommonSummary from '../components/measurement/CommonSummary'
import DetailsHeader from '../components/measurement/DetailsHeader'
import SummaryText from '../components/measurement/SummaryText'
import CommonDetails from '../components/measurement/CommonDetails'
import renderDetails from '../components/measurement/renderDetails'

import Layout from '../components/Layout'
import NavBar from '../components/nav-bar'

import { checkAnomaly as checkAnomalyWeb} from '../components/measurement/nettests/web_connectivity'

const anomalyCheckers = {
  web_connectivity: checkAnomalyWeb
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
    let [msmtResult, countriesR] = await Promise.all([
      client.get('/api/v1/measurements', {
        params
      }),
      client.get('/api/_/countries')
    ])
    if (msmtResult.data.results.length > 0) {
      const measurementUrl = msmtResult.data.results[0].measurement_url
      if (msmtResult.data.results.length > 1) {
        initialProps['warning'] = 'dupes'
      }
      let msmtContent = await client.get(measurementUrl)
      initialProps['measurement'] = msmtContent.data

      let countries = countriesR.data.countries
      const countryObj = countries.find(c =>
        c.alpha_2 === msmtContent.data.probe_cc
      )
      initialProps['country'] = (countryObj) ? countryObj.name : 'Unknown'
    }
    return initialProps
  }

  constructor(props) {
    super(props)
  }

  render () {
    let {
      measurement,
      country
    } = this.props

    const anomaly = anomalyCheckers[measurement.test_name](measurement.test_keys)
    const color = anomaly ? '#E67700': '#2F9E44'
    return (
      <Layout>
        <Head>
          <title>OONI Explorer</title>
        </Head>
        <NavBar color={color} />
        <StatusHeader
          anomaly={anomaly}
          color={color}
        />
        <CommonSummary
          color={color}
          measurement={measurement}
          country={country} />

        <Container>
          <DetailsHeader testName={measurement.test_name} runtime={measurement.test_runtime} />

          <SummaryText
            testName={measurement.test_name}
            testUrl={measurement.input}
            network={measurement.probe_asn}
            country={country}
            date={measurement.test_start_time}
          />

          {renderDetails(measurement.test_name, measurement.test_keys)}

          <CommonDetails measurement={measurement} />
        </Container>

      </Layout>
    )
  }
}

Measurement.propTypes = {
  measurement: PropTypes.object.isRequired,
  country: PropTypes.string
}
