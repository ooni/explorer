/* global process */
import React from 'react'
import Head from 'next/head'
import NLink from 'next/link'

import styled from 'styled-components'
import axios from 'axios'
import { FormattedMessage } from 'react-intl'
import {
  Flex,
  Box,
  Container,
  Button,
  Heading,
  Link
} from 'ooni-components'
import { Text } from 'rebass'

import Layout from '../components/Layout'
import NavBar from '../components/nav-bar'

import { toCompactNumberUnit } from '../utils'

const HeroUnit = styled.div`
  background: linear-gradient(326.31deg, #005A99 39.35%, #0588CB 82.69%), #0588CB;
  padding-bottom: 48px;
  padding-top: 16px;
`

const StatsContainer = styled(Flex)`
  border-radius: 16px;
  margin-top: -100px;
  padding: 16px 32px;
  padding-bottom: 64px;
  background-color: ${props => props.theme.colors.white};
`

const StyledLabel = styled.div`
  color: ${props => props.theme.colors.gray7};
`

const StyledStatsItem = styled(Box)`
  padding: 16px;
`

const StatsItem = ({label, unit, value }) => (
  <StyledStatsItem width={1/3} mx={4} color='blue9'>
    <Text fontSize={48} fontWeight={300}>
      {value}
      <Text is='span' fontSize={32}>{unit}</Text>
    </Text>
    <StyledLabel>
      {label}
    </StyledLabel>
  </StyledStatsItem>
)

StatsItem.defaultProps = {
  width: [1/3],
  m: 4,
}

const FeatureRow = styled(Flex)`

`

FeatureRow.defaultProps = {
  alignItems: 'center',
  justifyContent: 'center',
  py: 4
}

const FeatureBox = styled(Box)`
  font-size: 20px;
  line-height: 1.5;
`

FeatureBox.defaultProps = {
  mx: 3,
  width: [1, 1/3],
  lineHeight: 1.5,
}

const FeatureBoxTitle = styled(Text)`
  color: ${props => props.theme.colors.blue9};
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`

export default class LandingPage extends React.Component {

  static async getInitialProps () {
    // XXX fetch this from the API
    return {
      measurementCount: 0,
      asnCount: 0,
      countryCount: 0
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
      <Layout>
        <Head>
          <title>OONI Explorer</title>
        </Head>
        <HeroUnit>
          <NavBar color='transparent' />
          <Container>
            <Text textAlign='center' my={120}>
              <Heading h={1}>
                <Text fontSize={64} color='#ffffff'><FormattedMessage id='Home.Banner.Title.UncoverEvidence' /></Text>
              </Heading>
              <Text fontSize={24} color='blue1'><FormattedMessage id='Home.Banner.Subtitle.ExploreCensorshipEvents' /></Text>
              <Button mt={48} inverted hollow fontSize={24}><FormattedMessage id='Home.Banner.Button.Explore' /></Button>
            </Text>
          </Container>
        </HeroUnit>
        <Container>
          <Flex alignItems='center' justifyContent='center'>
            <StatsContainer>
              <StatsItem
                label={<FormattedMessage id='Home.Banner.Stats.Measurements' />}
                unit={measurementCount.unit}
                value={measurementCount.value}
              />
              <StatsItem
                label={<FormattedMessage id='Home.Banner.Stats.Countries' />}
                value={countryCount}
              />
              <StatsItem
                label={<FormattedMessage id='Home.Banner.Stats.Networks' />}
                unit={asnCount.unit}
                value={asnCount.value}
              />
            </StatsContainer>
          </Flex>
          <Flex justifyContent='center'>
            <Box width={2/3}>
              <Text fontSize={20} lineHeight={1.5}>
                <FormattedMessage id='Home.About.SummaryText' />
              </Text>
            </Box>
          </Flex>

          {/* Websites & Apps */}
          <FeatureRow>
            <FeatureBox>
              <img src='/static/countries.png' alt='Websites and Apps' />
            </FeatureBox>
            <FeatureBox>
              <FeatureBoxTitle>
                <FormattedMessage id='Home.Websites&Apps.Title' />
              </FeatureBoxTitle>
              <FormattedMessage id='Home.Search&Filter.SummaryText' />
            </FeatureBox>
          </FeatureRow>
          {/* Search & Filter */}
          <FeatureRow>
            <FeatureBox>
              <FeatureBoxTitle>
                <FormattedMessage id='Home.Search&Filter.Title' />
              </FeatureBoxTitle>
              <FormattedMessage id='Home.Search&Filter.SummaryText' />
            </FeatureBox>
            <FeatureBox>
              <img src='/static/countries.png' alt='Websites and Apps' />
            </FeatureBox>
          </FeatureRow>
          {/* Network Properties */}
          <FeatureRow>
            <FeatureBox>
              <img src='/static/countries.png' alt='Search and Filter' />
            </FeatureBox>
            <FeatureBox>
              <FeatureBoxTitle>
                <FormattedMessage id='Home.NetworkProperties.Title' />
              </FeatureBoxTitle>
              <FormattedMessage id='Home.Search&Filter.SummaryText' />
            </FeatureBox>
          </FeatureRow>
        </Container>
      </Layout>
    )
  }
}
