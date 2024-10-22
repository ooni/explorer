import { useIntl } from 'react-intl'

import ThematicPage from 'components/ThematicPage'
import { getThematicData } from 'lib/api'

const SOCIAL_MEDIA_IM_DOMAINS = [
  'www.facebook.com',
  'www.instagram.com',
  'www.whatsapp.com',
  'twitter.com',
  'www.youtube.com',
  'www.tiktok.com',
  'www.wechat.com',
  'www.snapchat.com',
  'telegram.org',
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
    // console.log('=====', error)
    return {
      props: {
        error: JSON.stringify(error?.message),
      },
    }
  }
}

const Page = (props) => {
  console.log('props', props)
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
      title={intl.formatMessage({ id: 'Navbar.SocialMedia' })}
      findingsTitle="Findings on blocking Social Media & IM Tools/Websites"
      reportsTitle="Reports on blocking Social Media & IM Tools/Websites"
      menu={
        <>
          <a href="#findings">Findings</a>
          <a href="#reports">Reports</a>
          <a href="#apps">IM Apps</a>
          <a href="#websites">Websites</a>
        </>
      }
      text={
        // <FormattedMarkdown id="ReachabilityDash.CircumventionTools.Description" />
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
          <ul className="columns-4">
            {domains.map((d) => (
              <li key={d}>
                <a href={`#${d}`}>{d}</a>
              </li>
            ))}
          </ul>
          <p>
            In porta lorem neque. Nam tincidunt iaculis pretium. Fusce massa
            urna, lobortis ut velit in, bibendum maximus felis. Integer sed
            pretium metus, in rhoncus elit. Maecenas placerat turpis at odio
            congue, vitae sagittis elit pharetra. Mauris vehicula nisl lectus,
            non suscipit sem consequat eget. Maecenas vitae mi mi.
          </p>
          <ul className="mt-4">
            {SOCIAL_MEDIA_IM_TESTS.map((d) => (
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
