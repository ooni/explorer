import { useIntl } from 'react-intl'

import ThematicPage from 'components/ThematicPage'
import { getThematicData } from 'lib/api'

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
  'news.yahoo.com',
  'www.cnbc.com',
  'www.voanews.com',
  'www.reuters.com',
  'www.rt.com',
  'www.nbcnews.com',
  'abcnews.go.com',
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
      title={intl.formatMessage({ id: 'Navbar.NewsMedia' })}
      findingsTitle="Findings on blocking News Media Websites"
      reportsTitle="Reports on blocking News Media Websites"
      menu={
        <>
          <a href="#findings">Findings</a>
          <a href="#reports">Reports</a>
          <a href="#websites">Websites</a>
        </>
      }
      text={
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            tristique pharetra lectus a malesuada. Proin blandit justo eu porta
            aliquam. Curabitur sed aliquam nunc. Nam non justo at arcu
            condimentum ultrices. Donec at cursus sapien. Suspendisse
            condimentum ex eu imperdiet pretium. Nulla blandit ex dui, id
            ullamcorper tellus ultrices a. Suspendisse eleifend nisl dui, in
            viverra ex blandit ullamcorper. Fusce consectetur nunc vel posuere
            vehicula. Quisque vel magna nibh.
          </p>
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
