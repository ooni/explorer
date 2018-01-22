import React from 'react'

import styled from 'styled-components'

const FlagBubble = styled.div`
`

const FlagContainer = styled.div`
  border-radius: 100%;
  overflow: hidden;
  width: 60px;
  height: 60px;
  ${props => {
    if (props.center === true) {
      return 'margin: 0 auto;'
    }
  }}
  ${props => {
    if (props.border === true)  {
      return `border: 1px solid ${props.theme.colors.black};`
    }
  }}
  & > svg {
    width: 60px;
    height: auto;
    margin: 0;
  }
`
export const Flag = ({alpha2, center, border}) => {
  alpha2 = alpha2.toLowerCase()
  const FlagSvg = require('./flags/' + alpha2).default
  return (
    <FlagContainer center={center} border={border}>
      <FlagSvg viewPort="0 0 512 512" />
    </FlagContainer>
  )
}

export default Flag
