import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Container, Heading, Box, Flex } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import Form from 'components/network/Form'

import Layout from 'components/Layout'
import NavBar from 'components/NavBar'
import { MetaTags } from 'components/dashboard/MetaTags'
import FormattedMarkdown from 'components/FormattedMarkdown'

import WebConnectivityChart from 'components/network/WebConnectivityChart'
import MessagingAppsChart from 'components/network/MessagingAppsChart'
import CircumventionToolChart from 'components/network/CircumventionToolsChart'

const ChartsContainer = () => {
  return (
    <>
      <WebConnectivityChart />
      <MessagingAppsChart />
      <CircumventionToolChart />
    </>
  )
}

const NetworkDashboard = ({asn}) => {
  const router = useRouter()
  const query = router.query

  // Sync page URL params with changes from form values
  const onChange = useCallback(({ since, until }) => {
    // since: "2022-01-02",
    // until: "2022-02-01",
    const params = {
      since,
      until,
    }
    const href = {
      pathname: router.pathname.replace('[asn]', asn),
      query: params,
    }
    if (query.since !== since
      || query.until !== until
    ) {
      router.push(href, href, { shallow: true })
    }

  }, [router, query, asn])

  return (
    <Layout>
      <MetaTags />
      <NavBar />
      <Container>
        {router.isReady && 
          <React.Fragment>
            <Form onChange={onChange} query={query} />
            <ChartsContainer />
          </React.Fragment>
        }
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async (context) => {
  const { asn } = context.query
  // if (!asn) asn = null
  return { props: { asn } }
}

export default NetworkDashboard