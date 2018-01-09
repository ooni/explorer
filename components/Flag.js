import React from 'react'

import styled from 'styled-components'

const FlagBubble = styled.div`
`

const FlagContainer = styled.div`
  border-radius: 100%;
  overflow: hidden;
  width: 60px;
  height: 60px;
  & > svg {
    width: 60px;
    height: auto;
  }
`
export const Flag = ({alpha2}) => {
  alpha2 = alpha2.toLowerCase()
  const FlagSvg = require('./flags/' + alpha2).default
  return (
    <FlagContainer>
      <FlagSvg viewPort="0 0 512 512" />
    </FlagContainer>
  )
}

export default Flag
