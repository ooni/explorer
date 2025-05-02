import Head from 'next/head'
import { useIntl } from 'react-intl'

const strings = {
  social_media: [
    'ThematicPage.SocialMedia.MetaTags.Title',
    'ThematicPage.SocialMedia.MetaTags.Description',
  ],
  news_media: [
    'ThematicPage.NewsMedia.MetaTags.Title',
    'ThematicPage.NewsMedia.MetaTags.Description',
  ],
  circumvention: [
    'ThematicPage.Circumvention.MetaTags.Title',
    'ThematicPage.Circumvention.MetaTags.Description',
  ],
}

export const MetaTags = ({ theme }) => {
  const intl = useIntl()
  const title = intl.formatMessage({
    id: strings[theme][0],
  })
  const description = intl.formatMessage({
    id: strings[theme][1],
  })

  return (
    <Head>
      <title>{title}</title>
      <meta key="og:title" property="og:title" content={title} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta name="description" content={description} />
    </Head>
  )
}
