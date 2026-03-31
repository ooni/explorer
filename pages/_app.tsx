import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import { firaSans } from 'lib/firaSans'

import 'styles/globals.css'
import 'styles/nprogress.css'
import 'utils/intlDisplayNamesInitClient'
import Layout from 'components/Layout'
import { LocaleProvider } from 'components/withIntl'

type ExplorerAppProps = AppProps & {
  err?: Error
}

export default function App({ Component, pageProps, err }: ExplorerAppProps) {
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => {
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

  return (
    <>
      <LocaleProvider>
        <main className={firaSans.className}>
          <Layout isEmbeddedView={!!pageProps?.isEmbeddedView}>
            <Component {...pageProps} err={err} />
          </Layout>
        </main>
      </LocaleProvider>
    </>
  )
}
