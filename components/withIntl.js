/* global require */
import React, {useEffect, useState} from 'react'
import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'

export const LocaleProvider = ({ children, messages }) => {
  const { locale, defaultLocale } = useRouter()
  const now = Date.now()

  const sanitizedLocaleName = locale.replace('_', '-')

  return (
    <IntlProvider defaultLocale={defaultLocale} locale={sanitizedLocaleName} locales={['en', 'fr', 'de', 'fa', 'tr']} messages={messages} initialNow={now}>
      {children}
    </IntlProvider>
  )
}


