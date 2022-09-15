import React, { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Heading, Box, Flex, Text } from 'ooni-components'
import { FormattedMessage, useIntl } from 'react-intl'
import { countryList } from 'country-util'
import axios from 'axios'

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

const Canonical = ({canonicalDomain}) => {
  const intl = useIntl()
  return (
    <Text mb={20}>
      {intl.formatMessage(
        {id: 'Domain.Canonical'},
        {canonicalDomain: (<NLink passHref href={`/domain/${canonicalDomain}`}>{canonicalDomain}</NLink>)
        }
      )}
    </Text>
  )
}

const DomainDashboard = ({ domain, categoryCode, canonicalDomain }) => {
  const router = useRouter()
  const query = router.query
  const [state, setState] = useState([])
  const IconComponent = require(`ooni-components/dist/icons/CategoryCode${categoryCode}`).default

  const hasCanonical = domain !== canonicalDomain

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
    return state ?
      [...new Set(state.filter((s, index, self) => s.confirmed_count > 0).map((s) => s.probe_cc))] :
      []
  }, [state])

  return (
    <Layout>
      <MetaTags />
      <NavBar />
      <Container>
        <Flex mt={40} alignItems='center'>
          <IconComponent height='35' width='35' />
          <Heading h={4} my={0} ml={10}><FormattedMessage id={`CategoryCode.${categoryCode}.Name`} /></Heading>
        </Flex>
        <Heading h={1} fontWeight='heading' mt={0} mb={20}>{domain}</Heading>
        {router.isReady &&
          <>
            {!!blockedCountries.length && <Summary blockedCountries={blockedCountries} />}
            {hasCanonical && <Canonical canonicalDomain={canonicalDomain} />}
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

  if (/^((xn--)?[a-z0-9\-]*\.)+((xn--)?[a-z0-9]*)$/.test(domain)) {
    const client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL})
    const path = '/api/_/domain_metadata'

    const { canonical_domain: canonicalDomain, category_code: categoryCode } = await client
      .get(path, {params: {domain}})
      .then((response)=> response.data)
    
    return {
      props: { 
        domain, 
        canonicalDomain, 
        categoryCode 
      }
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