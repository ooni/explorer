import React from 'react'
import Head from 'next/head'

import {
  Text,
  Heading,
  Container
} from 'ooni-components'

import NavBar from '../components/NavBar'

export default class About extends React.Component {
  render () {

    return (
      <React.Fragment>
        <Head>
          <title>About OONI Explorer</title>
        </Head>

        <NavBar />

        <Container>
          <Heading h={2}>XXX Implement Me</Heading>
          <Text>Do we even need an about page?</Text>
        </Container>
      </React.Fragment>
    )
  }

}
