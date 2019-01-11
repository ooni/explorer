import React from 'react'
import PropTypes from 'prop-types'
import { Container, Flex, Box, Text } from 'ooni-components'
import { Tick } from 'ooni-components/dist/icons'
import MdPriorityHigh from 'react-icons/lib/md/priority-high'
import styled from 'styled-components'

const StatusHeaderContainer = styled(Box)`
  background-color: ${props => props.color};
  color: white;
`

const StatusLabel = styled(Text)`
  font-weight: 600;
`

const StatusHeader = ({ status, color, icon, label, info }) => {
  let computedLabel = ''
  if (status) {
    switch (status) {
    case 'anomaly':
      computedLabel = 'Anomaly'
      icon = <MdPriorityHigh />
      break
    case 'reachable':
      computedLabel = 'Reachable'
      icon = <Tick />
      break
    case 'error':
      computedLabel = 'Error'
      icon = <Tick />
      break
    case 'confirmed':
      computedLabel = 'Blocking Confirmed'
      icon = <Tick />
      break
    default:
      icon = <div/>
    }
  }

  if (!label) {
    label = computedLabel
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
