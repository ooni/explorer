import { createIncidentReport, getUserEmail } from 'lib/api'
import Head from 'next/head'
import NLink from 'next/link'
import { useRouter } from 'next/router'
import { Button, Container, Flex, Heading } from 'ooni-components'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'

import Form from 'components/findings/Form'
import LoginRequiredModal from 'components/findings/LoginRequiredModal'
import SpinLoader from 'components/vendor/SpinLoader'
import useUser from 'hooks/useUser'

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

const Create = () => {
  const intl = useIntl()
  const router = useRouter()
  const { loading, user } = useUser()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!user && !loading && !showModal) router.push('/findings')
  }, [user, loading, showModal])

  useEffect(() => {
    if (user && !loading && !getUserEmail()) setShowModal(true)
  }, [])

  const onSubmit = (report) => {
    return createIncidentReport(report).then((data) => router.push(`/findings/${data.id}`))
  }

  return (
    <>
      <Head>
        <title></title>
      </Head>
      {user ?
        <Container>
          <LoginRequiredModal show={showModal} />
          <Flex justifyContent="space-between" alignItems="center">
            <Heading h={1}>{intl.formatMessage({id: 'Findings.Create.Title'})}</Heading>
            <NLink href='/findings/dashboard'><Button hollow>{intl.formatMessage({id: 'Findings.Dashboard.ShortTitle'})}</Button></NLink>
          </Flex>
          <Form onSubmit={onSubmit} defaultValues={defaultValues} />
        </Container> :
        <Container pt={6}><SpinLoader /></Container>
      }
    </>
  )
}

export default Create
