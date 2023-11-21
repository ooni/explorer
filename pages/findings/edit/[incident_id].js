import Head from 'next/head'
import NavBar from 'components/NavBar'
import { Container, Heading, Button, Flex } from 'ooni-components'
import { updateIncidentReport, fetcher, apiEndpoints } from '/lib/api'
import { useIntl } from 'react-intl'
import NLink from 'next/link'
import Form from 'components/findings/Form'
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
    if (!user && !loading) router.replace('/findings')
    if ((data && !data.incident.mine) && user?.role !== 'admin') router.replace('/findings')
  }, [user, loading, router, data])

  const defaultValues = useMemo(() => {
    if (data) {
      const { update_time, mine, ...rest } = data.incident
      rest.start_time = rest.start_time.split('T')[0]
      rest.end_time = rest?.end_time ? rest.end_time.split('T')[0] : null
      return rest
    } else {
      return null
    }
  }, [data])

  const onSubmit = (report) => {
    return updateIncidentReport(report).then((data) => router.push(`/findings/${data.id}`))
  }

  const { trigger, isMutating } = useSWRMutation(
    `DELETE${query.incident_id}`,
    () => deleteIncidentReport({id: query.incident_id}),
    {
      onSuccess: () => {
        router.push('/findings/dashboard')
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
        <Flex justifyContent="space-between" alignItems="center">
          <Heading h={1}>{intl.formatMessage({id: 'Findings.Edit.Title'})}</Heading>
          <NLink href='/findings/dashboard'><Button hollow>{intl.formatMessage({id: 'Findings.Dashboard.Short'})}</Button></NLink>
        </Flex>
        {defaultValues && (
          <>
            <Form onSubmit={onSubmit} defaultValues={defaultValues} />
            <Button 
              hollow
              mt={4}
              sx={{ color: 'red7', borderColor: 'red7', '&:hover&:enabled': {color: 'red9', borderColor: 'red9'} }}
              onClick={() => trigger()}
              loading={isMutating}
              disabled={isMutating}
              spinner={<ButtonSpinner />}
            >{intl.formatMessage({id: 'Findings.Edit.Delete'})}</Button>
          </>
        )}
      </Container>
    </>
  )
}

export default EditReport
