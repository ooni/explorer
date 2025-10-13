import axios from 'axios'

// const baseURL = process.env.NEXT_PUBLIC_OONI_API
const baseURL = process.env.NEXT_PUBLIC_USER_FEEDBACK_API
export const client = axios.create({ baseURL })

export const MATFetcher = (query) => {
  const reqUrl = `${baseURL}/api/v1/aggregation?${query}`
  return axios
    .get(reqUrl)
    .then((r) => {
      if (!r?.data?.result) {
        const error = new Error(
          `Request ${reqUrl} did not contain expected result`,
        )
        error.data = r
        throw error
      }
      return {
        data: r.data.result,
        loadTime: r.loadTime,
        url: r.config.url,
      }
    })
    .catch((e) => {
      console.log(e)
      e.message = e?.request?.response ?? e.message
      throw e
    })
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

  return client.get(url, { params }).then((res) => {
    return res.data?.results || res.data?.incidents
  })
}

export const fetcherWithPreprocessing = ([
  url,
  { params, resultKey = 'results', preprocessFn },
]) => {
  return client.get(url, { params }).then((res) => {
    if (preprocessFn) return preprocessFn(res.data[resultKey])
    return res.data[resultKey]
  })
}
