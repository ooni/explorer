import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import useSWR from 'swr'

import { fetcher, apiEndpoints, loginUser, refreshToken, customErrorRetry } from '/lib/api'

const TWELVE_HOURS = 1000 * 60 * 60 * 12
const TEN_MINUTES = 1000 * 60 * 10

export default function useUser() {
  const [submitted, setSubmitted] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [reqError, setReqError] = useState(null)
  const [tokenRefreshErrored, setTokenRefreshErrored] = useState(false)

  const { data, error, mutate } = useSWR(apiEndpoints.ACCOUNT_METADATA, fetcher, {
    dedupingInterval: 1000,
    onErrorRetry: customErrorRetry
  })
  const router = useRouter()
  const { token } = router.query

  const afterLogin = useCallback((redirectTo) => {
    mutate(apiEndpoints.ACCOUNT_METADATA, true)
    if (redirectTo) {
      const { pathname, searchParams } = new URL(redirectTo)
      setTimeout(() => {
        router.push({ pathname, query: Object.fromEntries([...searchParams]) })
      }, 3000)
    }
  }, [router, mutate])

  // If there is a `token` URL param, call the login API
  // This fetches and sets the authentication cookie
  useEffect(() => {
    if (token && router.pathname === '/login') {
      loginUser(token)
        .then((data) => {
          setLoggedIn(true)
          if (data?.redirect_to) afterLogin(data.redirect_to)
        }).catch((e)=> {
          console.log(e)
          setReqError(e.message)
        })
    } else {
      // Reset any error messages from using invalid tokens
      setReqError(null)
    }
  }, [afterLogin, token, router.pathname])

  useEffect(() => {
    const interval = setInterval(() => {
      const tokenCreatedAt = JSON.parse(localStorage.getItem('bearer'))?.created_at
      if (tokenCreatedAt) {
        const tokenExpiry = tokenCreatedAt + TWELVE_HOURS
        const now = Date.now()
        if (now > tokenExpiry) {
          refreshToken().catch((e) => {
            if (e?.response?.status === 401) {
              localStorage.removeItem('bearer')
              setTokenRefreshErrored(true)
            }
          })
        }
      }
    }, TEN_MINUTES)

    return () => clearInterval(interval)
  }, [])

  const loading = !data && !error
  // If API returned `401 Unauthorized`, assume the user is not logged in
  const loggedOut = (!data || (error && error.status === 401)) || tokenRefreshErrored

  return {
    loading,
    loggedOut,
    user: {
      loggedIn: !loggedOut
    },
    mutate,
    submitted,
    setSubmitted,
    loggedIn,
    reqError
  }
}
