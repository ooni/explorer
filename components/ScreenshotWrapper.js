import React from 'react'
import { useScreenshot } from './ScreenshotContext'
import styled from 'styled-components'

const Wrapper = styled.div`
display: flex;
height: 100vh;
background-color: ${props => props.inputColor};
flex-direction: column;
justify-content: space-between;
`

export default function ScreenshotWrapper ({ color, children }) { 
  return (
    <Wrapper inputColor={color}>{children}</Wrapper>
  )
}
