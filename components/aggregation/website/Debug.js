/* global process */
import React, { useState } from 'react'
import { Flex, Heading, Box, Text } from 'ooni-components'

import { queryToParams, paramsToQuery } from '../../../components/aggregation/website/queryUtils'
import { DetailsBox } from '../../measurement/DetailsBox'

const Bold = ({ children }) => (
  <Text as='span' fontWeight='bold' color='gray8'>
    {React.Children.toArray(children)}
  </Text>
)

export const Debug = ({ params, children }) => {
  if (typeof params === 'string') {
    params = queryToParams(params)
  }
  const { input, since, until, probe_cc } = params
  return (
    <Flex color='gray6' my={3}>
      <DetailsBox collapsed title='Debugging Information' content={
        <>
          <Heading h={4}>
            Statistics for <Bold>{input}</Bold> { probe_cc && `in ${probe_cc} `}from <Bold>{since}</Bold> until <Bold>{until}</Bold>
          </Heading>
          <Box my={2}>
            Query: <Bold>{process.env.MEASUREMENTS_URL}/api/aggregation?{paramsToQuery(params)}</Bold>
          </Box>
          <Box>
            {React.Children.only(children)}
          </Box>
        </>
      } />
    </Flex>
  )
}
