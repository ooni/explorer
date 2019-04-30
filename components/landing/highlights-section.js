import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'ooni-components'
import { Text } from 'rebass'

import HighlightBox from './highlight-box'

const HighlightSection = ({
  title,
  highlights
}) => (
  <Flex flexWrap='wrap' alignItems='flex-start' my={5}>
    <Box p={2} width={[1, 2/12]}>
      <Text fontSize={20} fontWeight={500} textAlign={['center', 'left']}>
        {title}
      </Text>
    </Box>
    <Box width={[1, 10/12]}>
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
