import Head from 'next/head'
import NavBar from '/components/NavBar'
import { Container, Heading } from 'ooni-components'
import { createIncidentReport } from '/lib/api'
import { useIntl } from 'react-intl'
import Form from '/components/reports/Form'
import useUser from 'hooks/useUser'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const defaultValues = {
  reported_by: null,
  title: null,
  text: null,
  published: false,
  start_time: null,
  end_time: null,
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
    if (!user && !loading) router.push('/reports')
  }, [user, loading])

  const onSubmit = (report) => {
    return createIncidentReport(report).then((data) => router.push(`/reports/${data.id}`))
  }

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1}>Create Report</Heading>
        <Form onSubmit={onSubmit} defaultValues={defaultValues} />
      </Container>
    </>
  )
}

export default CreateReport
