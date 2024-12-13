import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

import ThematicPage from 'components/ThematicPage'
import { getCountries, getReports } from 'lib/api'

export const getServerSideProps = async () => {
  try {
    const reports = await getReports('theme-human_rights')
    const countries = await getCountries()

    return {
      props: {
        reports,
        countries,
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

const HUMAN_RIGHTS_DOMAINS = [
  'www.amnesty.org',
  'www.hrw.org',
  'freedomhouse.org',
  'www.omct.org',
  'www.awid.org',
  'www.fidh.org',
]

const HumanRights = (props) => {
  const intl = useIntl()
  const router = useRouter()
  const { query } = router

  // Sync page URL params with changes from form values
  const onSubmit = (data) => {
    const params = {}
    for (const p of Object.keys(data)) {
      if (data[p]) {
        params[p] = data[p]
      }
    }
    // since: "2022-01-02",
    // until: "2022-02-01",

    const { since, until, probe_cc } = params

    if (
      query.since !== since ||
      query.until !== until ||
      query.probe_cc !== probe_cc
    ) {
      router.push({ query: params }, undefined, { shallow: true })
    }
  }

  const domains = HUMAN_RIGHTS_DOMAINS.sort((a, b) => {
    return a.replace('www.', '').localeCompare(b.replace('www.', ''))
  })

  return (
    <ThematicPage
      domains={domains}
      {...props}
      theme="human_rights"
      title={intl.formatMessage({ id: 'Navbar.HumanRights' })}
      findingsTitle="Findings on blocking Human Rights Websites"
      reportsTitle="Reports on blocking Human Rights Websites"
      menu={
        <>
          <a href="#findings">Findings</a>
          <a href="#reports">Reports</a>
          <a href="#websites">Websites</a>
        </>
      }
      text={
        <>
          {/* <FormattedMarkdown id="ReachabilityDash.CircumventionTools.Description" /> */}
          <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {domains.map((d) => (
              <li key={d}>
                <a href={`#${d}`}>{d}</a>
              </li>
            ))}
          </ul>
        </>
      }
    />
  )
}

export default HumanRights
