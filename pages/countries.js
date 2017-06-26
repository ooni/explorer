import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import axios from 'axios'

import {
  Flex, Grid, Box
} from 'reflexbox'

import {
  Container,
  Stat,
  Avatar,
  Input
} from 'rebass'


import Layout from '../components/layout'

import { colors } from '../components/layout'

import { sortByKey } from '../utils'

export default class extends React.Component {
  static async getInitialProps ({ req, query }) {
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})
    let [countriesR] = await Promise.all([
        client.get('/api/_/countries?with_counts=true')
    ])
    let countries = countriesR.data.countries
    countries.sort(sortByKey('name'))
    return {countries}
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      shownCountries: props.countries
    }
    this.onFilterCountries = this.onFilterCountries.bind(this)
  }

  componentDidMount () {
    this.setState({
      loading: false,
    })
  }

  onFilterCountries ({target}) {
    let allCountries = this.props.countries.slice()
    let shownCountries = allCountries.filter((c) => {
      return c.name.toLowerCase().startsWith(target.value.toLowerCase())
    })
    this.setState({shownCountries})
  }

  render () {
    const { shownCountries } = this.state

    return (
      <Layout>
        <Head>
          <title>Countries - OONI Explorer</title>
        </Head>
        <div className='mini-header'>
          <h1>Countries</h1>
        </div>
        <div className='countries-view'>
        <Container>
        <Input
          name="filterCountries"
          style={{ backgroundColor: 'white', marginTop: '20px', marginBottom: '20px', width: '300px' }}
          onChange={this.onFilterCountries}
          />

        {shownCountries.map((country) => {
          let value = country.count
          let unit = ''
          if (value > 1000*100) {
            value = Math.round((value / (1000 * 1000) * 10)) / 10
            unit = 'M'
          } else if (value > 100) {
            value = Math.round((value / (1000) * 10)) / 10
            unit = 'k'
          }
          return (
              <Grid>
                <div className='country'>
                  <Flex align='center'>
                    <Box style={{paddingRight: '10px'}}>
                    <Link href={`/country?countryCode=${country.alpha_2.toUpperCase()}`} as={`/country/${country.alpha_2.toUpperCase()}`}>
                      <Avatar src={`/_/static/flags/png250px/${country.alpha_2.toLowerCase()}.png`} />
                    </Link>
                    </Box>
                    <Box>
                    <h2>{country.name}</h2>
                    </Box>
                  </Flex>
                  <Flex style={{paddingTop: '20px'}}>
                    <Box>
                    <Stat
                      label="Measurements"
                      value={value}
                      unit={unit}
                    />
                    </Box>
                  </Flex>
                </div>
              </Grid>
          )})
        }
        </Container>
        </div>
        <style jsx>{`
          .mini-header {
            color: ${ colors.offWhite };
            background-color: ${ colors.ooniBlue };
            padding-top: 30px;
            padding-bottom: 30px;
            padding-left: 30px;
          }
          .country {
            position: relative;
            width: 310px;
            padding-bottom: 30px;
            padding-top: 30px;
            padding-right: 20px;
            padding-left: 20px;
            background-color: white;
            border-radius: 25px;
            margin-bottom: 20px;
            margin-left: 20px;
          }
        `}</style>
      </Layout>
    )
  }

}
