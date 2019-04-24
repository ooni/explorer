import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Text, Heading } from 'ooni-components'

const DetailBoxLabel = styled(Text)`
  font-weight: 600;
`

export const DetailsBoxTable = ({
  title,
  items,
  bg
}) => (
  <DetailsBox title={title} bg={bg} content={
    items.map((item, index) =>
      <Flex flexWrap='wrap' key={index}>
        <Box width={1/4}>
          <DetailBoxLabel>{item.label}</DetailBoxLabel>
        </Box>
        <Box>
          <Text>{item.value}</Text>
        </Box>
      </Flex>
    )}
  />
)

DetailsBoxTable.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string
  })),
  bg: PropTypes.string
}

const StyledDetailsBox = styled(Box)`
  border: 2px solid ${props => props.theme.colors.gray2};
`

export const DetailsBox = ({ title, content, ...props }) => (
  <StyledDetailsBox width={1} {...props} mb={3}>
    {title &&
      <Flex px={3} bg='gray2'>
        <Heading h={4}>{title}</Heading>
      </Flex>
    }
    <Box p={3} flexWrap='wrap'>
      {content}
    </Box>
  </StyledDetailsBox>
)

DetailsBox.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.element
}
