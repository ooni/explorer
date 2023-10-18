//FROM: 
// https://github.com/zeit/next.js/blob/master/examples/with-sentry
// https://github.com/vercel/next.js/blob/canary/examples/with-loading/pages/_app.js
import 'scripts/wdyr'
import 'regenerator-runtime/runtime'
import { useEffect } from 'react'
import 'regenerator-runtime/runtime'
import NProgress from 'nprogress'
import { useRouter } from 'next/router'
import '@fontsource/fira-sans'
import '@fontsource/fira-sans/300.css'

import '../public/static/nprogress.css'
import Layout from '../components/Layout'
import { LocaleProvider } from 'components/withIntl'

export default function App({ Component, pageProps, err }) {
  const router = useRouter()

  useEffect(() => {
    const handleStart = (url) => {
      
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
    <LocaleProvider>
      <Layout>
        <Component {...pageProps} err={err} />
      </Layout>
    </LocaleProvider>
  )
}
