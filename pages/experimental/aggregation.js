import React from 'react'
import { Container, Heading, Flex, Box } from 'ooni-components'

import Layout from '../../components/Layout'
import NavBar from '../../components/NavBar'
import { Heatmap, Calendar } from '../../components/aggregation'

const Aggregation = () => (
  <Layout>
    <NavBar />
    <Container>
      <Flex flexDirection='column'>
        <Box width={1}>
          <Heading h={3} textAlign='center'>Calendar with measurement counts</Heading>
          <Calendar />
        </Box>
        <Box width={1}>
          <Heading h={3} textAlign='center'>Heatmap</Heading>
          <Heatmap />
        </Box>
      </Flex>
    </Container>
  </Layout>
)

export default Aggregation
