import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Text } from 'ooni-components'

import HighlightBox from './highlight-box'

const HighlightSection = ({
  title,
  highlights
}) => (
  <Flex alignItems='flex-start' my={5}>
    <Box p={2} width={2/12}>
      <Text fontSize={20}>
        {title}
      </Text>
    </Box>
    <Box width={10/12}>
      {/* HighlightBoxes */}
      <Flex flexWrap='wrap'>
        {
          highlights.map((item, index) => (
            <HighlightBox
              key={index}
              {...item}
            />
          ))
        }
      </Flex>
    </Box>
  </Flex>
)

HighlightSection.propTypes = {
  title: PropTypes.string.isRequired,
  highlights: PropTypes.arrayOf(PropTypes.shape({
    countryCode: PropTypes.string.isRequired,
    countryName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    report: PropTypes.string,
    explore: PropTypes.string
  }))
}

export default HighlightSection
