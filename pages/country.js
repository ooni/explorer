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

export default class extends React.Component {
  static async getInitialProps ({ req, query }) {
    const cc = query.countryCode
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})
    let [countriesR] = await Promise.all([
        client.get('/api/_/countries?with_counts=true')
    ])
    let countries = countriesR.data.countries
    let country = {}
    countries.forEach((c) => {
      if (c.alpha_2.toUpperCase() == cc.toUpperCase()) {
        country = c
      }
    })
    return {country: country}
  }

  static propTypes = {
    countryCode: React.PropTypes.string.isRequired
  }

  render () {
    const { country } = this.props

    const prettyUnitValue = (value) => {
      let unit = ''
      if (value > 1000*100) {
        value = Math.round((value / (1000 * 1000) * 10)) / 10
        unit = 'M'
      } else if (value > 100) {
        value = Math.round((value / (1000) * 10)) / 10
        unit = 'k'
      }
      return {unit, value}
    }
    let msmtStats = prettyUnitValue(country.count)
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
            <Flex flexColumn align='center'>
              <Box p={2}>
                <Stat
                  label="Measurements"
                  value={msmtStats.value}
                  unit={msmtStats.unit}
                />
              </Box>
              <Box p={2}>
                <Stat
                  label="Networks"
                  value={10}
                  unit=""
                />
              </Box>
              <Box p={2}>
                <Stat
                  label="Other"
                  value={10}
                  unit=""
                />
              </Box>
            </Flex>
            </Box>
            <Box col={4} p={1}>
            <div style={{backgroundColor: 'black', height: '300px', margin: '0 auto', borderRadius: '100px'}}>
              <h2 style={{color: 'white', width: '150px', textAlign: 'center', paddingTop: '50px'}}>Make way, I am a pie chart!</h2>
            </div>
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
