import React from 'react'
import { Flex, Box } from 'ooni-components'

import CountrySummary from './CountrySummary'
import { GlobalLoader } from './GlobalLoader'


const Global = ({data, error, loading}) => {
  return (
    <Flex flexWrap='wrap' bg='gray1'>
      {error && <Box p={4} bg='red1' width={1}>
        <pre>
          {`${error?.response.config.url}\n\n`}
          {`${error?.response.status} - ${error?.response.statusText}`}
        </pre>
      </Box>}
      {loading && !error && <GlobalLoader />}
      {data && !loading && data.map((item, key) => (
        <Box key={key} p={2} width={[1, 1/2]}>
          <CountrySummary data={item} />
        </Box>
      ))}
    </Flex>
  )
}

export default Global
