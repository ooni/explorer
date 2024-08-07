import axios from 'axios'
import CountryDetails from 'components/country/CountryDetails'
import ErrorPage from 'pages/_error'

const getCountryReports = (countryCode, data) => {
  const reports = data
    .filter(
      (article) =>
        article.tags &&
        article.tags.indexOf(`country-${countryCode.toLowerCase()}`) > -1,
    )
    .map((article) => article)
  return reports
}

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
    const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API }) // eslint-disable-line
    const results = await Promise.all([
      // XXX cc @darkk we should ideally have better dedicated daily dumps for this view
      client.get('/api/_/test_coverage', { params: { probe_cc: countryCode } }),
      client.get('/api/_/country_overview', {
        params: { probe_cc: countryCode },
      }),
      client.get('https://ooni.org/pageindex.json'),
    ])
    const testCoverage = results[0].data.test_coverage
    const networkCoverage = results[0].data.network_coverage
    const overviewStats = results[1].data
    const reports = getCountryReports(countryCode, results[2].data)

    return {
      props: {
        testCoverage,
        networkCoverage,
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

const Country = ({
  countryCode,
  overviewStats,
  reports,
  error,
  ...coverageDataSSR
}) => {
  return (
    <>
      {error ? (
        <ErrorPage statusCode={501} error={error} />
      ) : (
        <CountryDetails
          countryCode={countryCode}
          overviewStats={overviewStats}
          reports={reports}
          coverageDataSSR={coverageDataSSR}
        />
      )}
    </>
  )
}

export default Country
