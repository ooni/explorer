import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Flex, Box } from 'ooni-components'
import SectionHeader from './section-header'
import { BoxWithTitle } from './box'
import TestsByGroup from './overview-charts'
import {
  NettestGroupWebsites,
  NettestGroupInstantMessaging,
  NettestGroupMiddleBoxes,
  NettestGroupPerformance
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

const Overview = ({
  testCoverage,
  networkCoverage,
  fetchTestCoverageData,
  middleboxCount,
  imCount,
  circumventionTools,
  blockedWebsitesCount
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
      <FormattedMessage id='Country.Overview.Heading.TestsByClass' />
      <TestsByGroup
        fetchTestCoverageData={fetchTestCoverageData}
        testCoverage={testCoverage}
        networkCoverage={networkCoverage}
      />

      <BoxWithTitle title={<FormattedMessage id='Country.Overview.Heading.FeaturedResearch' />}>
        List of blog articles
      </BoxWithTitle>
      {/* Highlight Box */}
      <FormattedMessage
        id='Country.Overview.SummaryTextTemplate'
        defaultMessage='During the time period {startDate} to {endDate}, {measurementCount} Measurements have been conducted in {countryName}, resulting in {confirmCount} Confirmed Blocked, {anomalyCount} Anomalies and {accessibleCount} Accessible results. These measurements cover {networkCovered} networks out of {totalNetworks} in total in {countryName}. The network with the most measurements is {mostBlockedASNname} ({mmostBlockedASN}).'
      />
    </React.Fragment>
  )
}
export default Overview
