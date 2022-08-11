import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import useSWR from 'swr'
import Axios from 'axios'

import { fetcher, apiEndpoints, loginUser } from '/lib/api'

export default function useUser() {
  const [submitted, setSubmitted] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [reqError, setReqError] = useState(null)

  const { data, error, mutate } = useSWR(apiEndpoints.ACCOUNT_METADATA, fetcher)
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
        .then(({ redirect_to }) => {
          setLoggedIn(true)
          afterLogin(redirect_to)
        }).catch((e)=> {
          console.log(e)
          setReqError(e.message)
        })
    } else {
      // Reset any error messages from using invalid tokens
      setReqError(null)
    }
  }, [afterLogin, token, router.pathname])

  const loading = !data && !error
  // If API returned `401 Unauthorized`, assume the user is not logged in
  const loggedOut = error && error.status === 401

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
