import useSWR from 'swr'
import AlertList from 'components/alerts/list'
import SpinLoader from 'components/vendor/SpinLoader'

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

const Alerts = () => {
  const SINCE = '2012-01-01'
  const until = new Date().toISOString().slice(0, 10)
  const params = new URLSearchParams({ since: SINCE, until }).toString()
  const requestUrl = `${ALERTS_ENDPOINT}?${params}`

  const {
    data: changepoints,
    error,
    isLoading,
  } = useSWR(requestUrl, fetcher, {
    revalidateOnFocus: false,
  })

  return (
    <div className="container mx-auto">
      <h1 className="my-8">Alerts</h1>
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
