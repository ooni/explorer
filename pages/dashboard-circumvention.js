import React, { useCallback, useEffect, useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box, Container, Heading } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import Layout from '../components/Layout'
import NavBar from '../components/NavBar'
import { Form } from '../components/dashboard/Form'
import Charts from '../components/dashboard/Charts'


const Debug = ({ summary, details }) => (
  <Box my={2}>
    <details>
      <summary>{summary}</summary>
      <pre>{details}</pre>
    </details>
  </Box>
)

const DashboardCircumvention = () => {

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
      <Head>
        <title>Internet Censorship around the world | OONI Explorer</title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1}><FormattedMessage id='ReachabilityDash.Heading.CircumventionTools' /></Heading>
        {router.isReady && <React.Fragment>
          <Form onChange={onChange} query={query} />
          <Charts />
        </React.Fragment>}
      </Container>
    </Layout>
  )
}

export default DashboardCircumvention