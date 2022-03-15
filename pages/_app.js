//FROM: 
// https://github.com/zeit/next.js/blob/master/examples/with-sentry
// https://github.com/vercel/next.js/blob/canary/examples/with-loading/pages/_app.js
import 'scripts/wdyr'
import { useEffect, useMemo } from 'react'
import NProgress from 'nprogress'
import { useRouter } from 'next/router'
import 'fontsource-fira-sans/latin.css'

import '../public/static/nprogress.css'
import Layout from '../components/Layout'

export default function App({ Component, pageProps, err }) {
  const router = useRouter()
  const { locale } = router

  const messages = useMemo(() => {
    try {
      const messages = require(`../public/static/lang/${locale}.json`)
      return messages
    } catch (e) {
      console.error(`Failed to load messages for ${locale}: ${e.message}`)
      const defaultMessages = require(`../public/static/lang/${process.env.DEFAULT_LOCALE}.json`)
      return defaultMessages
    }
  }, [locale])

  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`)
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  // Workaround for https://github.com/vercel/next.js/issues/8592
  return (
    <Layout messages={messages}>
      <Component {...pageProps} err={err} />
    </Layout>
  )
}
