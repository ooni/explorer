import { useIntl } from 'react-intl'

import ThematicPage from 'components/ThematicPage'
import { getThematicData } from 'lib/api'
import FormattedMarkdown from 'components/FormattedMarkdown'
import { domainsList } from 'pages/social-media'

const NEWS_MEDIA_DOMAINS = [
  'www.bbc.com',
  'www.nytimes.com',
  'www.wsj.com',
  'www.dw.com',
  'www.aljazeera.com',
  'www.washingtonpost.com',
  'www.forbes.com',
  'edition.cnn.com',
  'news.google.com',
  'www.indiatimes.com',
  'www.theguardian.com',
  'www.cnbc.com',
  'www.voanews.com',
  'www.reuters.com',
  'www.rt.com',
  'www.nbcnews.com',
  'www.cbsnews.com',
  'www.aljazeera.net',
  'www.lemonde.fr',
  'www.theatlantic.com',
  'www.alarabiya.net',
  'www.alhurra.com',
  'www.euronews.com',
  'sputnikglobe.com',
  'www.rferl.org',
  'theintercept.com',
]

export async function getStaticProps() {
  try {
    const { reports, findings, countries, selectedCountries } =
      await getThematicData('news_media')

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
  const domains = NEWS_MEDIA_DOMAINS.sort((a, b) => {
    return a.replace('www.', '').localeCompare(b.replace('www.', ''))
  })

  return (
    <ThematicPage
      domains={domains}
      {...props}
      theme="news_media"
      title={intl.formatMessage({ id: 'ThematicPage.NewsMedia.Title' })}
      findingsTitle={intl.formatMessage({
        id: 'ThematicPage.NewsMedia.FindingsTitle',
      })}
      reportsTitle={intl.formatMessage({
        id: 'ThematicPage.NewsMedia.ReportsTitle',
      })}
      menu={
        <>
          <a href="#findings">
            {intl.formatMessage({ id: 'Navbar.Findings' })}
          </a>
          <a href="#reports">
            {intl.formatMessage({ id: 'ThematicPage.NavBar.Reports' })}
          </a>
          <a href="#websites">
            {intl.formatMessage({ id: 'ThematicPage.NavBar.Websites' })}
          </a>
        </>
      }
      text={
        <FormattedMarkdown
          id="ThematicPage.NewsMedia.Text"
          values={{
            domainsList: domainsList(domains),
          }}
        />
      }
    />
  )
}

export default Page
