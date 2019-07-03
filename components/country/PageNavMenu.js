import React from 'react'
import { Flex, Box, NavLink } from 'ooni-components'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

const PageNavItem = ({ link, children }) => (
  <Box mx={3} my={1}>
    <NavLink fontWeight='normal' color='blue5' href={link}>{children}</NavLink>
  </Box>
)

const PageNavMenu = () => (
  <Flex flexDirection='row' justifyContent='center' py={3}>
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
  </Flex>
)

export default PageNavMenu
