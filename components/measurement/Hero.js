import React from 'react'
import PropTypes from 'prop-types'
import { Container, Flex, Box, Text } from 'ooni-components'
import { Tick, Cross } from 'ooni-components/dist/icons'
import { MdWarning, MdPriorityHigh} from 'react-icons/md'
import { FaQuestion } from 'react-icons/fa'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

const HeroContainer = styled(Box)`
  color: white;
`

const Hero = ({ status, icon, label, info }) => {
  let computedLabel = ''
  if (status) {
    switch (status) {
    case 'anomaly':
      computedLabel = <FormattedMessage id='General.Anomaly' />
      icon = <MdPriorityHigh />
      break
    case 'reachable':
      computedLabel = <FormattedMessage id='General.OK' />
      icon = <Tick />
      break
    case 'error':
      computedLabel = <FormattedMessage id='General.Error' />
      icon = <FaQuestion size={36}/>
      break
    case 'confirmed':
      computedLabel = <FormattedMessage id='Measurement.Hero.Status.Confirmed' />
      icon = <Cross />
      break
    case 'down':
      computedLabel = <FormattedMessage id='Measurement.Hero.Status.Down' />
      icon = <MdWarning />
      break
    default:
      icon = icon || <div/>
    }
  }

  if (!label) {
    label = computedLabel
  }

  return (
    <HeroContainer py={2} data-test-id='hero'>
      <Container>
        <Text fontWeight={400} fontSize={24} as='div'>
          <Flex my={2} justifyContent='center' alignItems='center'>
            <Box>{icon}</Box> <Box>{label}</Box>
          </Flex>
        </Text>
        {info &&
          <Text fontSize={3} fontWeight={300} textAlign='center' as='div'>
            {info}
          </Text>
        }
      </Container>
    </HeroContainer>
  )
}

Hero.propTypes = {
  status: PropTypes.string,
  icon: PropTypes.node,
  label: PropTypes.string,
  info: PropTypes.node
}
export default Hero
