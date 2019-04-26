import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'ooni-components'
import SectionHeader from './section-header'
import { BoxWithTitle } from './box'
import TestsByGroup from './overview-charts'
import FormattedMarkdown from '../formatted-markdown'
import {
  NettestGroupWebsites,
  NettestGroupInstantMessaging,
  NettestGroupMiddleBoxes,
} from 'ooni-components/dist/icons'


const NwInterferenceStatus = styled(Box)`
  color: ${props => props.color || props.theme.colors.gray5};
  font-size: 18px;
`
NwInterferenceStatus.defaultProps = {
  mb: 3
}

const getStatus = (count, formattedMessageId)=> {
  if (count === null) {
    return formattedMessageId + '.NoData'
  } else if (count > 0) {
    return formattedMessageId + '.Blocked'
  } else {
    return formattedMessageId + '.Normal'
  }
}

const FeaturedArticle = ({link, title}) => (
  <Box py={1}>
    <a href={link} target='_blank' rel='noopener noreferrer'>
      {title}
    </a>
  </Box>
)

const SummaryText = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray4};
  border-left: 12px solid ${props => props.theme.colors.blue5};
  font-size: 28px;
  font-style: italic;
  line-height: 1.5;
`

SummaryText.defaultProps = {
  p: 3,
}

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
  featuredArticles = [],
}) => {
  return (
    <React.Fragment>
      <SectionHeader>
        <SectionHeader.Title name='overview'>
          <FormattedMessage id='Country.Heading.Overview' />
        </SectionHeader.Title>
      </SectionHeader>
      <BoxWithTitle title={<FormattedMessage id='Country.Overview.Heading.NwInterference' />}>
        <Flex flexWrap='wrap'>
          <NwInterferenceStatus width={[1, 1/2]} color={middleboxCount && 'violet8'}>
            <NettestGroupMiddleBoxes size={32} />
            <FormattedMessage
              id={ getStatus(middleboxCount, 'Country.Overview.NwInterference.Middleboxes') }
              values={{ middleboxCount }}
            />
          </NwInterferenceStatus>
          {/* <NwInterferenceStatus width={[1, 1/2]} color={circumventionTools && 'pink6'}>
            <FormattedMessage
              id={ getStatus(circumventionTools, 'Country.Overview.NwInterference.CircumventionTools') }
              values={{ circumventionTools }}
            />
          </NwInterferenceStatus> */}
          <NwInterferenceStatus width={[1, 1/2]} color={imCount && 'yellow9'}>
            <NettestGroupInstantMessaging size={32} />
            <FormattedMessage
              id={ getStatus(imCount, 'Country.Overview.NwInterference.IM') }
              values={{ imCount }}
            />
          </NwInterferenceStatus>
          <NwInterferenceStatus width={[1, 1/2]} color={blockedWebsitesCount && 'indigo5'}>
            <NettestGroupWebsites size={32} />
            <FormattedMessage
              id={ getStatus(blockedWebsitesCount, 'Country.Overview.NwInterference.Websites') }
              values={{ blockedWebsitesCount }}
            />
          </NwInterferenceStatus>
        </Flex>
      </BoxWithTitle>
      <Heading h={4}>
        <FormattedMessage id='Country.Overview.Heading.TestsByClass' />
      </Heading>
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
                  <FeaturedArticle link={article.link} title={article.title} />
                </li>
              ))}
            </ul>
        }
      </BoxWithTitle>
      {/* Highlight Box */}
      {/* <SummaryText> */}
      <SummaryText>
        <FormattedMarkdown
          id='Country.Overview.SummaryTextTemplate'
          values={{
            measurementCount,
            countryName,
            startDate: new Date(measuredSince).toLocaleDateString(),
            networkCovered: networkCount,
            mostMeasuredASName: 'NA',
            mostMeasuredASNumber: 'NA'
          }}
        />
      </SummaryText>
      {/* </SummaryText> */}
    </React.Fragment>
  )
}
export default Overview
