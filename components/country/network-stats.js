import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, theme } from 'ooni-components'
import {
  NettestGroupMiddleBoxes,
} from 'ooni-components/dist/icons'
import { MdFileDownload, MdFileUpload } from 'react-icons/lib/md'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { testGroups } from '../test-info'


const BorderedBox = styled(Flex)`
  border: 1px solid ${props => props.theme.colors.gray3};
  padding: 12px;
`

const StyledStat = styled(Flex)`
  font-size: 28px;
  font-weight: 300;
  line-height: 40px;
`

const StatBox = ({
  label = 'Average Download',
  value = '50 Mbit/s',
  ...props
}) => (
  <Box {...props}>
    <StyledStat>
      {value}
    </StyledStat>
    <Flex>
      {label}
    </Flex>
  </Box>
)

const NetworkStats = ({
  asn,
  asnName,
  avgDownload,
  avgUpload,
  avgPing,
  middleboxes
}) => (
  <React.Fragment>
    <BorderedBox bg='gray1'>
      <Box mx={2}><strong>AS{asn}</strong></Box>
      <Box>{asnName}</Box>
    </BorderedBox>
    <BorderedBox mb={3} flexWrap='wrap' justifyContent='space-between'>
      <StatBox
        label={ <FormattedMessage id='Country.NetworkProperties.InfoBox.Label.AverageDownload' />}
        value={(
          <span>
            <MdFileDownload color={theme.colors.blue5} />
            {avgDownload}
            <FormattedMessage id='Country.NetworkProperties.InfoBox.Units.Mbits' />
          </span>
        )}
      />
      <StatBox
        label={<FormattedMessage id='Country.NetworkProperties.InfoBox.Label.AverageUpload' />}
        value={(
          <span>
            <MdFileUpload color={theme.colors.blue5} />
            {avgUpload}
            <FormattedMessage id='Country.NetworkProperties.InfoBox.Units.Mbits' />
          </span>
        )}
      />
      <StatBox
        label={<FormattedMessage id='Country.NetworkProperties.InfoBox.Label.AveragePing' />}
        value={(
          <span>
            {avgPing}
            <FormattedMessage id='Country.NetworkProperties.InfoBox.Units.Milliseconds' />
          </span>
        )}
      />
      <StatBox color={middleboxes ? testGroups.middlebox.color : theme.colors.gray5}
        label={<FormattedMessage id='Country.NetworkProperties.InfoBox.Label.Middleboxes.NotFound' />}
        value={<NettestGroupMiddleBoxes size={40} />}
      />
    </BorderedBox>
  </React.Fragment>
)

export default NetworkStats
