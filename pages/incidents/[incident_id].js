import Head from 'next/head'
import NavBar from 'components/NavBar'
import { Container } from 'ooni-components'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '/lib/api'
import { useRouter } from 'next/router'

import SpinLoader from 'components/vendor/SpinLoader'
import NotFound from 'components/NotFound'
import ReportDisplay from '../../components/incidents/ReportDisplay'

const ReportView = () => {
  const { query } = useRouter()

  const { data, error, loading } = useSWR(
    query.incident_id
      ? apiEndpoints.SHOW_INCIDENT.replace(':incident_id', query.incident_id)
      : null,
    fetcher
  )

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        {loading && <SpinLoader />}
        {error && <NotFound title="Report not found" />}
        {data && <ReportDisplay report={data.incident} />}
      </Container>
    </>
  )
}

export default ReportView
