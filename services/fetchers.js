import axios from 'axios'
import { axiosResponseTime } from 'components/axios-plugins'

const baseURL = process.env.NEXT_PUBLIC_OONI_API
axiosResponseTime(axios)

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

export const MATMultipleFetcher = ({query, testNames, groupKey}) => {
  const reqUrl = `${baseURL}/api/v1/aggregation?${query}`
  const result = []

  const request = (reqUrl) => { 
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

  const requests = testNames.map((tool) => request(`${reqUrl}&test_name=${tool}`))

  return Promise.allSettled(requests).then((responses) => {
    return responses.reduce((prev, current, index) => [...prev, ...current.value.data.map((obj) => ({...obj, [groupKey]: testNames[index]}))], [])
  })
}