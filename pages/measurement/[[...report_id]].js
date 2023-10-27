import axios from 'axios'
import { useIntl } from 'react-intl'
import NavBar from 'components/NavBar'
import ErrorPage from 'pages/_error'
import NotFound from '../../components/NotFound'
import { useIntl } from 'react-intl'

export async function getServerSideProps({ query }) {
  let error = null

  // Get `report_id` using optional catch all dynamic route of Next.js
  // Doc: https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes 
  // e.g /measurement/20211015T162758Z_webconnectivity_TH_23969_n1_d11S0T15FaOuXgFO
  // It can also catch /measurement/report_id/extra/segments
  // in which case, the extra segments are available inside query.report_id[1+]
  const report_id = query?.report_id?.[0]
  // If there is no report_id to use, fail early with NotFound
  if (typeof report_id !== 'string' || !report_id.match(/[a-zA-Z0-9_-]{40,100}/)) {
    return {
      props: {}
    }
  }

  const client = axios.create({baseURL: process.env.NEXT_PUBLIC_OONI_API}) // eslint-disable-line
  const params = {
    report_id,
    full: true
  }
  if (query.input) {
    params['input'] = query.input
  }

  let response
  try {
    response = await client.get('/api/v1/measurement_meta', { params })
  } catch (e) {
    error = `Failed to fetch measurement data. Server message: ${e.response.status}, ${e.response.statusText}`
  }

  if (response?.data?.measurement_uid) {
    return {
      redirect: {
        destination: `/m/${response.data.measurement_uid}`,
        statusCode: 301,
      },
    }
  }

  return { 
    props: {
      ...(error && error)
    }
  }
}

const Measurement = ({ error }) => {
  const intl = useIntl()

  return (
    <>
      <NavBar />
      {error ? 
        <ErrorPage statusCode={501} error={error} /> : 
        <NotFound title={intl.formatMessage({id: 'Measurement.NotFound' })} />
      } 
    </>
  )
}

export default Measurement
