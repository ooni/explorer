import Form from 'components/findings/Form'
import useUser from 'hooks/useUser'
import Head from 'next/head'
import NLink from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'ooni-components'
import { useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import ButtonSpinner from '../../../components/ButtonSpinner'
import { deleteIncidentReport } from '../../../lib/api'
import { apiEndpoints, fetcher, updateIncidentReport } from '/lib/api'

const EditReport = () => {
  const intl = useIntl()
  const router = useRouter()
  const { loading, user } = useUser()

  const { query } = router

  const { data, error } = useSWR(
    query.id && user
      ? apiEndpoints.SHOW_INCIDENT.replace(':id', query.id)
      : null,
    fetcher,
  )

  // redirect if user not logged in or not admin/report creator
  useEffect(() => {
    if (!user && !loading) router.replace('/findings')
    if (data && !data.incident.mine && user?.role !== 'admin')
      router.replace('/findings')
  }, [user, loading, router, data])

  const defaultValues = useMemo(() => {
    if (data) {
      const { update_time, mine, ...rest } = data.incident
      rest.start_time = rest.start_time.split('T')[0]
      rest.end_time = rest?.end_time ? rest.end_time.split('T')[0] : null
      return rest
    }
    return null
  }, [data])

  const onSubmit = (report) => {
    return updateIncidentReport(report).then((data) =>
      router.push(`/findings/${data.id}`),
    )
  }

  const { trigger, isMutating } = useSWRMutation(
    `DELETE${query.id}`,
    () => deleteIncidentReport({ id: query.id }),
    {
      onSuccess: () => {
        router.push('/findings/dashboard')
      },
    },
  )

  return (
    <>
      {/* <Head>
        <title></title>
      </Head> */}
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h1>{intl.formatMessage({ id: 'Findings.Edit.Title' })}</h1>
          <NLink href="/findings/dashboard">
            <Button hollow>
              {intl.formatMessage({ id: 'Findings.Dashboard.ShortTitle' })}
            </Button>
          </NLink>
        </div>
        {defaultValues && (
          <>
            <Form onSubmit={onSubmit} defaultValues={defaultValues} />
            <Button
              hollow
              mt={4}
              sx={{
                color: 'red7',
                borderColor: 'red7',
                '&:hover&:enabled': { color: 'red9', borderColor: 'red9' },
              }}
              onClick={() => trigger()}
              loading={isMutating}
              disabled={isMutating}
              spinner={<ButtonSpinner />}
            >
              {intl.formatMessage({ id: 'Findings.Edit.Delete' })}
            </Button>
          </>
        )}
      </div>
    </>
  )
}

export default EditReport
