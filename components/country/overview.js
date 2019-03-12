import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Flex, Box, Text } from 'ooni-components'

import SectionHeader from './section-header'
import { BoxWithTitle } from './box'

const NwInterferenceStatus = styled(Box)`
  color: ${props => props.color || props.theme.colors.gray5};
  font-size: 18px;
`
NwInterferenceStatus.defaultProps = {
  mb: 3
}

const Overview = ({
  middleboxCount,
  imCount,
  circumventionTools,
  websitesCount
}) => (
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
  </React.Fragment>
)

export default Overview
