import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Heading,
  Flex,
  Box
} from 'ooni-components'

const DetailsBox = ({ title, content }) => (
  <Box w={1/2}>
    <Heading h={4}>{title}</Heading>
    {content}
  </Box>
)

DetailsBox.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.element
}

const TelegramDetails = ({ testKeys }) => {
  return (
    <Container>
      <Flex>
        <DetailsBox title='Test Details' content={
          <Box>TBA</Box>
        } />
        <DetailsBox title='End Point Status' content={
          <Box>TBA</Box>
        } />
      </Flex>
    </Container>
  )
}

TelegramDetails.propTypes = {
  testKeys: PropTypes.object.isRequired
}

export default TelegramDetails
