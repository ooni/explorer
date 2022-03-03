import Head from 'next/head'
import { useIntl } from 'react-intl'

export const MetaTags = () => {
  const intl = useIntl()
  const title = intl.formatMessage({ id: 'ReachabilityDash.Heading.CircumventionTools' })
  const description = intl.formatMessage({ id: 'ReachabilityDash.Meta.Description' })
  return (
    <Head>
      <title>{title}</title>
      <meta
        key="og:title"
        property="og:title"
        content={title}
      />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta
        name="description"
        content={description}
      />
    </Head>
  )
}