import Head from 'next/head'
import NavBar from 'components/NavBar'
import { Container } from 'ooni-components'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '/lib/api'
import { useRouter } from 'next/router'

import SpinLoader from 'components/vendor/SpinLoader'
import NotFound from 'components/NotFound'
import FindingDisplay from 'components/findings/FindingDisplay'
import { useIntl } from 'react-intl'
import { useMemo } from 'react'

const ReportView = () => {
  const { query } = useRouter()
  const intl = useIntl()

  const { data, error, loading } = useSWR(
    query.incident_id
      ? apiEndpoints.SHOW_INCIDENT.replace(':incident_id', query.incident_id)
      : null,
    fetcher
  )

  const metaTitle = useMemo(() => (data?.incident?.title || intl.formatMessage({ id: 'General.OoniExplorer' })), [data])
  const metaDescription = useMemo(() => (data?.incident?.short_description || ''), [data])

  return (
    <>
      <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta
        key="og:title"
        property="og:title"
        content={metaTitle}
      />
      <meta
        key="og:description"
        property="og:description"
        content={metaDescription}
      />
    </Head>
      <NavBar />
      <Container>
        {loading && <SpinLoader />}
        {error && <NotFound title="Report not found" />}
        {data && <FindingDisplay report={data.incident} />}
      </Container>
    </>
  )
}

export default ReportView
