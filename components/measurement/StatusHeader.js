import React from 'react'
import PropTypes from 'prop-types'
import { Container, Flex, Box, Text } from 'ooni-components'
import MdPriorityHigh from 'react-icons/lib/md/priority-high'
import MdCheck from 'react-icons/lib/md/check'
import styled from 'styled-components'

const StatusHeaderContainer = styled(Box)`
  background-color: ${props => props.color};
  color: white;
`

const StatusLabel = styled(Text)`
  font-weight: 600;
`

const StatusHeader = ({ anomaly, color, icon, label, moreInfo }) => {
  if (anomaly) {
    label = label || 'Anomaly'
    icon = icon || <MdPriorityHigh />
  } else {
    label = label || 'Reachable'
    icon = icon || <MdCheck />
  }
  return (
    <StatusHeaderContainer py={5} color={color}>
      <Container>
        <Flex py={1} justifyContent='center'>
          <Box>
            <StatusLabel fontSize={4}>
              {icon} {label}
            </StatusLabel>
          </Box>
        </Flex>
        {moreInfo && <Flex py={1} justifyContent='center'>
          {moreInfo}
        </Flex>}
      </Container>
    </StatusHeaderContainer>
  )
}

StatusHeader.propTypes = {
  anomaly: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.node,
  label: PropTypes.string,
  moreInfo: PropTypes.node
}
export default StatusHeader
