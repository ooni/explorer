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

export const localisedCountries = (locale) => {
  return countryList.map((c) => ({
    ...c,
    localisedCountryName: getLocalisedRegionName(c.iso3166_alpha2, locale),
  }))
}
