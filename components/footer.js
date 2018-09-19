import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Container, Avatar } from 'ooni-components'
import ExplorerLogo from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochrome.svg'
import NLink from 'next/link'

const StyledFooter = styled.footer`
  background-color: ${props => props.theme.colors.gray1};
  color: ${props => props.theme.colors.blue9};
  font-size: 0.8rem;
`

const FooterBox = styled(Box)`
  padding-top: 25px;
  padding-bottom: 25px;
`

const FooterHead = styled.div`
  font-weight: bolder;
  margin-bottom: 10px;
`

const FooterLinkItem = styled(Box)`
  display: ${props => (props.horizontal === 'true') ? 'inline' : 'block'};
  margin-left: ${props => (props.horizontal === 'true') ? '1rem' : 0};
`

const StyledFooterLabel = styled.span`
  text-decoration: none;
  color: {props => props.theme.colors.blue1};
  cursor: pointer;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`

const FooterLink = ({ label, href, horizontal = false}) => (
  // Use non-boolean value for props sent to non-DOM styled components
  // https://www.styled-components.com/docs/faqs#why-am-i-getting-html-attribute-warnings
  <FooterLinkItem mb={2} horizontal={horizontal.toString()}>
    <NLink href={href} passHref>
      <StyledFooterLabel>{label}</StyledFooterLabel>
    </NLink>
  </FooterLinkItem>
)

const FooterText = styled.div`
  margin-top: 0px;
`

const StyledIcon = styled(ExplorerLogo)`
  fill: ${props => props.theme.colors.blue9};
`

const SocialLink = ({ logo, href}) => (
  <a href={href}>
    <Avatar
      size={28}
      m={1}
      src={logo}
    />
  </a>
)

const Footer = () => (
  <StyledFooter>
    <Container>
      <Flex flexWrap='wrap'>
        <Box py={3} w={[1, 2/6]}>
          <Flex flexWrap='wrap' alignItems='center'>
            <Box p={[1, 0]} mb={[0, 3]} width={[1/2, 1]}>
              <StyledIcon height='32px' />
            </Box>
            <Box p={[1, 0]} pr={[0, '50%']} width={[1/2, 1]}> <FooterText>Detect and measure internet censorship all around the world.</FooterText> </Box>
          </Flex>
        </Box>
        <Box width={[1/2, 1/6]}>
          <FooterHead>OONI</FooterHead>
          <FooterLink href='https://ooni.io/about/' label='About' />
          <FooterLink href='https://ooni.io/post/' label='Blog' />
          <FooterLink href='#' label='Reports' />
          <FooterLink href='https://ooni.io/about/#contact' label='Contact Us' />
        </Box>
        <Box width={[1/2, 1/6]}>
          <FooterHead>Data</FooterHead>
          <FooterLink href='https://ooni.io/install/' label='Install Probe' />
          <FooterLink href='https://explorer.ooni.io/' label='Explorer' />
          <FooterLink href='https://api.ooni.io/' label='API' />
          <FooterLink href='https://ooni.io/nettest/' label='Test Docs' />
        </Box>
        <Box width={[1/2, 1/6]}>
          <FooterHead>Get Involved</FooterHead>
          <FooterLink href='https://ooni.io/get-involved/' label='Contribute' />
          <FooterLink href='#' label='Donate' />
          <FooterLink href='https://ooni.io/get-involved/partnership-program/' label='Partners' />
          <FooterLink href='https://run.ooni.io/' label='Run OONI' />
        </Box>
        <Box width={[1/2, 1/6]}>
          <FooterHead>Follow Us</FooterHead>
          <SocialLink
            logo='https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=20'
            href='https://twitter.com/OpenObservatory'
          />
          <SocialLink
            logo='https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=20'
          />
          <SocialLink
            logo='https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=20'
          />
          <SocialLink
            logo='https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=20'
          />
        </Box>
      </Flex>
      <Flex flexWrap='wrap'>
        <Box width={[1, 2/6]}>
          <small>
            <Box mb={1}>© 2018 Open Observatory of Network Interference.</Box>
            <Box>Content available under a Creative Commons license.</Box>
          </small>
        </Box>
        <Box ml='auto' width={[1, 2/6]}>
          <FooterLink horizontal href='/data-policy' label='Data Policy' />
          <FooterLink horizontal href='/legal' label='Legal' />
          <FooterLink horizontal href='/sitemap' label='Sitemap' />
        </Box>
      </Flex>
    </Container>
  </StyledFooter>
)

export default Footer
