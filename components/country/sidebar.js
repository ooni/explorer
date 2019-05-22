import React from 'react'
import { Flex, Box, NavLink } from 'ooni-components'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

const StyledSideBar = styled(Flex)`
  position: sticky;
  top: 66px;
  border-bottom: 1px solid ${props => props.theme.colors.gray3};
  background-color: white;
  z-index: 999;
`

const StyledSidebarItem = styled(Box)``
StyledSidebarItem.defaultProps = {
  mb: 1
}

const SidebarItem = ({link, children}) => (
  <StyledSidebarItem mx={5}>
    <NavLink fontWeight='normal' color='blue5' href={link}>{children}</NavLink>
  </StyledSidebarItem>
)

const Sidebar = () => (
  <StyledSideBar flexDirection='row' justifyContent='flex-end' py={3}>
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
