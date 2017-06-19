import React from 'react'
import Head from 'next/head'

import { Flex } from 'reflexbox'

import { Container, Stat } from 'rebass'

import Layout from '../components/layout'

export default class extends React.Component {
  render () {
    return (
      <Layout>
        <Head>
          <title>OONI Explorer</title>
        </Head>
        <div className="hero">
          <div className="foo">
          </div>
        </div>
        <Container>
          <h3>Hello world</h3>
          <Flex
            align="center"
            justify="space-between"
            wrap
          >
            <Stat
              label="Measurements"
              unit="M"
              value="172"
            />

            <Stat
              label="Countries"
              value="192"
            />

            <Stat
              label="Networks"
              value="5029"
            />

            <Stat
              label="Confirmed cases of censorship"
              value="2120"
            />

          </Flex>
        </Container>
      </Layout>
    )
  }
}
