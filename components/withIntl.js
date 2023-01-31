/* global require */
import React, { useMemo } from 'react'
import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'

export const getDirection = locale => {
  switch (locale) {
    case 'fa':
      return 'rtl'
    default:
      return 'ltr'
  }
}

export const LocaleProvider = ({ children }) => {
  const { locale, defaultLocale } = useRouter()

  const messages = useMemo(() => {
    try {
      const messages = require(`../public/static/lang/${locale}.json`)
      const defaultMessages = require(`../public/static/lang/${defaultLocale}.json`)

      const mergedMessages = Object.assign({}, defaultMessages, messages)
      return mergedMessages
    } catch (e) {
      console.error(`Failed to load messages for ${locale}: ${e.message}`)
      const defaultMessages = require(`../public/static/lang/${defaultLocale}.json`)
      return defaultMessages
    }
  }, [locale, defaultLocale])
  
  const fixedLocale = (locale) => {
    if (locale === 'pt_BR') return 'pt'
    if (locale === 'pt_PT') return 'pt-PT'
    if (locale === 'zh_CN') return 'zh-Hant'
    if (locale === 'zh_HK') return 'zh-Hant-HK'
    return locale
  }

  return (
    <IntlProvider 
      defaultLocale={defaultLocale}
      locale={fixedLocale(locale)}
      messages={messages}
      key={locale}
    >
      {children}
    </IntlProvider>
  )
}
