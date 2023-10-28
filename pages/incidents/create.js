import Head from 'next/head'
import NavBar from '/components/NavBar'
import { Container, Heading, Flex, Button } from 'ooni-components'
import { createIncidentReport } from '/lib/api'
import { useIntl } from 'react-intl'
import Form from '/components/incidents/Form'
import useUser from 'hooks/useUser'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getUserEmail } from 'lib/api'
import dayjs from 'services/dayjs'
import NLink from 'next/link'
import LoginRequiredModal from 'components/incidents/LoginRequiredModal'

const defaultValues = {
  reported_by: '',
  title: '',
  email_address: getUserEmail(),
  text: '',
  short_description: '',
  published: false,
  start_time: dayjs().startOf('date').format('YYYY-MM-DDTHH:mm'),
  end_time: '',
  tags: [],
  CCs: [],
  ASNs: [],
  test_names: [],
  links: [],
  domains: [],
  event_type: 'incident',
}

const CreateReport = () => {
  const intl = useIntl()
  const router = useRouter()
  const { loading, user } = useUser()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!user && !loading) router.push('/incidents')
  }, [user, loading])

  useEffect(() => {
    if (!getUserEmail()) setShowModal(true)
  }, [])

  const onSubmit = (report) => {
    return createIncidentReport(report).then((data) => router.push(`/incidents/${data.id}`))
  }

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <LoginRequiredModal show={showModal} />
      <Container>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading h={1}>{intl.formatMessage({id: 'Incidents.Create.Title'})}</Heading>
          <NLink href='/incidents/dashboard'><Button hollow>{intl.formatMessage({id: 'Incidents.Dashboard.Short'})}</Button></NLink>
        </Flex>
        <Form onSubmit={onSubmit} defaultValues={defaultValues} />
      </Container>
    </>
  )
}

export default CreateReport