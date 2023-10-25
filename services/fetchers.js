import axios from 'axios'
// import { axiosResponseTime } from 'components/axios-plugins'

const baseURL = process.env.NEXT_PUBLIC_OONI_API
export const client = axios.create({baseURL})

export const MATFetcher = (query) => {
  const reqUrl = `${baseURL}/api/v1/aggregation?${query}`
  return axios.get(reqUrl).then(r => {
    if (!r?.data?.result) {
      const error = new Error(`Request ${reqUrl} did not contain expected result`)
      error.data = r
      throw error
    }
    return {
      data: r.data.result,
      loadTime: r.loadTime,
      url: r.config.url
    }
  }).catch(e => {
    console.log(e)
    e.message = e?.request?.response ?? e.message
    throw e
  })
}

export const simpleFetcher = (url, params) => (client.get(url, { params }).then(res => res.data.results))

export const fetcherWithPreprocessing = ([url, {params, resultKey = 'results', preprocessFn}]) => {
  return client.get(url, { params }).then(res => {
    if (preprocessFn) return preprocessFn(res.data[resultKey])
    return res.data[resultKey]
  })
}
