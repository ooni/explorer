import React from 'react'
import styled from 'styled-components'
import { MdExpandLess } from 'react-icons/md'

export const CollapseTrigger = styled(MdExpandLess)`
  cursor: pointer;
  background-color: ${props => props.$bg || '#ffffff'};
  border-radius: 50%;
  transform: ${props => props.$open ? 'rotate(0deg)': 'rotate(180deg)'};
  transition: transform 0.1s linear;
`
