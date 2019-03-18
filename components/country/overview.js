import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Flex, Box } from 'ooni-components'
import SectionHeader from './section-header'
import { BoxWithTitle } from './box'
import TestsByGroup from './overview-charts'

const NwInterferenceStatus = styled(Box)`
  color: ${props => props.color || props.theme.colors.gray5};
  font-size: 18px;
`
NwInterferenceStatus.defaultProps = {
  mb: 3
}

const Overview = ({
  testCoverage,
  networkCoverage,
  fetchTestCoverageData,
  middleboxCount,
  imCount,
  circumventionTools,
  websitesCount
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
          <NwInterferenceStatus width={1/2} color='violet8'>
            <FormattedMessage id='Country.Overview.NwInterference.Middleboxes'
              values={{ middleboxCount }}
            />
          </NwInterferenceStatus>
          <NwInterferenceStatus width={1/2} color='red'>
            <FormattedMessage id='Country.Overview.NwInterference.CircumventionTools'
              values={{ circumventionTools }}
            />
          </NwInterferenceStatus>
          <NwInterferenceStatus width={1/2} color='yellow9'>
            <FormattedMessage id='Country.Overview.NwInterference.IM'
              values={{ imCount }}
            />
          </NwInterferenceStatus>
          <NwInterferenceStatus width={1/2} color='indigo5'>
            <FormattedMessage id='Country.Overview.NwInterference.Websites'
              values={{ websitesCount }}
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
