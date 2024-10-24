import { useIntl } from 'react-intl'

import FormattedMarkdown from 'components/FormattedMarkdown'
import ThematicPage from 'components/ThematicPage'
import { getThematicData } from 'lib/api'

const CIRCUMVENTION_DOMAINS = [
  'www.torproject.org',
  'psiphon.ca',
  'lantern.io',
  'www.tunnelbear.com',
  'www.getoutline.org',
  'www.hotspotshield.com',
  'nordvpn.com',
  'protonvpn.com',
  'www.expressvpn.com',
  'www.ipvanish.com',
  'www.privateinternetaccess.com',
  'surfshark.com',
  'www.purevpn.com',
  'www.cyberghostvpn.com',
  'mullvad.net',
  'windscribe.com',
  'strongvpn.com',
  'www.vyprvpn.com',
  'goosevpn.com',
  'ultrasurf.us',
  'ultravpn.com',
]

const CIRCUMVENTION_TESTS = ['psiphon', 'tor', 'torsf']

export async function getStaticProps() {
  try {
    const { reports, findings, countries, selectedCountries } =
      await getThematicData('circumvention')

    return {
      props: {
        reports,
        findings,
        countries,
        selectedCountries,
      },
    }
  } catch (e) {
    console.error(e)
    // Sentry.captureException(e)
  }
}

const Page = (props) => {
  const intl = useIntl()
  const domains = CIRCUMVENTION_DOMAINS.sort((a, b) => {
    return a.replace('www.', '').localeCompare(b.replace('www.', ''))
  })

  return (
    <ThematicPage
      domains={domains}
      apps={CIRCUMVENTION_TESTS}
      {...props}
      theme="circumvention"
      title={intl.formatMessage({ id: 'Navbar.Circumvention' })}
      findingsTitle="Findings on blocking Circumvention Tools/Websites"
      reportsTitle="Reports on blocking Circumvention Tools/Websites"
      menu={
        <>
          <a href="#findings">Findings</a>
          <a href="#reports">Reports</a>
          <a href="#apps">Circumvention Tools</a>
          <a href="#websites">Websites</a>
        </>
      }
      text={
        <>
          <FormattedMarkdown id="ReachabilityDash.CircumventionTools.Description" />
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

export default Page
