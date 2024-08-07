import axios from 'axios'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import FormattedMarkdown from 'components/FormattedMarkdown'
import Charts from 'components/dashboard/Charts'
import { Form } from 'components/dashboard/Form'
import { MetaTags } from 'components/dashboard/MetaTags'

const DashboardCircumvention = ({ availableCountries }) => {
  const router = useRouter()
  const query = router.query

  useEffect(() => {
    const { query } = router
    const tomorrow = dayjs.utc().add(1, 'day').format('YYYY-MM-DD')
    const monthAgo = dayjs.utc().subtract(30, 'day').format('YYYY-MM-DD')
    const probe_cc = ['CN', 'IR', 'RU'].join(',')
    const href = {
      query: {
        since: monthAgo,
        until: tomorrow,
        probe_cc,
        ...query,
      },
    }
    router.replace(href, undefined, { shallow: true })
  }, [])

  // Sync page URL params with changes from form values
  const onChange = useCallback(
    ({ since, until, probe_cc }) => {
      // since: "2022-01-02",
      // until: "2022-02-01",
      // probe_cc: "IT,AL,IR"
      const params = {
        since,
        until,
      }
      if (probe_cc) {
        params.probe_cc = probe_cc
      }
      if (
        query.since !== since ||
        query.until !== until ||
        query.probe_cc !== probe_cc
      ) {
        router.push({ query: params }, undefined, { shallow: true })
      }
    },
    [router, query],
  )

  return (
    <>
      <MetaTags />
      <div className="container">
        <h1 className="mt-4">
          <FormattedMessage id="ReachabilityDash.Heading.CircumventionTools" />
        </h1>
        <div className="my-2 bg-gray-50 p-4">
          <FormattedMarkdown id="ReachabilityDash.CircumventionTools.Description" />
        </div>
        {Object.keys(query).length > 0 && (
          <>
            <Form
              onChange={onChange}
              query={query}
              availableCountries={availableCountries}
            />
            <Charts />
          </>
        )}
      </div>
    </>
  )
}

// Fetch list of countries for which we have data for circumvention tools
// Used to populate the country selection list in the form
export async function getServerSideProps() {
  let availableCountries = []
  try {
    const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API }) // eslint-disable-line
    const res = await client.get('/api/_/circumvention_stats_by_country')
    const { results } = res.data

    availableCountries = results.map((d) => d.probe_cc)
  } catch (e) {
    console.error(e)
    // Sentry.captureException(e)
  } finally {
    return {
      props: {
        availableCountries,
      },
    }
  }
}

export default DashboardCircumvention
