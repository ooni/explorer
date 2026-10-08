import Head from 'next/head'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

import StructuredData from 'components/StructuredData'

const BASE_URL = 'https://explorer.ooni.org'
const LOCALES = JSON.parse(process.env.LOCALES || '["en"]')

const Header = () => {
  const { asPath, locale, defaultLocale } = useRouter()

  const path = asPath.split('?')[0]
  const lang = locale === defaultLocale ? '' : `/${locale}`
  const canonical = `${BASE_URL}${lang}${path}`

  const intl = useIntl()
  const description = intl.formatMessage({ id: 'Home.Meta.Description' })
  const title = intl.formatMessage({ id: 'Home.Meta.Title' })

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={description} />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/static/images/favicons/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/static/images/favicons/android-icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/static/images/favicons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/static/images/favicons/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/static/images/favicons/favicon-16x16.png"
      />

      <link rel="canonical" key="canonical" href={canonical} />
      <meta property="og:url" key="og:url" content={canonical} />

      {LOCALES.map((loc) => {
        const prefix = loc === defaultLocale ? '' : `/${loc}`
        return (
          <link
            key={`hreflang-${loc}`}
            rel="alternate"
            hrefLang={loc}
            href={`${BASE_URL}${prefix}${path}`}
          />
        )
      })}
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${path}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta name="twitter:site" content="@openobservatory" />
      <meta name="twitter:creator" content="@openobservatory" />

      <meta key="og:title" property="og:title" content={title} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta property="og:type" content="website" />
      <StructuredData />
    </Head>
  )
}

export default Header
