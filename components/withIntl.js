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

  return (
    <IntlProvider 
      defaultLocale={defaultLocale}
      locale={locale}
      messages={messages}
      key={locale}
    >
      {children}
    </IntlProvider>
  )
}
