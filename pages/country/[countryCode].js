import axios from 'axios'
import CountryDetails from 'components/country/CountryDetails'
import ErrorPage from 'pages/_error'
import { getReports } from '../../lib/api'

export async function getServerSideProps({ res, query }) {
  const { countryCode } = query
  if (countryCode.length > 2) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    }
  }

  if (res && countryCode !== countryCode.toUpperCase()) {
    res.writeHead(301, {
      Location: `/country/${countryCode.toUpperCase()}`,
    })

    res.end()
  }

  try {
    const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
    const results = await Promise.all([
      client.get('/api/_/country_overview', {
        params: { probe_cc: countryCode },
      }),
    ])

    const overviewStats = results[0].data
    const reports = await getReports(`country-${countryCode.toLowerCase()}`)

    return {
      props: {
        overviewStats,
        reports,
        countryCode,
      },
    }
  } catch (error) {
    return {
      props: {
        error: JSON.stringify(error?.message),
      },
    }
  }
}

const Country = ({ countryCode, overviewStats, reports, error }) => {
  return (
    <>
      {error ? (
        <ErrorPage statusCode={501} error={error} />
      ) : (
        <CountryDetails
          countryCode={countryCode}
          overviewStats={overviewStats}
          reports={reports}
        />
      )}
    </>
  )
}

export default Country
