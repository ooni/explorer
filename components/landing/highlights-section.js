import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'ooni-components'
import { Text } from 'rebass'

import HighlightBox from './highlight-box'

const HighlightSection = ({
  title,
  highlights,
  description
}) => {
  return (
    <section>
      <Box mt={4} mb={3}>
        <Text fontSize={24} fontWeight='bold' color='blue9' textAlign={['center', 'left']}>
          {title}
        </Text>
      </Box>
      {/* Optional Description */}
      {description && <Box mt={4} mb={3}>
        <Text fontSize={20}>{description}</Text>
      </Box>}
      <Flex flexWrap='wrap'>
        {/* HighlightBoxes */}
        {
          highlights.map((item, index) => (
            <HighlightBox
              key={index}
              {...item}
            />
          ))
        }
      </Flex>
    </section>
  )
}

HighlightSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
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
