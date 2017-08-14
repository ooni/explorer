import React from 'react'
import Link from 'next/link'
import Head from 'next/head'

import axios from 'axios'
import { Flex, Box, Grid } from 'reflexbox'

import {
  Container,
  Stat,
  Avatar,
  Input
} from 'rebass'

import Layout from '../components/layout'
import { colors } from '../components/layout'
import { toCompactNumberUnit } from '../utils'

import { VictoryPie } from 'victory'

export default class extends React.Component {
  static async getInitialProps ({ req, query }) {
    const cc = query.countryCode
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})
    let [countriesR] = await Promise.all([
        client.get('/api/_/country/'+cc.toUpperCase())
    ])
    return {country: countriesR.data}
  }

  static propTypes = {
    countryCode: React.PropTypes.string.isRequired
  }

  render () {
    const { country } = this.props

    let measurementCount = toCompactNumberUnit(country.measurement_count)
    let asnCount = toCompactNumberUnit(country.asn_count)
    let blkdWebsiteCount = toCompactNumberUnit(country.blocked_website_count)

    return (
      <Layout>
        <Head>
          <title>Internet Censorship in {country.name} - OONI Explorer</title>
        </Head>
        <div className='mini-header'>
          <Flex align='center'>
          <Box><Avatar src={`/_/static/flags/png250px/${country.alpha_2.toLowerCase()}.png`} /></Box>
          <Box><h1 style={{paddingLeft: '20px'}}>{country.name}</h1></Box>
          </Flex>
        </div>

        <Container>
          <Flex pt={2} pb={2}>
            <Box col={6} p={1}>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>
            </Box>
            <Box col={2} p={1}>
            <Flex flexColumn align='left'>
              <Box p={2}>
                <Stat
                  label="Measurements"
                  value={measurementCount.value}
                  unit={measurementCount.unit}
                />
              </Box>
              <Box p={2}>
                <Stat
                  label="Networks"
                  value={asnCount.value}
                  unit={asnCount.unit}
                />
              </Box>
              <Box p={2}>
                <Stat
                  label="Blocked websites"
                  value={blkdWebsiteCount.value}
                  unit={blkdWebsiteCount.unit}
                />
              </Box>
            </Flex>
            </Box>
            <Box col={4} p={1}>
              <VictoryPie
                data={[
                  {month: "Sep", profit: 35000, loss: 2000},
                  {month: "Oct", profit: 42000, loss: 8000},
                  {month: "Nov", profit: 55000, loss: 5000}
                ]}
                x="month"
                y={(datum) => datum.profit - datum.loss}
              />
            </Box>
          </Flex>
          <Flex pt={2} pb={2}>
            <Box col={6} p={1}>
              <h2>Blocked sites</h2>
              <ul>
              <li>http://google.com</li>
              <li>http://google.com</li>
              <li>http://google.com</li>
              <li>http://google.com</li>
              <li>http://google.com</li>
              <li>http://google.com</li>
              </ul>
            </Box>
            <Box col={6} p={1}>
              <h2>Censorship methods</h2>
              <ul>
              <li>http://google.com</li>
              </ul>
            </Box>
          </Flex>
        </Container>
        <style jsx>{`
          .mini-header {
            color: ${ colors.offWhite };
            background-color: ${ colors.ooniBlue };
            padding-top: 30px;
            padding-bottom: 30px;
            padding-left: 30px;
          }
        `}</style>
      </Layout>
    )
  }
}
