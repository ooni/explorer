import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { loadDisplayNamesLocale } from 'utils/intlDisplayNamesInitClient'

// Statically imported so it is always available immediately (no dynamic bundling needed)
import enMessages from 'public/static/lang/en.json'

export const getDirection = (locale) => {
  switch (locale) {
    case 'fa':
    case 'ar':
      return 'rtl'
    default:
      return 'ltr'
  }
}

export const LocaleProvider = ({ children }) => {
  const { locale, defaultLocale } = useRouter()
  const [messages, setMessages] = useState(enMessages)

  useEffect(() => {
    let cancelled = false

    const loadLocale = async () => {
      await loadDisplayNamesLocale(locale)

      if (locale === defaultLocale) {
        if (!cancelled) setMessages(enMessages)
        return
      }
      try {
        const res = await fetch(`/static/lang/${locale}.json`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const localeMessages = await res.json()
        if (!cancelled) setMessages({ ...enMessages, ...localeMessages })
      } catch (e) {
        console.error(`Failed to load messages for ${locale}: ${e.message}`)
        if (!cancelled) setMessages(enMessages)
      }
    }

    loadLocale()
    return () => {
      cancelled = true
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
