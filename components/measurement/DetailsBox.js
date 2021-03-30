import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Text, Heading } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { CollapseTrigger } from '../CollapseTrigger'

const DetailBoxLabel = styled(Text)`
  font-weight: 600;
`

const DetailBoxValue = styled(Text)`
  overflow-wrap: break-word;
`

export const DetailsBoxTable = ({
  title,
  items,
  bg
}) => (
  <DetailsBox title={title} bg={bg} content={
    items.map((item, index) =>
      <Flex flexWrap='wrap' key={index}>
        <Box width={[1, 1/4]}>
          <DetailBoxLabel>{item.label}</DetailBoxLabel>
        </Box>
        <Box width={[1, 3/4]}>
          <DetailBoxValue>{item.value}</DetailBoxValue>
        </Box>
      </Flex>
    )}
  />
)

DetailsBoxTable.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string
  })),
  bg: PropTypes.string
}

const StyledDetailsBox = styled(Box)`
  border: 2px solid ${props => props.theme.colors.gray2};
`

const StyledDetailsBoxHeader = styled(Flex)`
  cursor: pointer;
`

const StyledDetailsBoxContent = styled(Box)`
  overflow-x: auto;
`

export const DetailsBox = ({ title, content, collapsed = false, ...rest }) => {
  const [isOpen, setIsOpen] = useState(!collapsed)

  const onToggle = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

  return (
    <StyledDetailsBox width={1} {...rest} mb={3}>
      {title &&
        <StyledDetailsBoxHeader px={3} py={2} bg='gray2' alignItems='center' onClick={onToggle}>
          <Box>
            <Heading h={4}>{title}</Heading>
          </Box>
          <Box ml='auto'>
            <CollapseTrigger size={36} $open={isOpen} />
          </Box>
        </StyledDetailsBoxHeader>
      }
      {isOpen &&
        <StyledDetailsBoxContent p={3} flexWrap='wrap'>
          {content}
        </StyledDetailsBoxContent>
      }
    </StyledDetailsBox>
  )
}

DetailsBox.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(FormattedMessage)
  ]).isRequired,
  content: PropTypes.node,
  collapsed: PropTypes.bool
}
