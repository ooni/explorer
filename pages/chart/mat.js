import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import MATChart from 'components/MATChart'
import { Form } from 'components/aggregation/mat/Form'
import Help from 'components/aggregation/mat/Help'
import { FaExternalLinkAlt } from 'react-icons/fa'
import dayjs from 'services/dayjs'

const MeasurementAggregationToolkit = () => {
  const intl = useIntl()
  const router = useRouter()
  const { query } = router

  const onSubmit = useCallback(
    (data) => {
      // const { v5, loni, ...rest } = data
      const { ...rest } = data
      const params = {}

      // if (v5) {
      //   params.loni = 'outcome'
      // }

      for (const p of Object.keys(rest)) {
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
    [router],
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
  }, [router.isReady])

  let linkToAPIQuery = null
  try {
    linkToAPIQuery = `${process.env.NEXT_PUBLIC_OONI_API}/api/v1/aggregation?${new URLSearchParams(
      query,
    ).toString()}`
  } catch (e) {
    console.error(`Failed to construct API query link: ${e.message}`)
  }

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'MAT.Title' })}</title>
      </Head>
      <div className="container">
        <div className="flex flex-col">
          <h1 className="mt-4">
            <FormattedMessage id="MAT.Title" />
          </h1>
          <h5 className="mb-2">
            <FormattedMessage id="MAT.SubTitle" />
          </h5>
          <Form onSubmit={onSubmit} query={router.query} />
          <MATChart query={query} />
          {linkToAPIQuery && (
            <div className="flex mt-4 justify-start md:justify-end">
              <a
                className="flex items-center"
                href={linkToAPIQuery}
                target="_blank"
                title="opens in new tab"
                rel="noreferrer"
              >
                {intl.formatMessage({ id: 'MAT.JSONData' })}
                <FaExternalLinkAlt className="ml-1" />
              </a>
              <a
                className="flex items-center ml-3"
                href={`${linkToAPIQuery}&format=CSV`}
                target="_blank"
                title="opens in new tab"
                rel="noreferrer"
              >
                {intl.formatMessage({ id: 'MAT.CSVData' })}
                <FaExternalLinkAlt className="ml-1" />
              </a>
            </div>
          )}
          <div className="my-8">
            <Help />
          </div>
        </div>
      </div>
    </>
  )
}

export default MeasurementAggregationToolkit
