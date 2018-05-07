import React from 'react'
import Head from 'next/head'
import NLink from 'next/link'

import styled from 'styled-components'

import {
  Flex, Grid, Box,
  Text,
  Heading,
  Container
} from 'ooni-components'

import Layout from '../components/layout'
import NavBar from '../components/nav-bar'

export default class extends React.Component {
  render () {

    return (
      <Layout>
        <Head>
          <title>Finding - OONI Explorer</title>
        </Head>

        <NavBar />

        <Container>
          <Heading h={2}>XXX Implement Me</Heading>
          <Text>Maybe this should be called findings?</Text>
        </Container>
      </Layout>
    )
  }

}
