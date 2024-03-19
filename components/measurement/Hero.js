import { Box, Container, Flex, Text } from 'ooni-components'
import { Cross, Tick } from 'ooni-components/icons'
import PropTypes from 'prop-types'
import React from 'react'
import { FaQuestion } from 'react-icons/fa'
import { MdPriorityHigh, MdWarning } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

const HeroContainer = styled(Box)`
  color: white;
`

const Hero = ({ status, icon, label, info }) => {
  let computedLabel = ''
  if (status) {
    switch (status) {
      case 'anomaly':
        computedLabel = <FormattedMessage id="General.Anomaly" />
        icon = <MdPriorityHigh />
        break
      case 'reachable':
        computedLabel = <FormattedMessage id="General.OK" />
        icon = <Tick />
        break
      case 'error':
        computedLabel = <FormattedMessage id="General.Error" />
        icon = <FaQuestion size={36} />
        break
      case 'confirmed':
        computedLabel = (
          <FormattedMessage id="Measurement.Hero.Status.Confirmed" />
        )
        icon = <Cross />
        break
      case 'down':
        computedLabel = <FormattedMessage id="Measurement.Hero.Status.Down" />
        icon = <MdWarning />
        break
      default:
        icon = icon || <div />
    }
  }

  if (!label) {
    label = computedLabel
  }

  return (
    <HeroContainer py={2}>
      <Container>
        <Text fontWeight={400} fontSize={24} as="div">
          <Flex my={2} justifyContent="center" alignItems="center">
            {icon} <Box>{label}</Box>
          </Flex>
        </Text>
        {info && (
          <Text fontSize={3} fontWeight={300} textAlign="center" as="div">
            {info}
          </Text>
        )}
      </Container>
    </HeroContainer>
  )
}

Hero.propTypes = {
  status: PropTypes.string,
  icon: PropTypes.node,
  label: PropTypes.string,
  info: PropTypes.node,
}
export default Hero
