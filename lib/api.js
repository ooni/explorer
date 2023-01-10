import Axios from 'axios'

export const apiEndpoints = {
  ACCOUNT_METADATA: '/api/_/account_metadata',
  TOKEN_REFRESH: '/api/v1/user_refresh_token',
  USER_REGISTER: '/api/v1/user_register',
  USER_LOGIN: '/api/v1/user_login',
  USER_LOGOUT: '/api/v1/user_logout',
  FEEDBACK_SUBMIT: '/api/_/measurement_feedback',
}

const getBearerToken = () => {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('bearer') : ''
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_OONI_API,
  withCredentials: true
})

export const getAPI = async (endpoint, params = {}, config = {}) => {
  return await axios.request({
    method: config.method ?? 'GET',
    url: endpoint,
    params: params,
    ...config,
    headers: { Authorization: `Bearer ${getBearerToken()}` }
  })
    .then(res => res.data)
    .catch(e => {
      const error = new Error(e?.response?.data?.error ?? e.message)
      error.info = e?.response?.statusText
      error.status = e?.response?.status
      throw error
    })
}

const postAPI = async (endpoint, params, config) => {
  return await getAPI(endpoint, null, { method: 'POST', data: params })
}

export const registerUser = async (email_address, redirectUrl = 'https://explorer.ooni.org' ) => {
  const redirectTo = process.env.NODE_ENV === 'development' ? 
    'https://explorer.test.ooni.org' :
    redirectUrl

  const data = await postAPI(apiEndpoints.USER_REGISTER, {
    email_address,
    redirect_to: redirectTo,
  })
  return data
}

export const submitFeedback = (feedback) => {
  return postAPI(apiEndpoints.FEEDBACK_SUBMIT, feedback)
}

export const loginUser = async (token) => {
  return await axios.get(apiEndpoints.USER_LOGIN, { params: { k: token } })
    .then(({ data }) => {
      localStorage.setItem('bearer', JSON.stringify({ token: data?.bearer, created_at: Date.now() }))
    })
}

export const refreshToken = async () => {
  return axios
    .get(apiEndpoints.TOKEN_REFRESH, { headers: { Authorization: `Bearer ${getBearerToken()}` } })
    .then(({ data }) => {
      localStorage.setItem('bearer', JSON.stringify({ token: data.bearer, created_at: Date.now() }))
    })
}

export const fetcher = async (url) => {
  try {
    const res = await axios.get(url, { headers: { Authorization: `Bearer ${getBearerToken()}` } })
    return res.data.rules ?? res.data
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