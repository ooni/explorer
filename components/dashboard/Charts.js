import React from 'react'
import { Flex } from 'ooni-components'
import useSWR from 'swr'
import { useRouter } from  'next/router'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

// TODO export from mat.js
const fetcher = (query) => {
  const qs = new URLSearchParams(query).toString()
  const reqUrl = `${baseURL}/api/v1/aggregation?${qs}`
  return axios.get(reqUrl).then(r => {
    return {
      data: r.data,
      loadTime: r.loadTime,
      url: r.config.url
    }
  })
}

export const Charts = () => {
  const router = useRouter()

  const shouldFetchData = router.pathname !== router.asPath

  const { data, error, isValidating } = useSWR(
    () => shouldFetchData ? [query] : null,
    fetcher,
    swrOptions
  )

  return (
    <Flex>
      Charts
    </Flex>
  )
}