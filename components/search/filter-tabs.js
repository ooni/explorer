import React from 'react'

import styled from 'styled-components'

import {
  Flex, Box
} from 'ooni-components'

const StyledFilterTab = styled.button`
  font-size: 14px;
  height: 32px;
  text-transform: none;
  padding: 0 16px;
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  // Gets rid of tap active state
  -webkit-tap-highlight-color: transparent;

  outline: 0;

  // Specific
  font-family: inherit;
  font-weight: 600;
  text-decoration: none;

  text-align: center;
  letter-spacing: .5px;
  z-index: 1;
  transition: .2s ease-out;
  cursor: pointer;

  background-color: ${props => props.active ? props.theme.colors.blue5 : 'transparent'};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.blue5};
  &:active {
    transition: .2s ease-in;
    background-color: ${props => props.theme.colors.blue4};
    color: ${props => props.theme.colors.white};
  }
  &:hover {
    background-color: ${props => props.theme.colors.blue4};
    color: ${props => props.theme.colors.white};
    transition: .2s ease-in;
  }
`

const FilterTabLeft = styled(StyledFilterTab)`
  border-radius: 32px 0px 0px 32px;
  border: 1px solid ${props => props.theme.colors.blue5};
  border-right: 0px;
`
const FilterTabRight = styled(StyledFilterTab)`
  border: 1px solid ${props => props.theme.colors.blue5};
  border-radius: 0px 32px 32px 0px;
  border-left: 0px;
`

const FilterTabCenter = styled(StyledFilterTab)`
  border: 1px solid ${props => props.theme.colors.blue5};
  border-radius: 0px;
`

const FilterTabs = ({onClick, onlyFilter}) => (
  <Flex>
    <Box>
      <FilterTabLeft
        onClick={() => {onClick('all')}}
        active={onlyFilter === 'all'}>
    All Results
      </FilterTabLeft>
    </Box>
    <Box>
      <FilterTabCenter
        onClick={() => {onClick('confirmed')}}
        active={onlyFilter === 'confirmed'}>
    Confirmed
      </FilterTabCenter >
    </Box>
    <Box>
      <FilterTabRight
        onClick={() => {onClick('anomalies')}}
        active={onlyFilter === 'anomalies'}>
    Anomalies
      </FilterTabRight>
    </Box>
  </Flex>
)

export default FilterTabs
