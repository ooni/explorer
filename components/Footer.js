import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Container, Link } from 'ooni-components'
import ExplorerLogo from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochromeInverted.svg'
import { useIntl } from 'react-intl'
import { version } from '../package.json'

const StyledFooter = styled.footer`
  background-color: ${props => props.theme.colors.blue9};
  color: #ffffff;
  font-size: 16px;
  margin-top: 32px;
`

const FooterBox = styled(Box)`
  padding-top: 25px;
  padding-bottom: 25px;
`

const FooterHead = styled.div`
  font-weight: bolder;
  margin-bottom: 10px;
`

const StyledFooterItem = styled(Link)`
  text-decoration: none;
  color: #ffffff;
  cursor: pointer;
  opacity: 0.5;
  display: ${props => (props.$horizontal === 'true') ? 'inline' : 'block'};
  margin-left: ${props => (props.$horizontal === 'true') ? '1rem' : 0};
  &:hover {
    opacity: 1;
  }
`

const FooterLink = ({ label, href, horizontal = false}) => (
  // Use non-boolean value for props sent to non-DOM styled components
  // https://www.styled-components.com/docs/faqs#why-am-i-getting-html-attribute-warnings
  <StyledFooterItem mb={2} $horizontal={horizontal.toString()} href={href}>
    {label}
  </StyledFooterItem>
)

FooterLink.propTypes = {
  label: PropTypes.node,
  href: PropTypes.string.isRequired,
  horizontal: PropTypes.bool
}

const FooterText = styled.div`
  margin-top: 0px;
`

const Footer = () => {
  const intl = useIntl()
  return (
    <StyledFooter>
      <Container>
        <Flex flexWrap='wrap'>
          <FooterBox width={[1, 2/5]}>
            <Flex flexWrap='wrap' alignItems='center'>
              <Box p={[1, 0]} mb={[0, 3]} width={[1/2, 1]}>
                <ExplorerLogo height='32px' />
              </Box>
              <Box p={[1, 0]} pr={[0, '50%']} width={[1/2, 1]}> <FooterText>{intl.formatMessage({ id: 'Footer.Text.Slogan' })}</FooterText> </Box>
            </Flex>
          </FooterBox>
          <FooterBox width={[1/2, 1/5]}>
            <FooterHead>{intl.formatMessage({ id: 'Footer.Heading.About' })}</FooterHead>
            <FooterLink href='https://ooni.org/about/' label={intl.formatMessage({ id: 'Footer.Link.About' })} />
            <FooterLink href='https://ooni.org/about/data-policy/' label={intl.formatMessage({ id: 'Footer.Link.DataPolicy' })} />
            <FooterLink href='https://github.com/ooni/license/tree/master/data' label={intl.formatMessage({ id: 'Footer.Link.DataLicense' })} />
            <FooterLink href='https://github.com/ooni/explorer' label='Source Code / Issues' />
            <FooterLink href='https://ooni.org/about/#contact' label={intl.formatMessage({ id: 'Footer.Link.Contact' })} />
          </FooterBox>
          <FooterBox width={[1/2, 1/5]}>
            <FooterHead>{intl.formatMessage({ id: 'Footer.Heading.OONIProbe' })}</FooterHead>
            <FooterLink href='https://ooni.org/install/' label={intl.formatMessage({ id: 'Footer.Link.Probe' })} />
            <FooterLink href='https://ooni.org/nettest/' label={intl.formatMessage({ id: 'Footer.Link.Tests' })} />
            <FooterLink href='https://github.com/ooni' label={intl.formatMessage({ id: 'Footer.Link.Code' })} />
            <FooterLink href='https://api.ooni.io/' label={intl.formatMessage({ id: 'Footer.Link.API' })} />
          </FooterBox>
          <FooterBox width={[1/2, 1/5]}>
            <FooterHead>{intl.formatMessage({ id: 'Footer.Heading.Updates' })}</FooterHead>
            <FooterLink href='https://ooni.org/post/' label={intl.formatMessage({ id: 'Footer.Link.Blog' })} />
            <FooterLink href='https://twitter.com/OpenObservatory' label={intl.formatMessage({ id: 'Footer.Link.Twitter' })} />
            <FooterLink href='https://lists.torproject.org/cgi-bin/mailman/listinfo/ooni-talk' label={intl.formatMessage({ id: 'Footer.Link.MailingList' })} />
            <FooterLink href='https://openobservatory.slack.com/' label={intl.formatMessage({ id: 'Footer.Link.Slack' })} />
          </FooterBox>
        </Flex>
        <Flex flexWrap='wrap'>
          <FooterBox>
            <small>
              <Box mb={1}>{intl.formatMessage({ id: 'Footer.Text.Copyright' })}</Box>
              <FooterLink href='https://github.com/ooni/license' label={intl.formatMessage({ id: 'Footer.Text.CCommons'})} />
              <FooterText>{intl.formatMessage({ id: 'Footer.Text.Version' }) }: {version}</FooterText>
            </small>
          </FooterBox>
        </Flex>
      </Container>
    </StyledFooter>
  )
}

export default Footer
