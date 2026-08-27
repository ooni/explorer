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

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_PROXY_API) {
    if (typeof window !== 'undefined') {
      return '/proxy/ooni'
    }
  }

  return process.env.NEXT_PUBLIC_OONI_API
}

const appendParams = (searchParams, params = {}) => {
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value))
    }
  })
}

export const buildUrl = (path, params = {}, baseUrl = '') => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const url = new URL(path)
    appendParams(url.searchParams, params)
    return url.toString()
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const [pathname, existingQuery] = normalizedPath.split('?')
  const searchParams = new URLSearchParams(existingQuery || '')
  appendParams(searchParams, params)

  const base = baseUrl.replace(/\/$/, '')
  const fullPath = `${base}${pathname}`
  const qs = searchParams.toString()
  return qs ? `${fullPath}?${qs}` : fullPath
}

export const toApiPath = (url) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const { pathname, search } = new URL(url)
    return `${pathname}${search}`
  }

  return url.replace(/^\/proxy\/ooni/, '')
}

export const ooniFetcher = async (url) => {
  const path = toApiPath(url)
  let response
  try {
    response = await apiFetch(path)
  } catch (e) {
    if (e.status) {
      const isServerError = e.status >= 500
      throw new Error(
        isServerError || !e.data
          ? `Request failed with status ${e.status}`
          : `Request failed with status ${e.status}:\n${JSON.stringify(e.data, null, 2)}`,
      )
    }
    throw new Error(`Network error: Unable to reach the server.\n${e.message}`)
  }

  return response
}

export const apiFetch = async (path, options = {}) => {
  const {
    local = false,
    method = 'GET',
    params = {},
    data,
    headers = {},
    timeout,
    next,
  } = options

  const url = local
    ? buildUrl(path, params)
    : buildUrl(path, params, getBaseUrl())

  const fetchOptions = {
    method,
    headers: {
      ...(data !== undefined && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    ...(data !== undefined && { body: JSON.stringify(data) }),
    ...(next && { next }),
    ...(timeout && { signal: AbortSignal.timeout(timeout) }),
  }

  let response
  try {
    response = await fetch(url, fetchOptions)
  } catch (e) {
    const error = new Error(e.message)
    throw error
  }

  const contentType = response.headers.get('content-type')
  const json = contentType?.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null)

  if (!response.ok) {
    const message =
      json?.error ?? json?.message ?? response.statusText ?? 'Request failed'
    const error = new Error(message)
    error.info = response.statusText
    error.status = response.status
    error.data = json
    throw error
  }

  return json
}

export const getAPI = async (endpoint, params = {}, config = {}) => {
  const bearerToken = getBearerToken()
  return apiFetch(endpoint, {
    method: config.method ?? 'GET',
    params,
    data: config.data,
    headers: {
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
      ...config.headers,
    },
    timeout: config.timeout,
    next: config.next,
  })
}

const postAPI = async (endpoint, params) => {
  return getAPI(endpoint, {}, { method: 'POST', data: params })
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
  return apiFetch(apiEndpoints.USER_LOGIN, {
    params: { k: token },
  }).then((data) => {
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

export const fetcher = async (url) => getAPI(url)

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
  const data = await apiFetch(apiEndpoints.SEARCH_INCIDENTS, {
    params,
  })
  return data?.incidents?.length ? data.incidents : []
}

export const getCountryOverviewData = async (countryCode) => {
  try {
    return await apiFetch('/api/_/country_overview', {
      params: { probe_cc: countryCode },
      next: { revalidate: 60 * 60 * 12 }, // Cache for 12 hours
      timeout: 10000, // 10 second timeout
    })
  } catch (error) {
    return {
      error: JSON.stringify(error?.message),
    }
  }
}

export const getReports = async (filter) => {
  try {
    const data = await fetch('https://ooni.org/pageindex.json', {
      next: { revalidate: 60 * 60 * 12 }, // Cache for 12 hours
      signal: AbortSignal.timeout(10000), // 10 second timeout
    }).then((res) => res.json())

    return getFilteredReports(filter, data)
  } catch (error) {
    return {
      error: JSON.stringify(error?.message),
    }
  }
}

export const getCountries = async () => {
  const data = await apiFetch('/api/_/countries')
  return data.countries
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
