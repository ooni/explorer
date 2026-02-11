import Axios from 'axios'
import { convertDatesData, sortData } from '../hooks/useFindings'

export const apiEndpoints = {
  ACCOUNT_METADATA: '/api/_/account_metadata',
  TOKEN_REFRESH: '/api/v1/user_refresh_token',
  USER_REGISTER: '/api/v1/user_register',
  USER_LOGIN: '/api/v1/user_login',
  USER_LOGOUT: '/api/v1/user_logout',
  FEEDBACK_SUBMIT: '/api/_/measurement_feedback',
  CREATE_INCIDENT: '/api/v1/incidents/create',
  UPDATE_INCIDENT: '/api/v1/incidents/update',
  DELETE_INCIDENT: '/api/v1/incidents/delete',
  PUBLISH_INCIDENT: '/api/v1/incidents/publish',
  UNPUBLISH_INCIDENT: '/api/v1/incidents/unpublish',
  SHOW_INCIDENT: '/api/v1/incidents/show/:id',
  SEARCH_INCIDENTS: '/api/v1/incidents/search',
}

const getBearerToken = () => {
  return typeof localStorage !== 'undefined'
    ? JSON.parse(localStorage.getItem('bearer'))?.token
    : ''
}

export const getUserEmail = () => {
  return typeof localStorage !== 'undefined'
    ? JSON.parse(localStorage.getItem('bearer'))?.email_address
    : ''
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_USER_FEEDBACK_API,
})

export const getAPI = async (endpoint, params = {}, config = {}) => {
  const bearerToken = getBearerToken()
  return await axios
    .request({
      method: config.method ?? 'GET',
      url: endpoint,
      params: params,
      ...config,
      ...(bearerToken && {
        headers: { Authorization: `Bearer ${bearerToken}` },
      }),
    })
    .then((res) => res.data)
    .catch((e) => {
      const error = new Error(e?.response?.data?.error ?? e.message)
      error.info = e?.response?.statusText
      error.status = e?.response?.status
      throw error
    })
}

const postAPI = async (endpoint, params, config) => {
  return await getAPI(endpoint, null, { method: 'POST', data: params })
}

export const registerUser = async (
  email_address,
  redirectUrl = 'https://explorer.ooni.org',
) => {
  // current testing setup does not enable us to check process.env.NODE_ENV (it's set to production
  // in headless mode), therefore custom NEXT_PUBLIC_IS_TEST_ENV is used
  const redirectTo =
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_IS_TEST_ENV
      ? 'https://explorer.test.ooni.org'
      : redirectUrl

  const data = await postAPI(apiEndpoints.USER_REGISTER, {
    email_address,
    redirect_to: redirectTo,
  })
  return data
}

export const submitFeedback = (feedback) => {
  return postAPI(apiEndpoints.FEEDBACK_SUBMIT, feedback)
}

export const loginUser = (token) => {
  return axios
    .get(apiEndpoints.USER_LOGIN, { params: { k: token } })
    .then(({ data }) => {
      localStorage.setItem(
        'bearer',
        JSON.stringify({
          token: data?.bearer,
          email_address: data?.email_address,
          created_at: Date.now(),
        }),
      )
      return data
    })
}

export const createIncidentReport = (report) => {
  return postAPI(apiEndpoints.CREATE_INCIDENT, report)
}

export const updateIncidentReport = (report) => {
  return postAPI(apiEndpoints.UPDATE_INCIDENT, report)
}

export const deleteIncidentReport = (report) => {
  return postAPI(apiEndpoints.DELETE_INCIDENT, report)
}

export const publishIncidentReport = (report) => {
  return postAPI(apiEndpoints.PUBLISH_INCIDENT, report)
}

export const unpublishIncidentReport = (report) => {
  return postAPI(apiEndpoints.UNPUBLISH_INCIDENT, report)
}

export const refreshToken = () => {
  const email_address = getUserEmail()
  return getAPI(apiEndpoints.TOKEN_REFRESH).then((data) => {
    localStorage.setItem(
      'bearer',
      JSON.stringify({
        token: data.bearer,
        email_address,
        created_at: Date.now(),
      }),
    )
  })
}

export const fetcher = async (url) => {
  try {
    const res = await getAPI(url)
    return res
  } catch (e) {
    const error = new Error(e?.response?.data?.error ?? e.message)
    error.info = e?.response?.statusText
    error.status = e?.response?.status
    throw error
  }
}

export const customErrorRetry = (error, key, config, revalidate, opts) => {
  // This overrides the default exponential backoff algorithm
  // Instead it uses the `errorRetryInterval` and `errorRetryCount` configuration to
  // limit the retries
  const maxRetryCount = config.errorRetryCount
  if (maxRetryCount !== undefined && opts.retryCount > maxRetryCount) return
  // Never retry on 4xx errors
  if (Math.floor(error.status / 100) === 4) return

  setTimeout(revalidate, config.errorRetryInterval, opts)
}

const getFilteredReports = (theme, data) => {
  const themeArr = Array.isArray(theme) ? theme : [theme]
  const reports = data.filter((article) =>
    article.tags?.some((tag) => themeArr.includes(tag)),
  )
  return reports
}

export const getFindings = async (params) => {
  const client = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_USER_FEEDBACK_API,
  })

  return client
    .get(apiEndpoints.SEARCH_INCIDENTS, {
      params,
    })
    .then((res) => {
      return res.data?.incidents?.length ? res.data?.incidents : []
    })
}

export const getCountryOverviewData = async (countryCode) => {
  try {
    return await fetch(
      `${process.env.NEXT_PUBLIC_OONI_API}/api/_/country_overview?probe_cc=${countryCode}`,
      {
        next: { revalidate: 60 * 60 * 12 }, // Cache for 12 hours
        signal: AbortSignal.timeout(10000), // 10 second timeout
      },
    ).then((res) => {
      return res.json()
    })
  } catch (error) {
    return {
      error: JSON.stringify(error?.message),
    }
  }
}

export const getReports = async (filter) => {
  try {
    // Next.js built-in caching with revalidate option
    const response = await fetch('https://ooni.org/pageindex.json', {
      next: { revalidate: 60 * 60 * 12 }, // Cache for 12 hours
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    const data = await response.json()
    return getFilteredReports(filter, data)
  } catch (error) {
    return {
      error: JSON.stringify(error?.message),
    }
  }
}

export const getCountries = async () => {
  const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API }) // eslint-disable-line
  const countriesR = await client.get('/api/_/countries')
  return countriesR.data.countries
}

export const getThematicData = async (theme) => {
  try {
    const themeArr = Array.isArray(theme) ? theme : [theme]
    const firstItem = Array.isArray(theme) ? theme[0] : theme

    const findings = await getFindings({ theme: firstItem })
      .then((data) =>
        JSON.parse(
          JSON.stringify(sortData(convertDatesData(data)).slice(0, 5)),
        ),
      )
      .catch((e) => {
        return []
      })
    const reports = await getReports(themeArr.map((t) => `theme-${t}`))
      .then((data) => data.slice(0, 11))
      .catch((e) => {
        return []
      })
    const countries = await getCountries()
    const selectedCountries = ['CN', 'IR', 'RU']

    return {
      findings,
      reports,
      countries,
      selectedCountries,
    }
  } catch (e) {
    console.log('----e', e)
    return e
  }
}
