import { Fira_Sans } from 'next/font/google'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import 'scripts/wdyr'
import 'utils/intlDisplayNamesInitClient'

import 'ooni-components/dist/tailwind.css'
import Layout from 'components/Layout'
import { LocaleProvider } from 'components/withIntl'

export const firaSans = Fira_Sans({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
})

export default function App({ Component, pageProps, err }) {
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
      <style jsx global>{`
        html {
          font-family: ${firaSans.style.fontFamily};
        }
        #nprogress { pointer-events: none; }
        #nprogress .bar {
          background: #e67700;
          position: fixed;
          z-index: 1031;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
        }
        #nprogress .peg {
          display: block;
          position: absolute;
          right: 0px;
          width: 100px;
          height: 100%;
          box-shadow: 0 0 10px #e67700, 0 0 5px #e67700;
          opacity: 1.0;
          transform: rotate(3deg) translate(0px, -4px);
        }
        #nprogress .spinner {
          display: block;
          position: fixed;
          z-index: 1031;
          top: 15px;
          right: 15px;
        }
        #nprogress .spinner-icon {
          width: 18px;
          height: 18px;
          box-sizing: border-box;
          border: solid 2px transparent;
          border-top-color: #e67700;
          border-left-color: #e67700;
          border-radius: 50%;
          animation: nprogress-spinner 400ms linear infinite;
        }
        .nprogress-custom-parent { overflow: hidden; position: relative; }
        .nprogress-custom-parent #nprogress .spinner,
        .nprogress-custom-parent #nprogress .bar { position: absolute; }
        @keyframes nprogress-spinner {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <LocaleProvider>
        <Layout isEmbeddedView={!!pageProps?.isEmbeddedView}>
          <Component {...pageProps} err={err} />
        </Layout>
      </LocaleProvider>
    </>
  )
}
