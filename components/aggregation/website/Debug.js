import React from 'react'
import { Flex, Heading, Box, Text } from 'ooni-components'

const Bold = ({ children }) => (
  <Text as='span' fontWeight='bold' color='gray8'>
    {React.Children.toArray(children)}
  </Text>
)

export const Debug = ({ params, query }) => {
  const { input, since, until } = params
  return (
    <Flex flexDirection='column' color='gray6'>
      <Heading h={4}>
        Statistics for <Bold>{input}</Bold> from <Bold>{since}</Bold> until <Bold>{until}</Bold>
      </Heading>
      <Box my={2}>
        Query: <Bold>{process.env.MEASUREMENTS_URL}/api/aggration?{query}</Bold>
      </Box>
    </Flex>
  )
}
