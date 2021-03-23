import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Container } from 'ooni-components'

import Layout from '../../../components/Layout'
import NavBar from '../../../components/NavBar'
import WebsiteInCountry from '../../../components/aggregation/website/WebsiteInCountry'

const WebsiteInCountryPage = () => {
  const router = useRouter()
  const { query } = router
  query.axis_x = 'measurement_start_day'
  return (
    <Layout>
      <Head>
        <title>
          {`${query.input} in ${query.probe_cc}`}
        </title>
      </Head>
      <NavBar />
      <Container>
        <WebsiteInCountry params={query} />
      </Container>
    </Layout>
  )
}

export default WebsiteInCountryPage
