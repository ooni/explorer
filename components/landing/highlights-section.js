import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'ooni-components'
import { Text } from 'rebass'

import HighlightBox from './highlight-box'

const HighlightSection = ({
  title,
  highlights
}) => {
  const [isMobile, setIsMobile] = useState(false)

  // Equivalent of componentDidMount and componentDidUpdate
  // Limited to run only once by passing `[]` as second argument
  useEffect(() => {
    setIsMobile(window.innerWidth < 800)
  }, [])

  return (
    <section>
      <Box>
        <Text fontSize={20} fontWeight={500} textAlign={['center', 'left']}>
          {title}
        </Text>
      </Box>
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
