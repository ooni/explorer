import React from 'react'
import Link from 'next/link'
import Head from 'next/head'

import axios from 'axios'

import {
  Container,
  Avatar,
  Input,
  Heading,
  Text,
  Flex, Box, Grid
} from 'ooni-components'

import NavBar from '../components/NavBar'
import Flag from '../components/flag'
import Layout from '../components/layout'
import { toCompactNumberUnit } from '../utils'

import { VictoryPie } from 'victory'

import countryUtil from 'country-util'

const Stat = ({label, valueWithUnit}) => {
  return <div>
  <Heading h={5}>{label}</Heading>
  <Text>{valueWithUnit.value} {valueWithUnit.unit}</Text>
  </div>
}

export default class extends React.Component {
  static async getInitialProps ({ req, query }) {
    const { countryCode } = query
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})
    let results = await Promise.all([
      // XXX cc @darkk we should ideally have better dedicated daily dumps for this view
      client.get('/api/_/measurement_count_by_country'),
      client.get('/api/_/blockpages', {params: {'probe_cc': countryCode}})
    ])
    console.log(results)
    let measurementCount = results[0].data.results.filter(d => d.probe_cc === countryCode)
    if (measurementCount.length === 0) {
      measurementCount = 0
    } else {
      measurementCount = measurementCount[0].count
    }
    // XXX this is currently just to show something in the UI
    let asnCount = 42
    const unique = (value, index, self) => self.indexOf(value) === index
    let blockedWebsites = results[1].data.results.map(d => d.input).filter(unique)

    //https://api.ooni.io/api/_/measurement_count_by_country
    //https://api.ooni.io/api/_/blockpages?probe_cc=IT
    return {
      measurementCount,
      asnCount,
      blockedWebsites,
      countryCode,
      countryName: countryUtil.territoryNames[countryCode]
    }
  }

  render () {
    const {
      measurementCount,
      asnCount,
      blockedWebsites,
      countryCode,
      countryName
    } = this.props

    return (
      <Layout>
        <Head>
          <title>Internet Censorship in {countryName} - OONI Explorer</title>
        </Head>

        <NavBar />
        <Container>
          <Flex align='center'>
            <Box>
              <Flag countryCode={countryCode} />
            </Box>
            <Box>
            <Heading pl={2} h={1}>{countryName}</Heading>
            </Box>
          </Flex>
          <Flex pt={2} pb={2}>
            <Box width={2/3}>
            <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            </Box>
            <Box width={1/3}>
              <Box>
              <VictoryPie
                data={[
                  {category: "MMED", count: 40},
                  {category: "NEWS", count: 20},
                  {category: "ALDR", count: 20}
                ]}
                x="category"
                y="count"
              />
              </Box>
              <Flex flexColumn align='left'>
                <Box p={2}>
                  <Stat
                    label="Measurements"
                    valueWithUnit={toCompactNumberUnit(measurementCount)}
                  />
                </Box>
                <Box p={2}>
                  <Stat
                    label="Networks"
                    valueWithUnit={toCompactNumberUnit(asnCount)}
                  />
                </Box>
                <Box p={2}>
                  <Stat
                    label="Blocked websites"
                    valueWithUnit={toCompactNumberUnit(blockedWebsites.length)}
                  />
                </Box>
              </Flex>
            </Box>
          </Flex>
          <Flex pt={2} pb={2}>
            <Box w={1/2}>
              <Heading h={3}>Blocked sites</Heading>
              {blockedWebsites.map(url => (
                <Text>{url}</Text>
              ))}
            </Box>
            <Box w={1/2}>
              <Heading h={3}>Censorship methods</Heading>
            </Box>
          </Flex>
        </Container>
      </Layout>
    )
  }
}
