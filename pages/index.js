/* global process */
import React from 'react'
import Head from 'next/head'
import NLink from 'next/link'

import styled from 'styled-components'
import axios from 'axios'

import {
  Flex,
  Box,
  Container,
  Text,
  Button,
  Heading,
  Link
} from 'ooni-components'

import Layout from '../components/layout'
import Globe from '../components/globe'
import NavBar from '../components/nav-bar'

import { toCompactNumberUnit } from '../utils'

const HeroUnit = styled.div`
  background-color: ${props => props.theme.colors.blue5};
  padding-bottom: 16px;
  padding-top: 16px;
`

const HeroClaim = styled(Heading)`
  color: ${props => props.theme.colors.white};
`

const StatsContainer = styled(Flex)`
  position: absolute;
  top: -55px;
  border-radius: 60px;
  width: 600px;
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
  <StyledStatsItem width={1/3}>
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

export default class LandingPage extends React.Component {

  static async getInitialProps () {
    let stats = await axios.get('/_/s3/homepage-overview.json', {
      baseURL: process.env.EXPLORER_URL
    })
    return {
      measurementCount: stats.data.measurement_count,
      asnCount: stats.data.network_count,
      countryCount: stats.data.country_count
    }
  }

  constructor(props) {
    super(props)
  }

  render () {
    let {
      measurementCount, asnCount,
      countryCount
    } = this.props

    measurementCount = toCompactNumberUnit(measurementCount)
    asnCount = toCompactNumberUnit(asnCount)

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
                <Globe magnitudeURL="/_/s3/map-magnitude.json" />
              </Box>
            </Flex>
          </Container>
        </HeroUnit>
        <Container>
          <Flex align='center' justify='center' style={{position: 'relative'}}>
            <StatsContainer>
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
            </StatsContainer>
          </Flex>

          <Flex style={{paddingTop: '100px'}}>
            <FeatureBox width={1/3} p={2}>
              <Heading h={3}>Countries</Heading>
              <Text>Discover what is happening on the internet in any country in the world.</Text>
              <NLink href='/countries'>
                <Link>
          Read more
                </Link>
              </NLink>
            </FeatureBox>
            <FeatureBox width={1/3} p={2}>
              <Heading h={3}>Search</Heading>
              <Text>Search, filter and explore millions of network measurements collected from thousands of network vantage points all over the world.</Text>
              <NLink href='/search'>
                <Link>
            Read more
                </Link>
              </NLink>
            </FeatureBox>
            <FeatureBox width={1/3} p={2}>
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
