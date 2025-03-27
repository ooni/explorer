import { useIntl } from 'react-intl'

import ThematicPage from 'components/ThematicPage'
import { getThematicData } from 'lib/api'
import FormattedMarkdown from 'components/FormattedMarkdown'

const SOCIAL_MEDIA_IM_DOMAINS = [
  'www.facebook.com',
  'www.instagram.com',
  'www.linkedin.com',
  'twitter.com',
  'www.youtube.com',
  'www.tiktok.com',
  'www.wechat.com',
  'www.snapchat.com',
  'discord.com',
  'www.viber.com',
  'signal.org',
  'www.reddit.com',
]

const SOCIAL_MEDIA_IM_TESTS = [
  'telegram',
  'whatsapp',
  'signal',
  'facebook_messenger',
]

export const SOCIAL_MEDIA_TESTS_STRINGS = {
  telegram: 'Tests.Telegram.Name',
  facebook_messenger: 'Tests.Facebook.Name',
  whatsapp: 'Tests.WhatsApp.Name',
  signal: 'Tests.Signal.Name',
  psiphon: 'Tests.Psiphon.Name',
  tor: 'Tests.Tor.Name',
  torsf: 'Tests.TorSnowflake.Name',
}

export const domainsList = (domains) =>
  `<ul className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 my-4'>${domains.map((d) => `<li><a href='#${d}'>${d}</a></li>`).join('')}</ul>`

export const getServerSideProps = async () => {
  try {
    const { reports, findings, countries, selectedCountries } =
      await getThematicData(['social_media', 'im'])

    return {
      props: {
        reports,
        countries,
        findings,
        selectedCountries,
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

const Page = (props) => {
  const intl = useIntl()
  const domains = SOCIAL_MEDIA_IM_DOMAINS.sort((a, b) => {
    return a.replace('www.', '').localeCompare(b.replace('www.', ''))
  })

  return (
    <ThematicPage
      domains={domains}
      apps={SOCIAL_MEDIA_IM_TESTS}
      {...props}
      theme="social_media"
      title={intl.formatMessage({ id: 'ThematicPage.SocialMedia.Title' })}
      findingsTitle={intl.formatMessage({
        id: 'ThematicPage.SocialMedia.FindingsTitle',
      })}
      reportsTitle={intl.formatMessage({
        id: 'ThematicPage.SocialMedia.ReportsTitle',
      })}
      appSectionTitle={intl.formatMessage({
        id: 'ThematicPage.NavBar.Apps',
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
            {intl.formatMessage({ id: 'ThematicPage.NavBar.Apps' })}
          </a>
          <a href="#websites">
            {intl.formatMessage({ id: 'ThematicPage.NavBar.Websites' })}
          </a>
        </>
      }
      text={
        <FormattedMarkdown
          id="ThematicPage.SocialMedia.Text"
          values={{
            domainsList: domainsList(domains),
            appsList: `<ul className="my-4">${SOCIAL_MEDIA_IM_TESTS.map(
              (d) =>
                `<li><a href='#${d}'>${intl.formatMessage({
                  id: SOCIAL_MEDIA_TESTS_STRINGS[d],
                })}</a></li>`,
            ).join('')}</ul>`,
          }}
        />
      }
    />
  )
}

export default Page
