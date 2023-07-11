import Head from 'next/head'
import NavBar from '/components/NavBar'
import { Container, Heading } from 'ooni-components'
import { createIncidentReport } from '/lib/api'
import { useIntl } from 'react-intl'
import Form from '/components/reports/Form'

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

  const onSubmit = (report) => {
    createIncidentReport(report)
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
