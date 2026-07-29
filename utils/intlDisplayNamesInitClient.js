import '@formatjs/intl-displaynames/polyfill-force.js'
import '@formatjs/intl-displaynames/locale-data/en' // default

// Next.js locale → @formatjs/intl-displaynames locale-data module
const toFormatjsLocale = (locale) => {
  if (locale === 'zh-CN') return 'zh-Hans'
  if (locale === 'pt-BR') return 'pt'
  return locale || 'en'
}

const localeDataLoaders = {
  ar: () => import('@formatjs/intl-displaynames/locale-data/ar'),
  de: () => import('@formatjs/intl-displaynames/locale-data/de'),
  es: () => import('@formatjs/intl-displaynames/locale-data/es'),
  fa: () => import('@formatjs/intl-displaynames/locale-data/fa'),
  fr: () => import('@formatjs/intl-displaynames/locale-data/fr'),
  is: () => import('@formatjs/intl-displaynames/locale-data/is'),
  km: () => import('@formatjs/intl-displaynames/locale-data/km'),
  my: () => import('@formatjs/intl-displaynames/locale-data/my'),
  pt: () => import('@formatjs/intl-displaynames/locale-data/pt'),
  ru: () => import('@formatjs/intl-displaynames/locale-data/ru'),
  sw: () => import('@formatjs/intl-displaynames/locale-data/sw'),
  th: () => import('@formatjs/intl-displaynames/locale-data/th'),
  tr: () => import('@formatjs/intl-displaynames/locale-data/tr'),
  vi: () => import('@formatjs/intl-displaynames/locale-data/vi'),
  'zh-Hans': () => import('@formatjs/intl-displaynames/locale-data/zh-Hans'),
  'zh-Hant': () => import('@formatjs/intl-displaynames/locale-data/zh-Hant'),
}

const loadedLocales = new Set(['en'])

/**
 * Loads Intl.DisplayNames locale data for the active app locale only.
 * Safe to call repeatedly; already-loaded locales are skipped.
 */
export const loadDisplayNamesLocale = async (locale) => {
  const formatjsLocale = toFormatjsLocale(locale)
  if (loadedLocales.has(formatjsLocale)) return

  const loader = localeDataLoaders[formatjsLocale]
  if (!loader) return

  await loader()
  loadedLocales.add(formatjsLocale)
}
