import React, { useState } from 'react'
import { Flex, Box, NavLink } from 'ooni-components'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { MdExpandLess } from 'react-icons/lib/md'
import { Hide } from 'rebass'

const PageNavItem = ({ link, children }) => (
  <Box mx={3} my={1}>
    <NavLink fontWeight='normal' color='blue5' href={link}>{children}</NavLink>
  </Box>
)

const ToggleIcon = styled(MdExpandLess)`
  cursor: pointer;
  background-color: ${props => props.theme.colors.gray3};
  border-radius: 50%;
  transform: ${props => props.isOpen ? 'rotate(0deg)': 'rotate(180deg)'};
  transition: transform 0.1s linear;
`

const PageNavMenu = () => {
  const [isOpen, setOpen] = useState(true)

  return (
    <React.Fragment>
      {/* Show a trigger to open and close the nav menu, but hide it on desktops */}
      <Hide large xlarge>
        <ToggleIcon size={36} isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
      </Hide>
      <Box width={[1, 'unset']}>
        {isOpen && <Flex flexDirection={['column', 'row']} justifyContent='center' py={3}>
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
      </Box>
    </React.Fragment>
  )
}

export default PageNavMenu
