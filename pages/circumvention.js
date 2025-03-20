import { useIntl } from 'react-intl'

import FormattedMarkdown from 'components/FormattedMarkdown'
import ThematicPage from 'components/ThematicPage'
import { getThematicData } from 'lib/api'
import { domainsList } from 'pages/social-media'

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

export const CIRCUMVENTION_TESTS_STRINGS = {
  psiphon: 'Tests.Psiphon.Name',
  tor: 'Tests.Tor.Name',
  torsf: 'Tests.TorSnowflake.Name',
}

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
      findingsTitle={intl.formatMessage({
        id: 'ThematicPage.Circumvention.FindingsTitle',
      })}
      reportsTitle={intl.formatMessage({
        id: 'ThematicPage.Circumvention.ReportsTitle',
      })}
      menu={
        <>
          <a href="#findings">
            {intl.formatMessage({ id: 'Navbar.Findings' })}
          </a>
          <a href="#reports">
            {intl.formatMessage({ id: 'ThematicPage.NavBar.Reports' })}
          </a>
          <a href="#apps">
            {intl.formatMessage({
              id: 'Country.Overview.TestsByClass.Circumvention',
            })}
          </a>
          <a href="#websites">
            {intl.formatMessage({ id: 'ThematicPage.NavBar.Websites' })}
          </a>
        </>
      }
      text={
        <FormattedMarkdown
          id="ReachabilityDash.CircumventionTools.Description"
          values={{
            domainsList: domainsList(domains),
            appsList: `<ul className="my-4">${CIRCUMVENTION_TESTS.map(
              (d) =>
                `<li><a href='#${d}'>${intl.formatMessage({
                  id: CIRCUMVENTION_TESTS_STRINGS[d],
                })}</a></li>`,
            ).join('')}</ul>`,
          }}
        />
      }
    />
  )
}

export default Page
