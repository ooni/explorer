//FROM:
// https://github.com/zeit/next.js/blob/master/examples/with-sentry
// https://github.com/vercel/next.js/blob/canary/examples/with-loading/pages/_app.js
import { Fira_Sans } from 'next/font/google'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import 'scripts/wdyr'

import dynamic from 'next/dynamic'
import 'ooni-components/dist/tailwind.css'
import 'public/static/nprogress.css'

const Layout = dynamic(() => import('components/Layout'))
const LocaleProvider = dynamic(() =>
  import('components/withIntl').then((c) => c.LocaleProvider),
)

export const firaSans = Fira_Sans({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
})

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
    <>
      <style jsx global>{`
        html {
          font-family: ${firaSans.style.fontFamily};
        }
      `}</style>
      <LocaleProvider>
        <Layout>
          <Component {...pageProps} err={err} />
        </Layout>
      </LocaleProvider>
    </>
  )
}
