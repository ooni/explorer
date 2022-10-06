import React from 'react'
import Link from 'next/link'
import { Container, Flex, Text } from 'ooni-components'

import Layout from '../../components/Layout'
import NavBar from '../../components/NavBar'

const Experimental = () => {
  return (
    <Layout>
      <NavBar />
      <Container>
        <Flex flexDiection='column' alignContent='space-around' style={{ height: '400px'}}>
          <Text fontSize={4}><Link href='/experimental/mat'>Measurement Aggregation Toolkit</Link></Text>
        </Flex>
      </Container>
    </Layout>
  )
}

export default Experimental
