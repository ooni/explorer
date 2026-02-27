import useSWR from 'swr'
import AlertList from 'components/alerts/list'
import SpinLoader from 'components/vendor/SpinLoader'
import AlertsForm from 'components/alerts/Form'
import { useRouter } from 'next/router'

const ALERTS_ENDPOINT =
  'https://oonimeasurements.dev.ooni.io/api/v1/detector/changepoints'

const fetcher = async (url) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  const json = await response.json()
  const sortedResults =
    json?.results?.sort((a, b) => {
      return new Date(b.start_time) - new Date(a.start_time)
    }) || []
  return sortedResults
}

const getParams = ({ since, until, probe_cc, probe_asn, domain }) => {
  return new URLSearchParams({
    since,
    until,
    ...(probe_cc && { probe_cc }),
    ...(probe_asn && { probe_asn }),
    ...(domain && { domain }),
  }).toString()
}
const Alerts = () => {
  const router = useRouter()
  const { since, until, probe_cc, probe_asn, domain } = router.query
  const params =
    since && until
      ? getParams({ since, until, probe_cc, probe_asn, domain })
      : null
  const requestUrl = params ? `${ALERTS_ENDPOINT}?${params}` : null

  const {
    data: changepoints,
    error,
    isLoading,
  } = useSWR(requestUrl ? requestUrl : null, fetcher, {
    revalidateOnFocus: false,
  })

  return (
    <div className="container mx-auto">
      <h1 className="my-8">Alerts</h1>
      <AlertsForm />
      {isLoading && (
        <div className="container pt-32 flex justify-center items-center">
          <SpinLoader />
        </div>
      )}
      {error && <p>{error.message}</p>}
      {changepoints && <AlertList changepoints={changepoints} />}
    </div>
  )
}

export default Alerts
