import React from 'react'
import Head from 'next/head'
import NLink from 'next/link'

import axios from 'axios'

import styled from 'styled-components'

import {
  Flex,
  Box,
  Container,
  Text,
  Button,
  Heading,
  Link
} from 'ooni-components'

import { Avatar } from 'rebass'

import Layout from '../components/layout'
import Globe from '../components/globe'
import NavBar from '../components/nav-bar'

import { colors } from '../components/layout'

import { toCompactNumberUnit } from '../utils'

const Stat = ({label, unit, value}) => (
  <div>
    {value}{unit}
    {label}
  </div>
)

const HeroUnit = styled.div`
  background-color: ${props => props.theme.colors.blue5};
  padding-bottom: 16px;
  padding-top: 16px;
`

const HeroClaim = styled(Heading)`
  color: ${props => props.theme.colors.white};
`

const StatsContainer = styled.div`
  position: relative;
`

const StatsBox = styled(Flex)`
  position: absolute;
  z-index: 999999;
  top: -55px;
  border-radius: 20px;
  width: 800px;
  background-color: ${props => props.theme.colors.white};
  padding-left: 16px;
  box-shadow: -1px 3px 21px 0px rgba(0,0,0,0.75);
`

const StyledValue = styled.div`
  color: ${props => props.theme.colors.blue5};
  font-size: 60px;
`

const StyledUnit = styled.span`
  color: ${props => props.theme.colors.blue5};
  font-size: 26px;
`

const StyledLabel = styled.div`
  color: ${props => props.theme.colors.gray7};
`

const StyledStatsItem = styled(Box)`
  padding: 16px;
`

const StatsItem = ({label, unit, value}) => (
  <StyledStatsItem w={1/4}>
    <StyledValue>
      {value}
      <StyledUnit>{unit}</StyledUnit>
    </StyledValue>
    <StyledLabel>
      {label}
    </StyledLabel>
  </StyledStatsItem>
)

const FeatureBox = styled(Box)`
  text-align: center;
`

export default class extends React.Component {

  static async getInitialProps ({ req, query }) {
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL})
    let [statsR] = await Promise.all([
      client.get('/api/_/measurement_count_by_country')
    ])
    return {
      measurementCount: 100*100,
      asnCount: 10*1000,
      countryCount: 201,
      censorshipCount: 2231
    }
  }

  constructor(props) {
    super(props)
  }

  render () {
    let {
      measurementCount, asnCount,
      countryCount, censorshipCount
    } = this.props

    measurementCount = toCompactNumberUnit(measurementCount)
    asnCount = toCompactNumberUnit(asnCount)
    censorshipCount = toCompactNumberUnit(censorshipCount)

    return (
      <Layout disableFooter>
        <Head>
          <title>OONI Explorer</title>
        </Head>
        <NavBar />
        <HeroUnit>
          <Container>
            <Flex>
              <Box width={2/3}>
                <HeroClaim h={2}>Uncover evidence of network tampering, near and far!</HeroClaim>
                <Button inverted hollow>Explore</Button>
              </Box>
              <Box width={1/3}>
                <Globe />
              </Box>
            </Flex>
          </Container>
        </HeroUnit>
        <Container>
          <StatsContainer>
            <StatsBox>
              <StatsItem
                label="Measurements"
                unit={measurementCount.unit}
                value={measurementCount.value}
              />
              <StatsItem
                label="Countries"
                value={countryCount}
              />
              <StatsItem
                label="Networks"
                unit={asnCount.unit}
                value={asnCount.value}
              />
              <StatsItem
                label="Censorship cases"
                unit={censorshipCount.unit}
                value={censorshipCount.value}
              />
            </StatsBox>
          </StatsContainer>

          <Flex style={{paddingTop: '100px'}}>
            <FeatureBox w={1/3} p={2}>
              <Heading h={3}>Countries</Heading>
              <Text>Discover what is happening on the internet in any country in the world.</Text>
              <NLink href='/countries'>
                <Link>
          Read more
                </Link>
              </NLink>
            </FeatureBox>
            <FeatureBox w={1/3} p={2}>
              <Heading h={3}>Search</Heading>
              <Text>Search, filter and explore millions of network measurements collected from thousands of network vantage points all over the world.</Text>
              <NLink href='/search'>
                <Link>
            Read more
                </Link>
              </NLink>
            </FeatureBox>
            <FeatureBox w={1/3} p={2}>
              <Heading h={3}>Results</Heading>
              <Text>Check to see what results OONI has discovered around the world</Text>
              <NLink href='/results'>
                <Link pt={2}>
            Read more
                </Link>
              </NLink>
            </FeatureBox>
          </Flex>
        </Container>
      </Layout>
    )
  }
}
