import React from 'react'
import Head from 'next/head'
import NLink from 'next/link'

import NoSSR from 'react-no-ssr'

import axios from 'axios'

import {
  Flex, Grid, Box,
  Divider,
  Container,
  Heading,
  Text,
  Link
} from 'ooni-components'

import NavBar from '../components/NavBar'
import Layout from '../components/layout'

// We wrap the json viewer so that we can render it only in client side rendering
class JsonViewer extends React.Component {
  render() {
    const ReactJson = require('react-json-view').default
    const {
      src
    } = this.props
    return (
      <ReactJson src={src} />
    )
  }
}

export default class extends React.Component {

  static async getInitialProps ({ req, query }) {
    let initialProps = {}
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})
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
      const measurementUrl = msmtResult.data.results[0].measurement_url
      if (msmtResult.data.results.length > 1) {
        initialProps['warning'] = 'dupes'
      }
      let msmtContent = await client.get(measurementUrl)
      initialProps['measurement'] = msmtContent.data
    }
    return initialProps
  }

  constructor(props) {
    super(props)
  }

  render () {
    const navItems = [
      {
        label: 'Search',
        href: '/search',
        active: false
      },
      {
        label: 'Results',
        href: '/results',
        active: false
      },
      {
        label: 'Countries',
        href: '/countries',
        active: false
      },
      {
        label: 'About',
        href: '/about',
        active: false
      },
    ]
    let {
      measurement,
      warning
    } = this.props;
    return (
      <Layout>
        <Head>
          <title>OONI Explorer</title>
        </Head>
        <NavBar items={navItems} />

        <Container>

          <Heading h={2}>Raw Measurement Data</Heading>

          <NoSSR>
            <JsonViewer src={measurement} />
          </NoSSR>
        </Container>
      </Layout>
    )
  }
}
