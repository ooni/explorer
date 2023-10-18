import React from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'
import { Box, Heading, Link, Text } from 'ooni-components'
import SectionHeader from './SectionHeader'
import { BoxWithTitle } from './boxes'
import TestsByGroup from './OverviewCharts'
import FormattedMarkdown from '../FormattedMarkdown'
import { useCountry } from './CountryContext'
import BlockText from 'components/BlockText'

const NwInterferenceStatus = styled(Box)`
  color: ${props => props.color || props.theme.colors.gray5};
  font-size: 18px;
`
NwInterferenceStatus.defaultProps = {
  mb: 3
}

const messages = defineMessages({
  middleboxNoData: {
    id: 'Country.Overview.NwInterference.Middleboxes.NoData',
    defaultMessage: ''
  },
  middleboxBlocked: {
    id: 'Country.Overview.NwInterference.Middleboxes.Blocked',
    defaultMessage: ''
  },
  middleboxNormal: {
    id: 'Country.Overview.NwInterference.Middleboxes.Normal',
    defaultMessage: ''
  },
  imNoData: {
    id: 'Country.Overview.NwInterference.IM.NoData',
    defaultMessage: ''
  },
  imBlocked: {
    id: 'Country.Overview.NwInterference.IM.Blocked',
    defaultMessage: ''
  },
  imNormal: {
    id: 'Country.Overview.NwInterference.IM.Normal',
    defaultMessage: ''
  },
  websitesNoData: {
    id: 'Country.Overview.NwInterference.Websites.NoData',
    defaultMessage: ''
  },
  websitesBlocked: {
    id: 'Country.Overview.NwInterference.Websites.Blocked',
    defaultMessage: ''
  },
  websitesNormal: {
    id: 'Country.Overview.NwInterference.Websites.Normal',
    defaultMessage: ''
  }
})

const getStatus = (count, formattedMessageId)=> {
  if (count === null) {
    return messages[`${formattedMessageId}NoData`]
  } else if (count > 0) {
    return messages[`${formattedMessageId}Blocked`]
  } else {
    return messages[`${formattedMessageId}Normal`]
  }
}

const ooniBlogBaseURL = 'https://ooni.org'

const FeaturedArticle = ({link, title}) => (
  <Box py={1}>
    <Link color='blue7' href={ooniBlogBaseURL + link} target='_blank' rel='noopener noreferrer'>
      {title}
    </Link>
  </Box>
)

// const SummaryText = styled(Box)`
//   border: 1px solid ${props => props.theme.colors.gray4};
//   border-left: 12px solid ${props => props.theme.colors.blue5};
//   font-size: 22px;
//   font-style: italic;
//   line-height: 1.5;
// `

// SummaryText.defaultProps = {
//   p: 3,
// }

const LOW_DATA_THRESHOLD = 10

const Overview = ({
  countryName,
  testCoverage,
  networkCoverage,
  fetchTestCoverageData,
  middleboxCount,
  imCount,
  circumventionTools,
  blockedWebsitesCount,
  networkCount,
  measurementCount,
  measuredSince,
  featuredArticles = []
}) => {
  const intl = useIntl()
  const { countryCode } = useCountry()
  return (
    <>
      <SectionHeader>
        <SectionHeader.Title name='overview'>
          <FormattedMessage id='Country.Heading.Overview' />
        </SectionHeader.Title>
      </SectionHeader>
      {/* <SummaryText> */}
      <BlockText my={3}>
        <FormattedMarkdown
          id='Country.Overview.SummaryTextTemplate'
          values={{
            measurementCount: intl.formatNumber(measurementCount),
            linkToMeasurements: `/search?probe_cc=${countryCode}`,
            countryName,
            networkCovered: intl.formatNumber(networkCount)
          }}
        />
      </BlockText>
      {/* </SummaryText> */}

      {/*
      <BoxWithTitle title={<FormattedMessage id='Country.Overview.Heading.NwInterference' />}>
        <Flex flexWrap='wrap'>
          <NwInterferenceStatus width={[1, 1/3]} color={middleboxCount && 'violet8'}>
            <NettestGroupMiddleBoxes size={32} />
            {intl.formatMessage(getStatus(middleboxCount, 'middlebox'))}
          </NwInterferenceStatus>
          <NwInterferenceStatus width={[1, 1/2]} color={circumventionTools && 'pink6'}>
            {intl.formatMessage(getStatus(circumventionTools, 'circumvention'))}
          </NwInterferenceStatus>
          <NwInterferenceStatus width={[1, 1/3]} color={imCount && 'yellow9'}>
            <NettestGroupInstantMessaging size={32} />
            {intl.formatMessage(getStatus(imCount, 'im'))}
          </NwInterferenceStatus>
          <NwInterferenceStatus width={[1, 1/3]} color={blockedWebsitesCount && 'indigo5'}>
            <NettestGroupWebsites size={32} />
            {intl.formatMessage(getStatus(blockedWebsitesCount, 'websites'))}
          </NwInterferenceStatus>
        </Flex>
      </BoxWithTitle>
      */}
      <Heading h={4} my={2}>
        <FormattedMessage id='Country.Overview.Heading.TestsByClass' />
      </Heading>
      <Text fontSize={16}>
        <FormattedMarkdown id='Country.Overview.Heading.TestsByClass.Description' />
      </Text>
      <TestsByGroup
        fetchTestCoverageData={fetchTestCoverageData}
        testCoverage={testCoverage}
        networkCoverage={networkCoverage}
      />
      <BoxWithTitle title={<FormattedMessage id='Country.Overview.FeaturedResearch' />}>
        {
          (featuredArticles.length === 0)
            ? <FormattedMessage id='Country.Overview.FeaturedResearch.None' />
            : <ul>
              {featuredArticles.map((article, index) => (
                <li key={index}>
                  <FeaturedArticle link={article.href} title={article.title} />
                </li>
              ))}
            </ul>
        }
      </BoxWithTitle>
      {/* Highlight Box */}
    </>
  )
}
export default Overview
