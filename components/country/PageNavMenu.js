import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Link } from 'ooni-components'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { MdExpandLess } from 'react-icons/md'
import SocialButtons from '../SocialButtons'

const HideInLargeScreens = ({ children }) => (
  <Box
    sx={{
      display: 'none',
      '@media screen and (max-width: 64em)': {
        display: 'block',
      }
    }}
  >
    {children}
  </Box>
)

const PageNavItem = ({ link, children }) => (
  <Box mx={3} my={1}>
    <Link p={2} fontSize={16} color='blue5' href={link}>{children}</Link>
  </Box>
)

const ToggleIcon = styled(MdExpandLess).attrs({

})`
  cursor: pointer;
  background-color: ${props => props.theme.colors.gray3};
  border-radius: 50%;
  transform: ${props => props.$open ? 'rotate(0deg)': 'rotate(180deg)'};
  transition: transform 0.1s linear;
`

const PageNavMenu = ({ countryCode }) => {
  const [isOpen, setOpen] = useState(true)

  return (
    <React.Fragment>
      {/* Show a trigger to open and close the nav menu, but hide it on desktops */}
      <HideInLargeScreens large xlarge>
        <ToggleIcon size={36} $open={isOpen} onClick={() => setOpen(!isOpen)} />
      </HideInLargeScreens>
      <Box width={[1, 'unset']} py={2}>
        {isOpen && <Flex flexDirection={['column', 'row']} justifyContent='center' py={1}>
          <PageNavItem link='#overview'>
            <FormattedMessage id='Country.Heading.Overview'/>
          </PageNavItem>
          <PageNavItem link='#websites'>
            <FormattedMessage id='Country.Heading.Websites' />
          </PageNavItem>
          <PageNavItem link='#apps'>
            <FormattedMessage id='Country.Heading.Apps' />
          </PageNavItem>
          <PageNavItem link='#network-properties'>
            <FormattedMessage id='Country.Heading.NetworkProperties' />
          </PageNavItem>
        </Flex>}
        <Flex justifyContent={['flex-start', 'flex-end']} px={[0, 3]} py={1}>
          <SocialButtons url={`country/${countryCode}`}/>
        </Flex>
      </Box>
    </React.Fragment>
  )
}

PageNavMenu.propTypes = {
  countryCode: PropTypes.string
}

export default PageNavMenu
