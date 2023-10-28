import Head from 'next/head'
import { Container, Heading, Flex, Button } from 'ooni-components'
import { useIntl } from 'react-intl'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NLink from 'next/link'
import dayjs from 'services/dayjs'
import { getUserEmail } from 'lib/api'
import { createIncidentReport } from 'lib/api'
import NavBar from 'components/NavBar'
import Form from 'components/incidents/Form'
import useUser from 'hooks/useUser'
import LoginRequiredModal from 'components/incidents/LoginRequiredModal'
import SpinLoader from 'components/vendor/SpinLoader'

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
    if (!user && !loading && !showModal) router.push('/incidents')
  }, [user, loading, showModal])

  useEffect(() => {
    if (user && !loading && !getUserEmail()) setShowModal(true)
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
      {user ?
        <Container>
          <LoginRequiredModal show={showModal} />
          <Flex justifyContent="space-between" alignItems="center">
            <Heading h={1}>{intl.formatMessage({id: 'Incidents.Create.Title'})}</Heading>
            <NLink href='/incidents/dashboard'><Button hollow>{intl.formatMessage({id: 'Incidents.Dashboard.Short'})}</Button></NLink>
          </Flex>
          <Form onSubmit={onSubmit} defaultValues={defaultValues} />
        </Container> :
        <Container pt={6}><SpinLoader /></Container>
      }
    </>
  )
}

export default CreateReport
