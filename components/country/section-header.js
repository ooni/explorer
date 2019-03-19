import React from 'react'
import { Flex, Box } from 'ooni-components'
import styled from 'styled-components'

const SectionHeader = styled(Flex)`
  border-bottom: 1px solid ${props => props.theme.colors.gray3};
`

SectionHeader.defaultProps = {
  pb: 3,
  mb: 4,
  flexWrap: 'wrap'
}

SectionHeader.Title = styled.a`
  color: ${props => props.theme.colors.blue5};
  font-size: 42px;
  font-weight: 600;
`

export default SectionHeader
