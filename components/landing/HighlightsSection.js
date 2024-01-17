import NLink from 'next/link'
import { Box, Button, Flex, Text } from 'ooni-components'
import PropTypes from 'prop-types'
import React from 'react'
import { useIntl } from 'react-intl'
import { styled } from 'styled-components'
import HighlightBox from './HighlightBox'

const StyledGrid = styled(Box)`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 24px;
`

const HighlightSection = ({
  title,
  highlights,
  description
}) => {
  const intl = useIntl()

  return (
    <section>
      <Box mt={4} mb={3}>
        <Flex>
          <Text fontSize={24} fontWeight='bold' color='blue9'>
            {title}
          </Text>
        </Flex>
      </Box>
      {/* Optional Description */}
      {description && <Box mt={4} mb={3}>
        <Text fontSize={20}>{description}</Text>
      </Box>}
      <StyledGrid>
        {/* HighlightBoxes */}
        {
          highlights.map((item, index) => (
            <HighlightBox
              key={index}
              title={item.title ? intl.formatMessage({id: item.title}) : ''}
              text={item.text ? intl.formatMessage({id: item.text}) : ''}
              countryCode={item.countryCode}
              footer={
                <Flex justifyContent={'space-between'}>
                  {item.explore && 
                    <Box>
                      <NLink href={item.explore}>
                        <Button type='button' hollow size='small'>
                          {intl.formatMessage({id: 'Home.Highlights.Explore'})}
                        </Button>
                      </NLink>
                    </Box>
                  }
                  {item.report && 
                    <Box>
                      <NLink href={item.report}>
                        <Button type='button' hollow size='small'>{intl.formatMessage({id: 'Home.Highlights.ReadReport'})}</Button>
                      </NLink>
                    </Box>
                  }
                </Flex>
              }
            />
          ))
        }
      </StyledGrid>
    </section>
  )
}

HighlightSection.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  highlights: PropTypes.arrayOf(PropTypes.shape({
    countryCode: PropTypes.string.isRequired,
    title: PropTypes.string,
    text: PropTypes.string,
    report: PropTypes.string,
    explore: PropTypes.string
  }))
}

export default HighlightSection
