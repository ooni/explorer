import { createIncidentReport, getUserEmail } from 'lib/api'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
  themes: [],
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
    return createIncidentReport(report).then((data) =>
      router.push(`/findings/${data.id}`),
    )
  }

  return (
    <>
      {/* <Head>
        <title></title>
      </Head> */}
      {user ? (
        <div className="container">
          <LoginRequiredModal show={showModal} />
          <div className="flex justify-between items-center">
            <h1 className="mt-16 mb-8">
              {intl.formatMessage({ id: 'Findings.Create.Title' })}
            </h1>
            <Link href="/findings/dashboard">
              <button className="btn btn-primary-hollow" type="button">
                {intl.formatMessage({ id: 'Findings.Dashboard.ShortTitle' })}
              </button>
            </Link>
          </div>
          <Form onSubmit={onSubmit} defaultValues={defaultValues} />
        </div>
      ) : (
        <div className="container pt-32">
          <SpinLoader />
        </div>
      )}
    </>
  )
}

export default Create
