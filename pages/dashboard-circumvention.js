import React, { useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Container, Heading } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import useSWR from 'swr'
import axios from 'axios'

import Layout from '../components/Layout'
import NavBar from '../components/NavBar'
import { Form } from '../components/dashboard/Form'
import { Charts } from '../components/dashboard/Charts'
import { axiosResponseTime } from '../components/axios-plugins'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const baseURL = process.env.NEXT_PUBLIC_MEASUREMENTS_URL
axiosResponseTime(axios)

// TODO export from mat.js
const fetcher = (query) => {
  console.log(query)
  const qs = new URLSearchParams(query).toString()
  const reqUrl = `${baseURL}/api/v1/aggregation?${qs}`
  return axios.get(reqUrl).then(r => {
    return {
      data: r.data,
      loadTime: r.loadTime,
      url: r.config.url
    }
  })
}

const DashboardCircumvention = () => {

  const router = useRouter()
  const query = router.query

  console.log(router)
  const shouldFetchData = router.pathname !== router.asPath
  const { data, error, isValidating } = useSWR(
    [query],
    // () => shouldFetchData ? [query] : null,
    fetcher,
    swrOptions
  )

  const onSubmit = useCallback((data) => {
    let params = {}
    for (const p of Object.keys(data)) {
      if (data[p] !== '') {
        params[p] = data[p]
      }
    }
    const href = {
      pathname: router.pathname,
      query: params,
    }
    return router.push(href, href, { shallow: true })

  }, [router])

  return (
    <Layout>
      <Head>
        <title>Internet Censorship around the world | OONI Explorer</title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1}><FormattedMessage id='ReachabilityDash.Heading.CircumventionTools' /></Heading>
        <Form onSubmit={onSubmit} query={router.query} />
        <Charts />
        shouldFetchData: {shouldFetchData.toString()}
      </Container>
    </Layout>
  )
}

export default DashboardCircumvention