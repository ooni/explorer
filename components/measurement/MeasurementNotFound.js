/* global process */
import React from 'react'
import NavBar from '../NavBar'
import { Container, Flex, Box, Heading, Text } from 'ooni-components'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import OONI404 from '../../static/images/OONI_404.svg'

const WordBreakText = styled(Text)`
  word-wrap: break-word;
`

const MeasurementNotFound = () => {
  const { asPath } = useRouter()
  return (
    <React.Fragment>
      <NavBar />
      <Container>
        <Flex flexDirection={['column', 'row']} justifyContent='space-around' alignItems='center' my={5}>
          <OONI404 height='200px' />
          <Box width={[1, 1/2]} my={[3, 0]}>
            <Heading color='blue5' h={4}>Measurement Not Found</Heading>
            <WordBreakText color='gray8' as='code'>
              {`${process.env.EXPLORER_URL}${asPath}`}
            </WordBreakText>
          </Box>
        </Flex>
      </Container>
    </React.Fragment>
  )
}

export default MeasurementNotFound
