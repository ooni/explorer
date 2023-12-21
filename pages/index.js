/* global process */
import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import NLink from 'next/link'
import Router from 'next/router'
import FormattedMarkdown from '../components/FormattedMarkdown'
import styled from 'styled-components'
import axios from 'axios'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Link,
  Flex,
  Box,
  Container,
  Button,
  Heading,
  Text
} from 'ooni-components'

import NavBar from '../components/NavBar'
import { toCompactNumberUnit } from '../utils'
import HighlightSection from '../components/landing/HighlightsSection'
import highlightContent from '../components/landing/highlights.json'
import CoverageChart from '../components/landing/Stats'

const HeroUnit = styled.div`
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
  font-weight: normal;
  color: white;
  border: 2px solid white;
  border-radius: 48px;
  height: 60px;
  cursor: pointer; /* until added to Button in ooni-components */

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
      <Text as='span' fontSize={32}>{unit}</Text>
    </Text>
    <StyledLabel>
      {label}
    </StyledLabel>
  </StyledStatsItem>
)

StatsItem.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]),
  unit: PropTypes.string,
  value: PropTypes.number
}

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

const FeatureBoxTitle = styled(Flex)`
`
FeatureBoxTitle.defaultProps = {
  color: 'blue9',
  fontSize: 24,
  fontWeight: 600,
  mb: 2
}

const ImgBox = styled.img`
  width: 100%;
`

const StyledContainer = styled(Container)`
  background-image: url('/static/images/world-dots.svg');
  background-repeat: no-repeat;
  background-position: center;
`

export async function getServerSideProps({ query }) {
  const client = axios.create({baseURL: process.env.NEXT_PUBLIC_OONI_API}) // eslint-disable-line
  const result = await client.get('/api/_/global_overview')

  return {
    props: {
      measurementCount: result.data.measurement_count,
      asnCount: result.data.network_count,
      countryCount: result.data.country_count
    }
  }
}

const LandingPage = ({ measurementCount, asnCount, countryCount}) => {
  const intl = useIntl()
  measurementCount = toCompactNumberUnit(measurementCount)
  asnCount = toCompactNumberUnit(asnCount)

  return (
    <>
      <Head>
        <title>{intl.formatMessage({id: 'General.OoniExplorer'})}</title>
      </Head>
      <HeroUnit>
        <NavBar color='transparent' />
        <StyledContainer py={[0, 120]} my={[0, 90]}>
          <Text textAlign='center'>
            <Heading h={1}>
              <Text fontSize={[32, 64]} color='#ffffff'><FormattedMessage id='Home.Banner.Title.UncoverEvidence' /></Text>
            </Heading>
            <Text fontSize={[18, 24]} color='blue1'><FormattedMessage id='Home.Banner.Subtitle.ExploreCensorshipEvents' /></Text>
            <NLink href='/chart/mat'>
              <ExploreButton mt={48} px={5} hollow fontSize={24}>
                <FormattedMessage id='Home.Banner.Button.Explore' />
              </ExploreButton>
            </NLink>
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
            <ImgBox src='/static/images/search.png' alt='Search and Filter' />
          </FeatureBox>
        </FeatureRow>
        {/* Network Properties */}
        <FeatureRow>
          <FeatureBox>
            <ImgBox src='/static/images/network-performance.png' alt='Network Properties' />
          </FeatureBox>
          <FeatureBox color='gray7'>
            <FeatureBoxTitle>
              <FormattedMessage id='Home.NetworkProperties.Title' />
            </FeatureBoxTitle>
            <FormattedMessage id='Home.NetworkProperties.SummaryText' />
          </FeatureBox>
        </FeatureRow>
        {/* Measurement Statistics */}
        <Container mb={5}>
          <Flex justifyContent='center' my={3}>
            <Heading h={2} color='blue7'>
              <FormattedMessage id={'Home.MonthlyStats.Title'} />
            </Heading>
          </Flex>
          <CoverageChart />
        </Container>
        {/* Highlights */}
        <Container>
          <Flex flexWrap='wrap' justifyContent='center' my={3}>
            <Heading h={2} color='blue7'>
              <a id='highlights'>
                <FormattedMessage id={'Home.Highlights.Title'} />
              </a>
            </Heading>
          </Flex>
          <Flex flexWrap='wrap' justifyContent='center'>
            <Box px={[0, 4]} my={3}>
              <Text textAlign='center' fontSize={26}>
                <FormattedMarkdown
                  id='Home.Highlights.Description'
                />
              </Text>
            </Box>
          </Flex>

          {/* Political Events */}
          <HighlightSection
            title={<FormattedMessage id='Home.Highlights.Political' />}
            description={<FormattedMessage id='Home.Highlights.Political.Description' />}
            highlights={highlightContent.political}
          />
          {/* Media */}
          <HighlightSection
            title={<FormattedMessage id='Home.Highlights.Media' />}
            description={<FormattedMessage id='Home.Highlights.Media.Description' />}
            highlights={highlightContent.media}
          />
          {/* LGBTQI sites */}
          <HighlightSection
            title={<FormattedMessage id='Home.Highlights.LGBTQI' />}
            description={<FormattedMessage id='Home.Highlights.LGBTQI.Description' />}
            highlights={highlightContent.lgbtqi}
          />
          {/* Censorship changes */}
          <HighlightSection
            title={<FormattedMessage id='Home.Highlights.Changes' />}
            description={<FormattedMessage id='Home.Highlights.Changes.Description' />}
            highlights={highlightContent.changes}
          />
          <Box my={3}>
            <Text fontSize={20}>
              <FormattedMessage 
                id="Home.Highlights.CTA"
                values={{'link-to-search': (string) => (
                  <NLink href='/search'>{string}</NLink>
                  )
                }}
              />
            </Text>
          </Box>
        </Container>
      </Container>
    </>
  )
}

LandingPage.propTypes = {
  countryCount: PropTypes.number,
  asnCount: PropTypes.number,
  measurementCount: PropTypes.number
}

export default LandingPage