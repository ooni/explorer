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

const StatusHeader = ({ status, color, icon, label, info }) => {
  if (status) {
    switch (status) {
      case 'anomaly':
        label = 'Anomaly'
        icon = <MdPriorityHigh />
        break
      case 'reachable':
        label = 'Reachable'
        icon = <MdCheck />
        break
      case 'error':
        label = 'Error'
        icon = <MdCheck />
        break
      case 'confirmed':
        label = 'Blocking Confirmed'
        icon = <MdCheck />
        break
      default:
        label: ''
        icon: <div />
    }
  }

  return (
    <StatusHeaderContainer py={4} color={color}>
      <Container>
        <Flex pb={4} justifyContent='center'>
          <Box>
            <StatusLabel fontSize={4}>
              {icon} {label}
            </StatusLabel>
          </Box>
        </Flex>
        {info && <Flex flexWrap='wrap' justifyContent='center'>
          {info}
        </Flex>}
      </Container>
    </StatusHeaderContainer>
  )
}

StatusHeader.propTypes = {
  status: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.node,
  label: PropTypes.string,
  info: PropTypes.node
}
export default StatusHeader
