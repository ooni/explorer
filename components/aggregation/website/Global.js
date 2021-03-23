import React, { useMemo } from 'react'
import { Flex, Box } from 'ooni-components'

import CountrySummary from './CountrySummary'
import { GlobalLoader } from './GlobalLoader'

const sortData = (data) => {
  const sorted = data.map((d) => {
    const percent = Number((d.anomaly_count + d.confirmed_count) / d.measurement_count * 100)
    return {...d, percent}
  }).sort((a, b) => a.percent < b.percent).sort((a, b) => a.confirmed_count < b.confirmed_count)
  return sorted
}

const Global = ({data, error, loading}) => {

  const sortedData = useMemo(() => {
    return data ? sortData(data) : data
  }, [data])

  return (
    <Flex flexWrap='wrap' bg='gray1'>
      {error && <Box p={4} bg='red1' width={1}>
        <pre>
          {`${error?.response.config.url}\n\n`}
          {`${error?.response.status} - ${error?.response.statusText}`}
        </pre>
      </Box>}
      {loading && !error && <GlobalLoader />}
      {sortedData && !loading && sortedData.map((item, key) => (
        <Box key={key} p={2} width={[1, 1/2]}>
          <CountrySummary data={item} />
        </Box>
      ))}
    </Flex>
  )
}

export default Global
