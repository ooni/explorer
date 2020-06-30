import React from 'react'
import { Flex, Box } from 'ooni-components'

import CountrySummary from './CountrySummary'

const Global = ({ data }) => {
  return (
    <Flex flexWrap='wrap'>
      {data.map((item, key) => (
        <Box key={key} p={2} width={[1, 1/2, 1/3, 1/4]}>
          <CountrySummary data={item} />
        </Box>
      ))
      }
    </Flex>
  )
}

export default Global
