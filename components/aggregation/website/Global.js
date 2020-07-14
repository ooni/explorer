import React, { useState, useCallback } from 'react'
import { Flex, Box } from 'ooni-components'
import { MdClose } from 'react-icons/lib/md'

import CountrySummary from './CountrySummary'
import WebsiteInCountry from './WebsiteInCountry'

const Global = ({ data }) => {

  const [countryActive, activateCountry] = useState(null)

  const onOpenDetail = (probe_cc) => {
    activateCountry(probe_cc)
  }

  return (
    <Flex flexWrap='wrap'>
      {data && data.map((item, key) => (
        countryActive === item.probe_cc ? (
          <Box key={key} p={2} width={1}>
            <WebsiteInCountry probe_cc={item.probe_cc} />
          </Box>
        ) : (
          <Box key={key} p={2} width={[1, 1/2, 1/3, 1/4]}>
            <CountrySummary data={item} onOpenDetail={onOpenDetail} />
          </Box>
        )
      ))}
    </Flex>
  )
}

export default Global
