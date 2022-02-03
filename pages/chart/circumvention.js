import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Container, Heading } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import axios from 'axios'

import Layout from 'components/Layout'
import NavBar from 'components/NavBar'
import { MetaTags } from 'components/dashboard/MetaTags'
import { Form } from 'components/dashboard/Form'
import Charts from 'components/dashboard/Charts'

const DashboardCircumvention = ({ availableCountries }) => {
  const router = useRouter()
  const query = router.query

  // Sync page URL params with changes from form values
  const onChange = useCallback(({ since, until, probe_cc }) => {
    // since: "2022-01-02",
    // until: "2022-02-01",
    // probe_cc: "IT,AL,IR"
    const params = {
      since,
      until
    }
    if (probe_cc) {
      params['probe_cc'] = probe_cc
    }
    const href = {
      pathname: router.pathname,
      query: params,
    }
    if (query.since !== since
      || query.until !== until
      || query.probe_cc !== probe_cc
    ) {
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

// Fetch list of countries for which we have data for circumvention tools
// Used to populate the country selection list in the form
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