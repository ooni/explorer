import { apiFetch, buildUrl, getBaseUrl } from '../lib/api'

export const MATFetcher = async (query) => {
  const path = `/api/v1/aggregation?${query}`
  const reqUrl = buildUrl(path, {}, getBaseUrl())
  const startTime = performance.now()

  try {
    const data = await apiFetch(path)
    if (!data?.result) {
      const error = new Error(
        `Request ${reqUrl} did not contain expected result`,
      )
      error.data = data
      throw error
    }
    return {
      data: data.result,
      loadTime: performance.now() - startTime,
      url: reqUrl,
    }
  } catch (e) {
    console.log(e)
    e.message = e?.data ?? e.message
    throw e
  }
}

export const simpleFetcher = (args) => {
  let url = ''
  let params = {}
  if (Array.isArray(args)) {
    url = args[0]
    params = args[1]
  } else {
    url = args
  }

  return apiFetch(url, { params }).then(
    (data) => data?.results || data?.incidents,
  )
}

export const fetcherWithPreprocessing = ([
  url,
  { params, resultKey = 'results', preprocessFn },
]) => {
  return apiFetch(url, { params }).then((data) => {
    if (preprocessFn) return preprocessFn(data[resultKey])
    return data[resultKey]
  })
}
