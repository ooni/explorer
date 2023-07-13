import Head from 'next/head'
import NavBar from 'components/NavBar'
import { Container, Heading } from 'ooni-components'

import { updateIncidentReport, fetcher, apiEndpoints } from '/lib/api'
import { useIntl } from 'react-intl'
import Form from 'components/reports/Form'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useEffect, useMemo } from 'react'
import useUser from 'hooks/useUser'

const EditReport = () => {
  const intl = useIntl()
  const router = useRouter()
  const { loading, user } = useUser()

  useEffect(() => {
    if (!user && !loading) router.push('/reports')
  }, [user, loading])

  const { query } = router

  const { data, error } = useSWR(
    query.incident_id && user
      ? apiEndpoints.SHOW_INCIDENT.replace(':incident_id', query.incident_id)
      : null,
    fetcher
  )

  const defaultValues = useMemo(() => {
    if (data) {
      const { update_time, ...rest } = data.incident
      return rest
    } else {
      return null
    }
  }, [data])


  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1}>Edit Report</Heading>
        {defaultValues && <Form onSubmit={updateIncidentReport} defaultValues={defaultValues} />}
      </Container>
    </>
  )
}

export default EditReport
