import Head from 'next/head'
import NavBar from 'components/NavBar'
import { Container, Heading } from 'ooni-components'

import { updateIncidentReport, fetcher, apiEndpoints } from '/lib/api'
import { useIntl } from 'react-intl'
import Form from 'components/incidents/Form'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useEffect, useMemo } from 'react'
import useUser from 'hooks/useUser'

const EditReport = () => {
  const intl = useIntl()
  const router = useRouter()
  const { loading, user } = useUser()

  useEffect(() => {
    if (!user && !loading) router.push('/incidents')
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
      const { update_time, mine, ...rest } = data.incident
      rest.start_time = rest.start_time.slice(0, -4)
      return rest
    } else {
      return null
    }
  }, [data])

  const onSubmit = (report) => {
    return updateIncidentReport(report).then((data) => router.push(`/incidents/${data.id}`))
  }

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1}>Edit Report</Heading>
        {defaultValues && <Form onSubmit={onSubmit} defaultValues={defaultValues} />}
      </Container>
    </>
  )
}

export default EditReport
