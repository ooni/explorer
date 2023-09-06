import Head from 'next/head'
import NavBar from 'components/NavBar'
import { Container, Heading, Button } from 'ooni-components'

import { updateIncidentReport, fetcher, apiEndpoints } from '/lib/api'
import { useIntl } from 'react-intl'
import Form from 'components/incidents/Form'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useEffect, useMemo } from 'react'
import useUser from 'hooks/useUser'
import { deleteIncidentReport } from '../../../lib/api'
import ButtonSpinner from '../../../components/ButtonSpinner'

const EditReport = () => {
  const intl = useIntl()
  const router = useRouter()
  const { loading, user } = useUser()

  const { query } = router

  const { data, error } = useSWR(
    query.incident_id && user
      ? apiEndpoints.SHOW_INCIDENT.replace(':incident_id', query.incident_id)
      : null,
    fetcher
  )

  // redirect if user not logged in or not admin/report creator
  useEffect(() => {
    if (!user && !loading) router.replace('/incidents')
    if ((data && !data.incident.mine) && user?.role !== 'admin') router.replace('/incidents')
  }, [user, loading, router, data])

  const defaultValues = useMemo(() => {
    if (data) {
      const { update_time, mine, ...rest } = data.incident
      rest.start_time = rest.start_time.slice(0, -4)
      rest.end_time = rest?.end_time ? rest.end_time.slice(0, -4) : null
      return rest
    } else {
      return null
    }
  }, [data])

  const onSubmit = (report) => {
    return updateIncidentReport(report).then((data) => router.push(`/incidents/${data.id}`))
  }

  const { trigger, isMutating } = useSWRMutation(
    `DELETE${query.incident_id}`,
    () => deleteIncidentReport({id: query.incident_id}),
    {
      onSuccess: () => {
        router.push('/incidents/dashboard')
      },
    }
  )

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1}>Edit Report</Heading>
        {defaultValues && (
          <>
            <Form onSubmit={onSubmit} defaultValues={defaultValues} />
            <Button 
              hollow
              type="button"
              color="red"
              sx={{ borderColor: 'red' }}
              onClick={() => trigger()}
              loading={isMutating}
              disabled={isMutating}
              spinner={<ButtonSpinner />}
            >Delete</Button>
          </>
        )}
      </Container>
    </>
  )
}

export default EditReport
