import Axios from 'axios'

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
  SHOW_INCIDENT: '/api/v1/incidents/show/:incident_id',
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

const axios = Axios.create({ baseURL: process.env.NEXT_PUBLIC_USER_FEEDBACK_API })

export const getAPI = async (endpoint, params = {}, config = {}) => {
  const bearerToken = getBearerToken()
  return await axios
    .request({
      method: config.method ?? 'GET',
      url: endpoint,
      params: params,
      ...config,
      ...(bearerToken && { headers: { Authorization: `Bearer ${bearerToken}` } }),
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

export const registerUser = async (email_address, redirectUrl = 'https://explorer.ooni.org') => {
  // current testing setup does not enable us to check process.env.NODE_ENV (it's set to production
  // in headless mode), therefore custom NEXT_PUBLIC_IS_TEST_ENV is used
  const redirectTo =
    process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_IS_TEST_ENV
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
  return axios.get(apiEndpoints.USER_LOGIN, { params: { k: token } }).then(({ data }) => {
    localStorage.setItem('bearer', JSON.stringify({ token: data?.bearer, email_address: data?.email_address, created_at: Date.now() }))
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
    localStorage.setItem('bearer', JSON.stringify({ token: data.bearer, email_address, created_at: Date.now() }))
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
