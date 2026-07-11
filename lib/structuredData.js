export const EXPLORER_BASE_URL = 'https://explorer.ooni.org'
export const ORGANIZATION_ID = 'https://ooni.org/#organization'

const SUPPORTED_LANGUAGES = [
  'en',
  'zh-Hant',
  'zh-CN',
  'vi',
  'tr',
  'th',
  'sw',
  'ru',
  'pt-BR',
  'my',
  'km',
  'is',
  'fr',
  'fa',
  'es',
  'de',
  'ar',
]

export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'NGO',
      '@id': ORGANIZATION_ID,
      name: 'Open Observatory of Network Interference (OONI)',
      alternateName: 'OONI',
      url: 'https://ooni.org/',
      logo: 'https://ooni.org/images/logos/ooni-horizontal.svg',
      foundingDate: '2012',
      description:
        'The Open Observatory of Network Interference (OONI) is a global community measuring internet censorship around the world. Run OONI Probe to detect internet censorship. Use OONI Explorer to track internet censorship worldwide in near real-time.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'via Baccio Baldini 12',
        postalCode: '00146',
        addressLocality: 'Rome',
        addressCountry: 'IT',
      },
      sameAs: [
        'https://twitter.com/OpenObservatory',
        'https://github.com/ooni',
        'https://www.youtube.com/c/OONIorg',
        'https://facebook.com/ooni.org',
        'https://www.instagram.com/openobservatory/',
        'https://mastodon.social/@ooni',
        'https://www.linkedin.com/company/ooniorg',
      ],
      potentialAction: {
        '@type': 'DonateAction',
        name: 'Donate to OONI',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://ooni.org/donate/',
        },
        recipient: {
          '@id': ORGANIZATION_ID,
        },
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${EXPLORER_BASE_URL}/#website`,
      url: `${EXPLORER_BASE_URL}/`,
      name: 'OONI Explorer',
      alternateName:
        'OONI Explorer - Open Data on Internet Censorship Worldwide',
      description:
        'OONI Explorer is an open data resource on Internet censorship around the world consisting of more than a billion measurements on network interference.',
      inLanguage: SUPPORTED_LANGUAGES,
      isAccessibleForFree: true,
      license: 'https://github.com/ooni/explorer/blob/master/LICENSE.md',
      copyrightHolder: {
        '@id': ORGANIZATION_ID,
      },
      publisher: {
        '@id': ORGANIZATION_ID,
      },
      // potentialAction: {
      //   '@type': 'SearchAction',
      //   target: {
      //     '@type': 'EntryPoint',
      //     urlTemplate: `${EXPLORER_BASE_URL}/search?input={search_term_string}`,
      //   },
      //   'query-input': 'required name=search_term_string',
      // },
    },
  ],
}
