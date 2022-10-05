/* global process */
import React, { useCallback, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { useRouter } from  'next/router'
import axios from 'axios'
import {
  Container,
  Heading,
  Flex, Box, Button,
  Link
} from 'ooni-components'
import useSWR from 'swr'
import { FormattedMessage, useIntl } from 'react-intl'

import Layout from 'components/Layout'
import NavBar from 'components/NavBar'
import { MATContextProvider } from 'components/aggregation/mat/MATContext'
import { StackedBarChart } from 'components/aggregation/mat/StackedBarChart'
import { FunnelChart } from 'components/aggregation/mat/FunnelChart'
import { Form } from 'components/aggregation/mat/Form'
import { axiosResponseTime } from 'components/axios-plugins'
import TableView from 'components/aggregation/mat/TableView'
import { FaExternalLinkAlt } from 'react-icons/fa'
import FormattedMarkdown from 'components/FormattedMarkdown'
import Help from 'components/aggregation/mat/Help'
import dayjs from 'services/dayjs'
import { NoCharts } from 'components/aggregation/mat/NoCharts'

const baseURL = process.env.NEXT_PUBLIC_OONI_API
axiosResponseTime(axios)

export const getServerSideProps = async () => {
  const testNamesR = await axios.get(`${baseURL}/api/_/test_names`)
  if (Array.isArray(testNamesR.data.test_names)){
    return {
      props: {
        testNames: testNamesR.data.test_names
      }
    }
  } else {
    return {
      props: { testNames: [] }
    }
  }
}

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const fetcher = (query) => {
  const qs = new URLSearchParams(query).toString()
  const reqUrl = `${process.env.NEXT_PUBLIC_OONI_API}/api/v1/aggregation?${qs}`
  console.debug(`API Query: ${reqUrl}`)
  return axios.get(reqUrl).then(r => {
    return {
      data: r.data,
      loadTime: r.loadTime,
      url: r.config.url
    }
  }).catch(e => {
    // throw new Error(e?.response?.data?.error ?? e.message)
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    error.info = e.response.data.error
    error.status = e.response.status
    throw error
  })
}

const MeasurementAggregationToolkit = ({ testNames }) => {
  const intl = useIntl()
  const router = useRouter()

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

  // Upon mount, check if the page was accessed without query params
  // In that case, trigger a shallow navigation that shows a chart
  useEffect(() => {
    const { query } = router
    if (Object.keys(query).length === 0) {
      const today = dayjs.utc().add(1, 'day')
      const monthAgo = dayjs.utc(today).subtract(1, 'month')
      const href = {
        pathname: router.pathname,
        query: {
          test_name: 'web_connectivity',
          axis_x: 'measurement_start_day',
          since: monthAgo.format('YYYY-MM-DD'),
          until: today.format('YYYY-MM-DD'),
        },
      }
      router.push(href, href, { shallow: true })
    }
  // Ignore the dependency on `router` because we want
  // this effect to run only once, on mount, if query is empty.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shouldFetchData = router.pathname !== router.asPath
  // THIS IS TEMPORARY - in the next iteration users will be
  // able to set time_grain themselves
  const query = {...router.query, time_grain: 'day'}

  const { data, error, isValidating } = useSWR(
    () => shouldFetchData ? [query] : null,
    fetcher,
    swrOptions
  )

  const showLoadingIndicator = useMemo(() => isValidating, [isValidating])

  let linkToAPIQuery = null
  try {
    linkToAPIQuery = `${process.env.NEXT_PUBLIC_OONI_API}/api/v1/aggregation?${new URLSearchParams(query).toString()}`
  } catch (e) {
    console.error(`Failed to construct API query link: ${e.message}`)
  }

  return (
    <MATContextProvider>
      <Head>
        <title>OONI Measurement Aggregation Toolkit</title>
      </Head>
      <NavBar />
      <Container>
        <Flex flexDirection='column'>
          <Heading h={1} mt={3} mb={0}><FormattedMessage id='MAT.Title' /></Heading>
          <Heading h={5} mt={0} mb={2} color='gray9'>
            <FormattedMessage id='MAT.SubTitle' />
          </Heading>
          <Form onSubmit={onSubmit} testNames={testNames} query={router.query} />
          {error &&
            <NoCharts message={error?.info ?? JSON.stringify(error)} />
          }
          <Box sx={{ minHeight: '500px' }}>
            {showLoadingIndicator &&
              <Box>
                <h2>{intl.formatMessage({id: 'General.Loading'})}</h2>
              </Box>
            }
            {data && data.data.dimension_count == 0 &&
                <FunnelChart data={data.data.result} />
            }
            {data && data.data.dimension_count == 1 &&
                <StackedBarChart data={data} query={query} />
            }
            {data && data.data.dimension_count > 1 &&
                <TableView data={data.data.result} query={query} />
            }
          </Box>
          {linkToAPIQuery &&
            <Box mt={[3]} ml={['unset', 'auto']}>
              <Flex>
                <Box>
                  <Link as='a' href={linkToAPIQuery} target='_blank' title='opens in new tab'>{intl.formatMessage({id: 'MAT.JSONData'})}<FaExternalLinkAlt />
                  </Link>
                </Box>
                <Box ml={2}>
                  <Link href={`${linkToAPIQuery}&format=CSV`} target='_blank' title='opens in new tab'>{intl.formatMessage({id: 'MAT.CSVData'})}<FaExternalLinkAlt />
                  </Link>
                </Box>
              </Flex>
            </Box>
          }
          <Box my={4}>
            <Help />
          </Box>
        </Flex>
      </Container>
    </MATContextProvider>
  )
}

MeasurementAggregationToolkit.propTypes = {
  testNames: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  )
}

export default MeasurementAggregationToolkit
