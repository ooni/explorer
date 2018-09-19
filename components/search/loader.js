import React from 'react'

import styled from 'styled-components'

import {
  Flex, Box,
  Heading
} from 'ooni-components'

import BarLoader from '../bar-loader'

const StyledLoader = styled.div`
  width: 100%;
  padding-bottom: 100px;
  display: ${props => props.loading === true ? 'block' : 'none'};
`

const Loader = ({loading}) => (
  <StyledLoader loading={loading}>
    <Flex alignItems='baseline' justifyContent='space-around'>
      <Box>
        <Flex flexDirection='column'>
          <Box style={{height: '200px'}}>
            <BarLoader />
          </Box>
          <Box style={{textAlign: 'center'}}>
            <Heading h={3}>Loading</Heading>
          </Box>
        </Flex>
      </Box>
    </Flex>
  </StyledLoader>
)

export default Loader
