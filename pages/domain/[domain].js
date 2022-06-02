import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Container, Heading, Box } from 'ooni-components'
import { useIntl } from 'react-intl'
import Layout from 'components/Layout'
import NavBar from 'components/NavBar'
import { MetaTags } from 'components/dashboard/MetaTags'
import Form from 'components/network/Form'
import Chart from 'components/network/Chart'
import CallToActionBox from 'components/CallToActionBox'

const ChartContainer = ({ domain }) => {
  const intl = useIntl()
  return (
    <Chart
      testName='web_connectivity'
      queryParams={{axis_y: 'probe_cc', domain}} />
  )
}

const DomainDashboard = ({ domain }) => {
  const router = useRouter()
  const query = router.query

  const onChange = useCallback(({ since, until }) => {
    const params = {
      since,
      until,
    }
    const href = {
      pathname: router.pathname.replace('[domain]', domain),
      query: params,
    }
    if (query.since !== since
      || query.until !== until
    ) {
      router.push(href, href, { shallow: true })
    }

  }, [router, query, domain])

  return (
    <Layout>
      <MetaTags />
      <NavBar />
      <Container>
        <Heading h={1} fontWeight='heading' my={20}>{domain} </Heading>
        {router.isReady &&
          <>
            <Form onChange={onChange} query={query} />
            <ChartContainer domain={domain} />
          </>
        }
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async (context) => {
  const { domain } = context.query

  if (/^((xn--)?[a-z0-9]*\.)+((xn--)?[a-z0-9]*)$/.test(domain)) {
    return {
      props: { domain }
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: '/404'
    }
  }
}

export default DomainDashboard