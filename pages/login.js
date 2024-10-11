import LoginForm from 'components/login/LoginForm'
import SpinLoader from 'components/vendor/SpinLoader'
import useUser from 'hooks/useUser'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

const Login = () => {
  const intl = useIntl()
  const router = useRouter()
  const { token } = router.query

  const [submitted, setSubmitted] = useState(false)

  const redirectTo = typeof window !== 'undefined' && window.location.origin

  const { user, loading, error } = useUser()

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (!loading && user?.logged_in && !token) {
      router.replace('/')
    }
  }, [user, loading, router, token])

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'General.Login' })}</title>
      </Head>
      <div className="container">
        <div className="flex items-center flex-col">
          <h1 className="mt-4 mb-1 text-3xl md:text-4xl">
            <FormattedMessage id="General.Login" />
          </h1>
        </div>
        <div className="flex mt-8 flex-col">
          {/* Before logging In */}
          {!token && !submitted && (
            <>
              <div className="text-base mb-2 text-center">
                <FormattedMessage id="Login.EnterEmail" />
              </div>
              <div className="w-[300px] self-center">
                <LoginForm
                  onLogin={() => setSubmitted(true)}
                  redirectTo={redirectTo}
                />
              </div>
            </>
          )}
          {!token && submitted && (
            <h3 className="w-full md:w-2/3 text-center mx-auto">
              <FormattedMessage id="Login.Submitted" />
            </h3>
          )}

          {/* While logging In */}
          {token && !user && !error && (
            <>
              <SpinLoader />
              <h2 className="my-2 mx-auto">
                <FormattedMessage id="Login.LoggingIn" />
              </h2>
            </>
          )}

          {/* After loggin in */}
          {user && !error && token && (
            <div className="text-3xl my-2 mx-auto">
              <FormattedMessage id="Login.Success" />
            </div>
          )}

          {/* Errors */}
          {error && (
            <div className="w-full md:w-1/3 mx-auto text-center">
              <div className="mb-4 p-8 bg-red-100">{error}</div>
              <Link href="/login">
                <FormattedMessage id="Login.Failure" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Login
