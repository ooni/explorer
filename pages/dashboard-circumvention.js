import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Container, Heading } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import axios from 'axios'

import Layout from '../components/Layout'
import NavBar from '../components/NavBar'
import { MetaTags } from '../components/dashboard/MetaTags'
import { Form } from '../components/dashboard/Form'
import Charts from '../components/dashboard/Charts'

const DashboardCircumvention = ({ availableCountries }) => {
  const router = useRouter()
  const query = router.query

  const onChange = useCallback(({ since, until, probe_cc }) => {
    // Use since,until from form 
    // Use country list as probe_cc=CN,AL,IN
    const probe_ccFlat = probe_cc.join(',')
    const params = {
      since,
      until,
      probe_cc: probe_ccFlat
    }
    const href = {
      pathname: router.pathname,
      query: params,
    }
    if (query.since !== since || query.until !== until || query.probe_cc !== probe_ccFlat) {
      router.push(href, href, { shallow: true })
    }

  }, [router, query])

  return (
    <Layout>
      <MetaTags />
      <NavBar />
      <Container>
        <Heading h={1}><FormattedMessage id='ReachabilityDash.Heading.CircumventionTools' /></Heading>
        {router.isReady && <React.Fragment>
          <Form onChange={onChange} query={query} availableCountries={availableCountries} />
          <Charts />
        </React.Fragment>}
      </Container>
    </Layout>
  )
}

export async function getServerSideProps () {
  let availableCountries = []
  try {
    const client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL}) // eslint-disable-line
    const res = await client.get('/api/_/circumvention_stats_by_country')
    const { results } = res.data

    availableCountries = results.map(d => d.probe_cc)

  } catch (e) {
    console.error(e)
    // Sentry.captureException(e)
  } finally {
    return {
      props: {
        availableCountries
      }
    }
  }
}

export default DashboardCircumvention