import "@formatjs/intl-displaynames/polyfill"

import "@formatjs/intl-displaynames/locale-data/ar"
import "@formatjs/intl-displaynames/locale-data/de"
import "@formatjs/intl-displaynames/locale-data/en"
import "@formatjs/intl-displaynames/locale-data/es"
import "@formatjs/intl-displaynames/locale-data/fa"
import "@formatjs/intl-displaynames/locale-data/fr"
import "@formatjs/intl-displaynames/locale-data/my"
import "@formatjs/intl-displaynames/locale-data/pt"
import "@formatjs/intl-displaynames/locale-data/ru"
import "@formatjs/intl-displaynames/locale-data/sw"
import "@formatjs/intl-displaynames/locale-data/th"
import "@formatjs/intl-displaynames/locale-data/tr"
import "@formatjs/intl-displaynames/locale-data/vi"
import "@formatjs/intl-displaynames/locale-data/zh-Hans"
import "@formatjs/intl-displaynames/locale-data/zh-Hant"

import { countryList } from "country-util"

const getLocale = (locale) => {
	if (locale === "zh-CN") return "zh-Hans"
	if (locale === "pt-BR") return "pt"
	return locale;
};

export const getLocalisedRegionName = (regionCode, locale) => {
	try {
		return new Intl.DisplayNames([getLocale(locale)], { type: "region" }).of(
			String(regionCode),
		);
	} catch (e) {
		return regionCode
	}
};

export const getLocalisedLanguageName = (regionCode, locale) => {
	try {
		return new Intl.DisplayNames([getLocale(locale)], { type: "language" }).of(
			String(regionCode),
		);
	} catch (e) {
		return regionCode
	}
};

export const localisedCountries = (locale) => {
	return countryList.map((c) => ({
		...c,
		localisedCountryName: getLocalisedRegionName(c.iso3166_alpha2, locale),
	}));
};
