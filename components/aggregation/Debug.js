/* global process */
import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Heading, Box, Text } from 'ooni-components'

import { queryToParams, paramsToQuery } from './website/queryUtils'
import { DetailsBox } from '../measurement/DetailsBox'
import { useDebugContext } from './DebugContext'

const Bold = ({ children }) => (
  <Text as='span' fontWeight='bold' color='gray8'>
    {React.Children.toArray(children)}
  </Text>
)

Bold.propTypes = {
  children: PropTypes.any,
}

export const Debug = ({ query, children }) => {
  const { query: queryCtx, apiResponse, others, preReshapeTimeRef, reshapeTimeRef, renderTimeRef} = useDebugContext()

  let params = {}

  if (query || queryCtx) {
    params = queryToParams(query !== undefined ? query : queryCtx)
  }

  const { input, since, until, probe_cc, axis_x, axis_y } = params

  const reshapeTime = (reshapeTimeRef.current > -1) ? Number(reshapeTimeRef.current - preReshapeTimeRef.current).toFixed(3) : undefined
  const renderTime = (renderTimeRef.current > -1) ? Number(renderTimeRef.current - reshapeTimeRef.current).toFixed(3) : undefined

  return (
    <Flex color='gray6' my={3}>
      <DetailsBox title='Debugging Information' content={
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
            API Query: <Bold>{process.env.NEXT_PUBLIC_MEASUREMENTS_URL}/api/aggregation?{paramsToQuery(params)}</Bold>
          </Box>
          <Box>
            <details>
              <summary> API Response ({apiResponse?.data?.result?.length} items)</summary>
              <pre> { JSON.stringify(apiResponse?.data, null, 2)} </pre>
            </details>
          </Box>
          <Box>
            <div>Response Time: {apiResponse?.loadTime ?? '...'}ms</div>
            <div>Reshape Time: {reshapeTime ?? '...'}ms</div>
            <div>Render Time: {renderTime ?? '...'}ms</div>
          </Box>
          {others && <Box my={3} as='pre'>
            {JSON.stringify(others, null, 2)}
          </Box>}
          <Box>
            {children}
          </Box>
        </>
      } />
    </Flex>
  )
}

Debug.propTypes = {
  children: PropTypes.any,
  query: PropTypes.object,
}
