import { countryList } from 'country-util'
import '@formatjs/intl-displaynames/polyfill'

// eventually we can remove this, but currently Chrome doesn't have the translations for UN M.49 area codes implemented so we need to polyfill
process.env.LOCALES.forEach((locale) => {
  if (locale === 'pt_BR') locale = 'pt'
  if (locale === 'pt_PT') locale = 'pt-PT'
  if (locale === 'zh_CN') locale = 'zh-Hant'
  if (locale === 'zh_HK') locale = 'zh-Hant-HK'

  require(`@formatjs/intl-displaynames/locale-data/${locale}`)
})

export const getLocalisedRegionName = (regionCode, locale) => {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(String(regionCode))
  } catch (e) {
    return regionCode
  } 
}

export const getLocalisedLanguageName = (regionCode, locale) => {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(String(regionCode))
  } catch (e) {
    return regionCode
  } 
}

export const localisedCountries = (locale) => {
  return countryList.map((c) => ({
      ...c,
      localisedCountryName: getLocalisedRegionName(c.iso3166_alpha2, locale)
    })
  )
}