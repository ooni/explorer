import { countryList } from 'country-util'

const getLocale = (locale) => {
  if (locale === 'zh-CN') return 'zh-Hans'
  if (locale === 'pt-BR') return 'pt'
  return locale
}

export const getLocalisedRegionName = (regionCode, locale) => {
  try {
    return new Intl.DisplayNames([getLocale(locale)], { type: 'region' }).of(String(regionCode))
  } catch (e) {
    return regionCode
  }
}

export const getLocalisedLanguageName = (regionCode, locale) => {
  try {
    return new Intl.DisplayNames([getLocale(locale)], { type: 'language' }).of(String(regionCode))
  } catch (e) {
    return regionCode
  }
}

// Native language names (language name in that language). Static so the
// language picker does not need Intl.DisplayNames polyfills on the client.
export const LANGUAGE_NATIVE_NAMES = {
  en: 'English',
  'zh-Hant': '繁體中文',
  'zh-CN': '中文（中国）',
  vi: 'Tiếng Việt',
  tr: 'Türkçe',
  th: 'ไทย',
  sw: 'Kiswahili',
  ru: 'русский',
  'pt-BR': 'português (Brasil)',
  my: 'မြန်မာ',
  km: 'ខ្មែរ',
  is: 'íslenska',
  fr: 'français',
  fa: 'فارسی',
  es: 'español',
  de: 'Deutsch',
  ar: 'العربية',
}

export const localisedCountries = (locale) => {
  return countryList.map((c) => ({
    ...c,
    localisedCountryName: getLocalisedRegionName(c.iso3166_alpha2, locale),
  }))
}
