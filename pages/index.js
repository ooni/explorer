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
} from 'ooni-components'
import { Text } from 'rebass'

import Layout from '../components/Layout'
import NavBar from '../components/nav-bar'
import { toCompactNumberUnit } from '../utils'
import HighlightSection from '../components/landing/highlights-section'
import highlightContent from '../components/landing/highlights.json'
import { Flag } from '../components/flag'
import { CoverageChart } from '../components/landing/stats'

const HeroUnit = styled.div`
  background: url(/static/images/world-dots.svg);
  background: linear-gradient(
    319.33deg,
    ${props => props.theme.colors.blue9} 39.35%,
    ${props => props.theme.colors.base} 82.69%),
    ${props => props.theme.colors.base};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding-bottom: 48px;
  padding-top: 16px;
`

const ExploreButton = styled(Button)`
  &:hover, &:focus {
    background-color: white;
    color: ${props => props.theme.colors.blue5};
  }

  &:active {
    background-color: white;
    color: ${props => props.theme.colors.blue5};
    box-shadow: 0 0 0 0.2rem ${props => props.theme.colors.blue4};
  }
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
  <StyledStatsItem color='blue9' width={[1/3]} p={3}>
    <Text fontSize={[42, 48]} fontWeight={300}>
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
`
FeatureBoxTitle.defaultProps = {
  textAlign: ['center', 'left'],
  color: 'blue9',
  fontSize: 24,
  fontWeight: 600,
  mb: 2
}

const ImgBox = styled.img`
  width: 100%;
`

const BorderedBox = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray3};
`

const StyledContainer = styled(Container)`
  background-image: url('/static/images/world-dots.svg');
  background-repeat: no-repeat;
  background-position: center;
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
          <StyledContainer py={[0, 120]} my={[0, 90]}>
            <Text textAlign='center'>
              <Heading h={1}>
                <Text fontSize={[32, 64]} color='#ffffff'><FormattedMessage id='Home.Banner.Title.UncoverEvidence' /></Text>
              </Heading>
              <Text fontSize={[18, 24]} color='blue1'><FormattedMessage id='Home.Banner.Subtitle.ExploreCensorshipEvents' /></Text>
              <ExploreButton mt={48} hollow inverted fontSize={24}>
                <FormattedMessage id='Home.Banner.Button.Explore' />
              </ExploreButton>
            </Text>
          </StyledContainer>
        </HeroUnit>
        <Container>
          <StatsContainer px={[0, 32]} py={16} mx={[0, '25%']} mt={[0, -120]} mb={48} flexWrap='wrap'>
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

          {/* Intro text about Explorer */}
          <Flex justifyContent='center' my={4}>
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
            <FeatureBox color='gray7'>
              <FeatureBoxTitle>
                <FormattedMessage id='Home.Websites&Apps.Title' />
              </FeatureBoxTitle>
              <FormattedMessage id='Home.Websites&Apps.SummaryText' />
            </FeatureBox>
          </FeatureRow>
          {/* Search & Filter */}
          {/* Arrange in {[img, para], [img, para], [img, para]} pattern on smaller screens */}
          <FeatureRow flexDirection={['column-reverse', 'row']}>
            <FeatureBox color='gray7'>
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
            <FeatureBox color='gray7'>
              <FeatureBoxTitle>
                <FormattedMessage id='Home.NetworkProperties.Title' />
              </FeatureBoxTitle>
              <FormattedMessage id='Home.Search&Filter.SummaryText' />
            </FeatureBox>
          </FeatureRow>
          {/* Measurement Statistics */}
          <Container mb={5}>
            <CoverageChart />
          </Container>
          {/* Highlights */}
          <Container>
            <Flex flexWrap='wrap' justifyContent='center' my={3}>
              <Heading h={2} color='blue7'><FormattedMessage id={'Home.Highlights.Title'} /></Heading>
            </Flex>
            <Flex flexWrap='wrap' justifyContent='center'>
              <BorderedBox px={3} width={[1, 2/3]}>
                <Text fontSize={20}>
                  <FormattedMarkdown
                    id='Home.Highlights.Description'
                  />
                </Text>
              </BorderedBox>
            </Flex>

            {/* Political Events */}
            <HighlightSection
              title='Censorship during political events'
              highlights={highlightContent.political}
            />
            {/* Media */}
            <HighlightSection
              title='Media censorship'
              highlights={highlightContent.media}
            />
            {/* LGBTQI sites */}
            <HighlightSection
              title='Blocking of LGBTQI sites'
              highlights={highlightContent.lgbtqi}
            />
            {/* Censorship changes */}
            <Flex flexWrap='wrap' alignItems='flex-start' my={5}>
              <Box p={2} width={[1, 2/12]}>
                <Text fontSize={20} fontWeight={500} textAlign={['center', 'left']}>
                  Censorship Changes
                </Text>
              </Box>
              <Box width={[1, 10/12]} p={1}>
                <Text fontSize={18}>
                  <Box>
                    OONI measurements have been collected on a continuous basis since 2012, enabling the identification of censorship changes around the world over the last years. Some examples include:
                  </Box>
                  <Flex my={3}>
                    <Box mr={2}>
                      <Flag countryCode='CU' size={24} />
                    </Box>
                    <Box>
                      Cuba <a href='https://ooni.torproject.org/post/cuba-internet-censorship-2017/'>used to primarily serve blank block pages</a>, only blocking the HTTP version of websites. Now they censor access to sites that support HTTPS by means of <a href='https://ooni.io/post/cuba-referendum/'>IP blocking</a>.
                    </Box>
                  </Flex>
                  <Flex my={3}>
                    <Box mr={2}>
                      <Flag countryCode='VE' size={24} />
                    </Box>
                    <Box>
                      Venezuelan ISPs used to primarily block sites by means of <a href='https://ooni.torproject.org/post/venezuela-internet-censorship/'>DNS tampering</a>. Now state-owned CANTV also implements <a href='https://ooni.torproject.org/post/venezuela-blocking-wikipedia-and-social-media-2019/'>SNI-based filtering</a>.
                    </Box>
                  </Flex>
                  <Flex my={3}>
                    <Box mr={2}>
                      <Flag countryCode='ET' size={24} />
                    </Box>
                    <Box>
                      Ethiopia <a href='https://ooni.io/post/ethiopia-report/'>used to block</a> numerous news websites, LGBTQI, political opposition, and circumvention tool sites. As part of the 2018 political reforms, most of these sites have been <a href='https://ooni.io/post/ethiopia-unblocking/'>unblocked</a>.
                    </Box>
                  </Flex>
                  <Box mt={5}>We encourage you to <NLink href='/search'><a>explore OONI measurements</a></NLink> to find more highlights!</Box>
                </Text>
              </Box>
            </Flex>
          </Container>
        </Container>
      </Layout>
    )
  }
}
