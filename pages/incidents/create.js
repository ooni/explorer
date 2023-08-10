import Head from 'next/head'
import NavBar from '/components/NavBar'
import { Container, Heading } from 'ooni-components'
import { createIncidentReport } from '/lib/api'
import { useIntl } from 'react-intl'
import Form from '/components/incidents/Form'
import useUser from 'hooks/useUser'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const defaultValues = {
  reported_by: '',
  title: '',
  text: '',
  published: false,
  start_time: '',
  end_time: '',
  tags: [],
  CCs: [],
  ASNs: [],
  links: [],
  domains: [],
  event_type: 'incident',
}

const CreateReport = () => {
  const intl = useIntl()
  const router = useRouter()
  const { loading, user } = useUser()

  useEffect(() => {
    if (!user && !loading) router.push('/incidents')
  }, [user, loading])

  const onSubmit = (report) => {
    return createIncidentReport(report).then((data) => router.push(`/incidents/${data.id}`))
  }

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1}>Create Incident Report</Heading>
        <Form onSubmit={onSubmit} defaultValues={defaultValues} />
      </Container>
    </>
  )
}

export default CreateReport
