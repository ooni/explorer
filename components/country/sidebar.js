import React from 'react'
import { Flex, Box, NavLink } from 'ooni-components'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

const StyledSideBar = styled(Flex)`
  position: sticky;
  top: 85px;
`

const StyledSidebarItem = styled(Box)``
StyledSidebarItem.defaultProps = {
  mb: 1
}

const SidebarItem = ({link, children}) => (
  <StyledSidebarItem>
    <NavLink fontWeight='normal' color='blue5' href={link}>{children}</NavLink>
  </StyledSidebarItem>
)

const Sidebar = () => (
  <StyledSideBar flexDirection={['row', 'column']}>
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
  </StyledSideBar>
)

export default Sidebar
