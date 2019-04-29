/* global process */
import React from 'react'
import Head from 'next/head'
import NLink from 'next/link'
import FormattedMarkdown from '../components/formatted-markdown'
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
  background-color: #ffffff;
`

const StyledLabel = styled.div`
  color: ${props => props.theme.colors.gray7};
`

const StyledStatsItem = styled(Box)`
  text-align: center;
`

const StatsItem = ({label, unit, value }) => (
  <StyledStatsItem color='blue9' width={[1, 1/3]} p={3}>
    <Text fontSize={48} fontWeight={300}>
      {value}
      <Text is='span' fontSize={32}>{unit}</Text>
    </Text>
    <StyledLabel>
      {label}
    </StyledLabel>
  </StyledStatsItem>
)

const FeatureRow = styled(Flex)`

`

FeatureRow.defaultProps = {
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  py: 4
}

const FeatureBox = styled(Box)`
  font-size: 20px;
  line-height: 1.5;
`

FeatureBox.defaultProps = {
  width: [1, 1/2],
  lineHeight: 1.5,
}

const FeatureBoxTitle = styled(Text)`
  color: ${props => props.theme.colors.blue9};
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`

const ImgBox = styled.img`
  width: 100%;
`

export default class LandingPage extends React.Component {

  static async getInitialProps () {
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const result = await client.get('/api/_/global_overview')
    return {
      measurementCount: result.data.measurement_count,
      asnCount: result.data.network_count,
      countryCount: result.data.country_count
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
          <StatsContainer px={32} py={16} mx={[1, '25%']} mt={-120} mb={48} flexWrap='wrap'>
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
          <Flex justifyContent='center'>
            <Box width={[1, 2/3]}>
              <Text fontSize={20} lineHeight={1.5}>
                <FormattedMarkdown id='Home.About.SummaryText' />
              </Text>
            </Box>
          </Flex>

          {/* Websites & Apps */}
          <FeatureRow>
            <FeatureBox>
              <ImgBox src='/static/images/websites-apps.png' alt='Websites and Apps' />
            </FeatureBox>
            <FeatureBox>
              <FeatureBoxTitle>
                <FormattedMessage id='Home.Websites&Apps.Title' />
              </FeatureBoxTitle>
              <FormattedMessage id='Home.Search&Filter.SummaryText' />
            </FeatureBox>
          </FeatureRow>
          {/* Search & Filter */}
          {/* Arrange in {[img, para], [img, para], [img, para]} pattern on smaller screens */}
          <FeatureRow flexDirection={['column-reverse', 'row']}>
            <FeatureBox>
              <FeatureBoxTitle>
                <FormattedMessage id='Home.Search&Filter.Title' />
              </FeatureBoxTitle>
              <FormattedMessage id='Home.Search&Filter.SummaryText' />
            </FeatureBox>
            <FeatureBox>
              <ImgBox src='/static/images/search.png' alt='Websites and Apps' />
            </FeatureBox>
          </FeatureRow>
          {/* Network Properties */}
          <FeatureRow>
            <FeatureBox>
              <ImgBox src='/static/images/network-performance.png' alt='Search and Filter' />
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
