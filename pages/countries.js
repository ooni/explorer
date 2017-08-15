import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import axios from 'axios'

import {
  Flex, Grid, Box
} from 'grid-styled'

import {
  Container,
  Stat,
  Avatar,
  Input
} from 'rebass'


import Layout from '../components/layout'

import { colors } from '../components/layout'

import { sortByKey, truncateString } from '../utils'

export default class extends React.Component {
  static async getInitialProps ({ req, query }) {
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})
    let [countriesR] = await Promise.all([
        client.get('/api/_/countries?by_region=1')
    ])
    let countries = countriesR.data.countries
    return {countries}
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      shownCountries: props.countries
    }
  }

  componentDidMount () {
    this.setState({
      loading: false,
    })
  }

  render () {
    const { countries } = this.props
    console.log(countries)
    return (
      <Layout>
        <Head>
          <title>Countries - OONI Explorer</title>
        </Head>
        <div className='mini-header'>
          <Container>
          <h1>Internet Censorship around the world</h1>
          </Container>
        </div>
        <div className='countries-view'>
        <Container>
        {countries.map((countriesInRegion) => {
          return (
            <div className='region'>
            <h2>{countriesInRegion[0].region}</h2>
            <hr />
            <Flex wrap>
            {
              countriesInRegion.map((country) => {
                return (
                  <Box w={[1/2, 1/3, 1/4, 1/6]} px={2} py={1}>
                    <Flex align='center'>
                      <Box mr={2}>
                        <Avatar size={30} src={`/_/static/flags/png250px/${country.alpha_2.toLowerCase()}.png`} />
                      </Box>
                      <Box>
                      <Link href={`/country?countryCode=${country.alpha_2.toUpperCase()}`} as={`/country/${country.alpha_2.toUpperCase()}`}>
                        <a alt={country.name}>{truncateString(country.name, 20)}</a>
                      </Link>
                      </Box>
                    </Flex>
                  </Box>
                )
              })
            }
            </Flex>
            </div>
          )
        })}
        </Container>
        </div>
        <style jsx>{`
          .mini-header {
            padding-top: 30px;
            padding-bottom: 30px;
            font-size: 24px;
          }
          .region {
            padding-bottom: 64px;
          }
          .region h2 {
            padding-bottom: 12px;
          }
          .region hr {
            margin-bottom: 12px;
          }

          a {
            font-size: 12px;
            color: #000;
            text-decoration: none;
            color: rgba(0, 0, 0, 0.6);
          }
          a:hover {
            text-decoration: underline;
            color: #0588CB;
          }
        `}</style>
      </Layout>
    )
  }

}
