import React from 'react'
import { Flex, Box, NavLink } from 'ooni-components'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

const StyledSidebarItem = styled(Box)``
StyledSidebarItem.defaultProps = {
  mb: 1
}

const SidebarItem = ({link, children}) => (
  <StyledSidebarItem>
    <NavLink href={link}>{children}</NavLink>
  </StyledSidebarItem>
)

const Sidebar = () => (
  <Flex flexDirection='column'>
    <SidebarItem link='#overview'>
      <FormattedMessage id='Country.Heading.Overview'/>
    </SidebarItem>
    <SidebarItem link='#websites'>
      <FormattedMessage id='Country.Heading.Websites' />
    </SidebarItem>
    <SidebarItem link='#apps'>
      <FormattedMessage id='Country.Heading.Apps' />
    </SidebarItem>
    <SidebarItem link='#network-properties'>
      <FormattedMessage id='Country.Heading.NetworkProperties' />
    </SidebarItem>
  </Flex>
)

export default Sidebar
