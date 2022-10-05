import React from 'react'
import Link from 'next/link'
import { Container, Flex, Text } from 'ooni-components'

import NavBar from '../../components/NavBar'

const Experimental = () => {
  return (
    <React.Fragment>
      <NavBar />
      <Container>
        <Flex flexDiection='column' alignContent='space-around' style={{ height: '400px'}}>
          <Text fontSize={4}><Link href='/experimental/mat'>Measurement Aggregation Toolkit</Link></Text>
        </Flex>
      </Container>
    </React.Fragment>
  )
}

export default Experimental
