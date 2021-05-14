/* global process */
import React from 'react'
import { Flex, Heading, Box, Text } from 'ooni-components'
import { useRouter } from 'next/router'

import { queryToParams, paramsToQuery } from '../../../components/aggregation/website/queryUtils'
import { DetailsBox } from '../../measurement/DetailsBox'
import { useDebugContext } from '../DebugContext'

const Bold = ({ children }) => (
  <Text as='span' fontWeight='bold' color='gray8'>
    {React.Children.toArray(children)}
  </Text>
)

export const Debug = ({ query, children }) => {
  const { debuggable } = useDebugContext()

  const { query: queryCtx, params } = debuggable

  let _params

  if (typeof params === 'string') {
    _params = queryToParams(params)
  } else if (query || queryCtx) {
    _params = queryToParams(query !== undefined ? query : queryCtx)
  } else {
    _params = params
  }

  const { input, since, until, probe_cc, axis_x, axis_y } = _params
  return (
    <Flex color='gray6' my={3}>
      <DetailsBox collapsed title='Debugging Information' content={
        <>
          <Heading h={4}>
            Statistics {
              input && <span>for <Bold>{input}</Bold></span>
            } {
              probe_cc && <span>in <Bold>{probe_cc}</Bold></span>
            } from <Bold>{since}</Bold> until <Bold>{until}</Bold>
          </Heading>
          <Flex flexDirection='row'>
            <Box>
              {axis_x && (
                <span>X-axis: <Bold>{axis_x}</Bold></span>
              )}
            </Box>
            <Box ml={3}>
              {axis_y && (
                <span>Y-axis: <Bold>{axis_y}</Bold></span>
              )}
            </Box>
          </Flex>
          <Box my={2}>
            API Query: <Bold>{process.env.NEXT_PUBLIC_MEASUREMENTS_URL}/api/aggregation?{paramsToQuery(_params)}</Bold>
          </Box>
          <Box>
            Response Time: {debuggable.apiResponse?.loadTime ?? '...'}ms
            <details>
              <summary> API Response ({debuggable.apiResponse?.data?.result?.length})</summary>
              <pre> { JSON.stringify(debuggable.apiResponse?.data, null, 2)} </pre>
            </details>
          </Box>
          <Box my={3} as='pre'>
            {JSON.stringify(debuggable.others, null, 2)}
          </Box>
          <Box>
            {children}
          </Box>
        </>
      } />
    </Flex>
  )
}
