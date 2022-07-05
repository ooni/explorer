import React, { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Heading, Box } from 'ooni-components'
import { useIntl } from 'react-intl'
import { countryList } from 'country-util'

import Layout from 'components/Layout'
import NavBar from 'components/NavBar'
import { MetaTags } from 'components/dashboard/MetaTags'
import Form from 'components/network/Form'
import Chart from 'components/network/Chart'
import CallToActionBox from 'components/CallToActionBox'
import NLink from 'next/link'

const getCountryName = (cc) => {
  const country = countryList.find(o => o.iso3166_alpha2 === cc)
  return country ? country.name : cc
}

const ChartContainer = ({ domain, ...props }) => {
  const intl = useIntl()

  return (
    <Chart
      testName='web_connectivity'
      queryParams={{axis_y: 'probe_cc', domain}}
      {...props} />
  )
}

const Summary = ({ blockedCountries }) => {
  const intl = useIntl()
  const { query: {since, until} } = useRouter()

  return (
    <h3>
      {intl.formatMessage(
        {id: 'Domain.Summary'},
        {since,
        until,
        countries: blockedCountries.map((c, i) => (
            <>
              {i > 0 && ', '}
              <NLink passHref href={`/country/${c}`} key={c}>{ getCountryName(c) }</NLink>
            </>
          ))
        }
      )}
    </h3>
  )
}

const DomainDashboard = ({ domain }) => {
  const router = useRouter()
  const query = router.query
  const [state, setState] = useState([])

  const onChange = useCallback(({ since, until }) => {
    setState([])
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

  const blockedCountries = useMemo(() => {
    if (state) return [...new Set(state.filter((s, index, self) => s.confirmed_count > 0).map((s) => s.probe_cc))]
    return null
  }, [state])

  return (
    <Layout>
      <MetaTags />
      <NavBar />
      <Container>
        <Heading h={1} fontWeight='heading' my={20}>{domain} </Heading>
        {router.isReady &&
          <>
            {!!blockedCountries.length && <Summary blockedCountries={blockedCountries} />}
            <Form onChange={onChange} query={query} />
            <ChartContainer domain={domain} setState={setState} />
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