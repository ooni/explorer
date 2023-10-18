/* global process */
import React, { useCallback, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Container, Heading, Flex, Box, Button, Link } from 'ooni-components'
import useSWR from 'swr'
import { FormattedMessage, useIntl } from 'react-intl'

import NavBar from 'components/NavBar'
import { Form } from 'components/aggregation/mat/Form'
import { FaExternalLinkAlt } from 'react-icons/fa'
import Help from 'components/aggregation/mat/Help'
import dayjs from 'services/dayjs'
import MATChart from 'components/MATChart'

const MeasurementAggregationToolkit = () => {
  const intl = useIntl()
  const router = useRouter()
  const { query } = router

  const onSubmit = useCallback(
    (data) => {
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
    },
    [router]
  )

  // Upon mount, check if the page was accessed without query params
  // In that case, trigger a shallow navigation that shows a chart
  useEffect(() => {
    if (router.isReady) {
      const today = dayjs.utc().add(1, 'day')
      const monthAgo = dayjs.utc(today).subtract(1, 'month')
      const href = {
        query: {
          test_name: 'web_connectivity',
          axis_x: 'measurement_start_day',
          since: monthAgo.format('YYYY-MM-DD'),
          until: today.format('YYYY-MM-DD'),
          time_grain: 'day',
          ...query,
        },
      }
      router.replace(href, undefined, { shallow: true })
    }
    // Ignore the dependency on `router` because we want
    // this effect to run only once, on mount, if query is empty.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  let linkToAPIQuery = null
  try {
    linkToAPIQuery = `${process.env.NEXT_PUBLIC_OONI_API}/api/v1/aggregation?${new URLSearchParams(
      query
    ).toString()}`
  } catch (e) {
    console.error(`Failed to construct API query link: ${e.message}`)
  }

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'MAT.Title' })}</title>
      </Head>
      <NavBar />
      <Container>
        <Flex flexDirection="column">
          <Heading h={1} mt={3} mb={0}>
            <FormattedMessage id="MAT.Title" />
          </Heading>
          <Heading h={5} mt={0} mb={2} color="gray9">
            <FormattedMessage id="MAT.SubTitle" />
          </Heading>
          <Form onSubmit={onSubmit} query={router.query} />
          <MATChart query={query} />
          {linkToAPIQuery && (
            <Box mt={[3]} ml={['unset', 'auto']}>
              <Flex>
                <Box>
                  <Link as="a" href={linkToAPIQuery} target="_blank" title="opens in new tab">
                    {intl.formatMessage({ id: 'MAT.JSONData' })}
                    <FaExternalLinkAlt />
                  </Link>
                </Box>
                <Box ml={2}>
                  <Link
                    href={`${linkToAPIQuery}&format=CSV`}
                    target="_blank"
                    title="opens in new tab"
                  >
                    {intl.formatMessage({ id: 'MAT.CSVData' })}
                    <FaExternalLinkAlt />
                  </Link>
                </Box>
              </Flex>
            </Box>
          )}
          <Box my={4}>
            <Help />
          </Box>
        </Flex>
      </Container>
    </>
  )
}

export default MeasurementAggregationToolkit
