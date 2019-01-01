import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Text, Heading } from 'ooni-components'

const DetailBoxLabel = styled(Text)`
  font-weight: 600;
`

const DetailsBox = ({
  title,
  items,
  bg
}) => (
  <Box width={1} bg={bg}>
    <Box p={3}>
      <Heading h={4}>{title}</Heading>
      {items.map((item, index) =>
        <Flex mb={1} key={index}>
          <Box width={1/4}>
            <DetailBoxLabel>{item.label}</DetailBoxLabel>
          </Box>
          <Box>
            <Text>{item.value}</Text>
          </Box>
        </Flex>
      )}
    </Box>
  </Box>
)

DetailsBox.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string
  }))
}

export default DetailsBox
