import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Container, Avatar } from 'ooni-components'
import ExplorerLogo from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochrome.svg'
import NLink from 'next/link'
import { injectIntl, intlShape } from 'react-intl'

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

const StyledFooterLabel = styled.a`
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

const Footer = ({ intl }) => (
  <StyledFooter>
    <Container>
      <Flex flexWrap='wrap'>
        <FooterBox width={[1, 2/6]}>
          <Flex flexWrap='wrap' alignItems='center'>
            <Box p={[1, 0]} mb={[0, 3]} width={[1/2, 1]}>
              <StyledIcon height='32px' />
            </Box>
            <Box p={[1, 0]} pr={[0, '50%']} width={[1/2, 1]}> <FooterText>{intl.formatMessage({ id: 'Footer.Text.Slogan' })}</FooterText> </Box>
          </Flex>
        </FooterBox>
        <FooterBox width={[1/2, 1/6]}>
          <FooterHead>{intl.formatMessage({ id: 'Footer.Headings.OONI' })}</FooterHead>
          <FooterLink href='https://ooni.io/about/' label={intl.formatMessage({ id: 'Footer.Links.About' })} />
          <FooterLink href='https://ooni.io/post/' label={intl.formatMessage({ id: 'Footer.Links.Blog' })} />
          <FooterLink href='#' label={intl.formatMessage({ id: 'Footer.Links.Reports' })} />
          <FooterLink href='https://ooni.io/about/#contact' label={intl.formatMessage({ id: 'Footer.Links.Contact' })} />
        </FooterBox>
        <FooterBox width={[1/2, 1/6]}>
          <FooterHead>{intl.formatMessage({ id: 'Footer.Headings.Data' })}</FooterHead>
          <FooterLink href='https://ooni.io/install/' label={intl.formatMessage({ id: 'Footer.Links.Probe' })} />
          <FooterLink href='https://explorer.ooni.io/' label={intl.formatMessage({ id: 'Footer.Links.Explorer' })} />
          <FooterLink href='https://api.ooni.io/' label={intl.formatMessage({ id: 'Footer.Links.API' })} />
          <FooterLink href='https://ooni.io/nettest/' label={intl.formatMessage({ id: 'Footer.Links.Tests' })} />
        </FooterBox>
        <FooterBox width={[1/2, 1/6]}>
          <FooterHead>{intl.formatMessage({ id: 'Footer.Headings.GetInvolved' })}</FooterHead>
          <FooterLink href='https://ooni.io/get-involved/' label={intl.formatMessage({ id: 'Footer.Links.Contribute' })} />
          <FooterLink href='#' label={intl.formatMessage({ id: 'Footer.Links.Donate' })} />
          <FooterLink href='https://ooni.io/get-involved/partnership-program/' label={intl.formatMessage({ id: 'Footer.Links.Partners' })} />
          <FooterLink href='https://run.ooni.io/' label={intl.formatMessage({ id: 'Footer.Links.Run' })} />
        </FooterBox>
        <FooterBox width={[1/2, 1/6]}>
          <FooterHead>{intl.formatMessage({ id: 'Footer.Headings.SocialLinks' })}</FooterHead>
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
        </FooterBox>
      </Flex>
      <Flex flexWrap='wrap'>
        <FooterBox width={[1, 2/6]}>
          <small>
            <Box mb={1}>{intl.formatMessage({ id: 'Footer.Text.Copyright' })}</Box>
            <Box>{intl.formatMessage({ id: 'Footer.Text.CCommons' })}</Box>
          </small>
        </FooterBox>
        <FooterBox ml='auto' width={[1, 2/6]}>
          <FooterLink horizontal href='/data-policy' label={intl.formatMessage({ id: 'Footer.Links.DataPolicy' })} />
          <FooterLink horizontal href='/legal' label={intl.formatMessage({ id: 'Footer.Links.Legal' })} />
          <FooterLink horizontal href='/sitemap' label={intl.formatMessage({ id: 'Footer.Links.Sitemap' })} />
        </FooterBox>
      </Flex>
    </Container>
  </StyledFooter>
)

Footer.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(Footer)
