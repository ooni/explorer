import React from 'react'
import { Flex, Box } from 'ooni-components'

import CountrySummary from './CountrySummary'

const Global = ({ data }) => {
  return (
    <Flex flexWrap='wrap'>
      {data && data.map((item, key) => (
        <Box key={key} p={2} width={[1, 1/2]}>
          <CountrySummary data={item} />
        </Box>
      ))}
    </Flex>
  )
}

export default Global
