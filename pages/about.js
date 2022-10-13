import React from 'react'
import Head from 'next/head'

import {
  Text,
  Heading,
  Container
} from 'ooni-components'

import Layout from '../components/Layout'
import NavBar from '../components/NavBar'

const About = () => {
  return (
    <Layout>
      <Head>
        <title>About OONI Explorer</title>
      </Head>

      <NavBar />

      <Container>
        <Heading h={2}>XXX Implement Me</Heading>
        <Text>Do we even need an about page?</Text>
      </Container>
    </Layout>
  )
}
export default About
