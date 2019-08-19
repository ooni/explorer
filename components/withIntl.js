/* global require */
import React, {Component} from 'react'
import { IntlProvider, addLocaleData, injectIntl } from 'react-intl'

let messages = {
  en: require('../static/lang/en.json')
}

const getLocale = () => {
  let navigatorLang = 'en-US'
  if (typeof window !== 'undefined') {
    navigatorLang = window.navigator.userLanguage || window.navigator.language
  }
  return navigatorLang.split('-')[0]
}

if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
  Object.keys(window.ReactIntlLocaleData).forEach((lang) => {
    addLocaleData(window.ReactIntlLocaleData[lang])
  })
}

if (typeof window !== 'undefined' && window.OONITranslations) {
  messages = window.OONITranslations
}

const withIntl = (Page) => {
  const IntlPage = injectIntl(Page)

  return class PageWithIntl extends Component {
    render () {
      const now = Date.now()
      let locale = getLocale()
      // Use 'en' when locale is unsupported
      if (Object.keys(messages).indexOf(locale) < 0) {
        locale = 'en'
      }
      const messagesToLoad = Object.assign({}, messages[locale], messages['en'])
      return (
        <IntlProvider locale={locale} messages={messagesToLoad} initialNow={now}>
          <IntlPage {...this.props} />
        </IntlProvider>
      )
    }
  }
}

export default withIntl
