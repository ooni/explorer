import { useRouter } from 'next/router'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { apiEndpoints, getAPI, loginUser, refreshToken } from '/lib/api'

const TWELVE_HOURS = 1000 * 60 * 60 * 12
const TEN_MINUTES = 1000 * 60 * 10

const UserContext = createContext({})

export const UserProvider = ({ children }) => {
  const router = useRouter()
  const { token } = router.query
  const [user, setUser] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)

  const getUser = () => {
    return getAPI(apiEndpoints.ACCOUNT_METADATA)
      .then((user) => setUser(user))
      .catch(() => setUser(undefined))
      .finally(() => setLoading(false))
  }

  const afterLogin = useCallback(
    (redirectTo) => {
      const { pathname, searchParams } = new URL(redirectTo)
      setTimeout(() => {
        router.push({ pathname, query: Object.fromEntries([...searchParams]) })
      }, 3000)
    },
    [router],
  )

  useEffect(() => {
    if (token && router.pathname === '/login') {
      loginUser(token)
        .then((data) => {
          getUser()
          if (data?.redirect_to) afterLogin(data.redirect_to)
        })
        .catch((e) => {
          console.log(e)
          setError(e.message)
        })
    } else {
      setError(null)
    }
  }, [afterLogin, token, router.pathname])

  // periodically check if the token need to be refreshed and request a
  // new one if needed
  useEffect(() => {
    const interval = setInterval(() => {
      const tokenCreatedAt = localStorage
        ? JSON.parse(localStorage.getItem('bearer'))?.created_at
        : null // if localStorage is disabled in the browser it returns null
      if (tokenCreatedAt) {
        const tokenExpiry = tokenCreatedAt + TWELVE_HOURS
        const now = Date.now()
        if (now > tokenExpiry) {
          refreshToken().catch((e) => {
            if (e?.response?.status === 401) {
              localStorage.removeItem('bearer')
              getUser()
            }
          })
        }
      }
    }, TEN_MINUTES)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    getUser()
  }, [])

  function login(email, password) {
    setLoading(true)
    loginUser(token)
      .then((data) => {
        setUser(data)
        if (data?.redirect_to) afterLogin(data.redirect_to)
      })
      .catch((e) => {
        console.log(e)
        setError(error)
      })
      .finally(() => setLoading(false))
  }

  function logout() {
    localStorage.removeItem('bearer')
    getUser()
  }

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
    }),
    [user, loading, error],
  )

  return (
    <UserContext.Provider value={memoedValue}>{children}</UserContext.Provider>
  )
}

export default useUser
