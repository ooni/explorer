import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

import axios from 'axios'

import CommonSummary from '../components/measurement/CommonSummary'
import CommonDetails from '../components/measurement/CommonDetails'
import Layout from '../components/layout'

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
      const { name: country } = countries.find(c =>
        c.alpha_2 === msmtContent.data.probe_cc
      )
      initialProps['country'] = country
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

    return (
      <Layout>
        <Head>
          <title>OONI Explorer</title>
        </Head>

        <CommonSummary
          measurement={measurement}
          country={country} />

        <CommonDetails measurement={measurement} />

      </Layout>
    )
  }
}

Measurement.propTypes = {
  measurement: PropTypes.object.isRequired,
  country: PropTypes.string
}
