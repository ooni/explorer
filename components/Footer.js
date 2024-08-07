import ExplorerLogo from 'ooni-components/svgs/logos/OONI-HorizontalMonochromeInverted.svg'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

const FooterHead = ({ ...props }) => (
  <div className="font-semibold mb-2.5" {...props} />
)

const FooterLink = ({ label, ...props }) => (
  <a
    className="block mb-1 opacity-50 text-white hover:opacity-100 hover:text-white"
    {...props}
  >
    {label}
  </a>
)

FooterLink.propTypes = {
  label: PropTypes.node,
  href: PropTypes.string.isRequired,
}

const Footer = () => {
  const intl = useIntl()
  const currentYear = new Intl.DateTimeFormat(intl.locale, {
    year: 'numeric',
  }).format(new Date())
  return (
    <footer className="text-white mt-8 bg-blue-900">
      <div className="container">
        <div className="flex flex-wrap">
          <div className="py-6 w-full md:w-2/5">
            <div className="flex flex-wrap items-center">
              <div className="p-1 md:mb-4 md:p-0 w-1/2 md:w-full">
                <ExplorerLogo height="32px" />
              </div>
              <div className="w-1/2 md:w-2/3">
                {' '}
                <div className="mt-0">
                  {intl.formatMessage({ id: 'Footer.Text.Slogan' })}
                </div>{' '}
              </div>
            </div>
          </div>
          <div className="py-6 w-1/2 md:w-1/5">
            <FooterHead>
              {intl.formatMessage({ id: 'Footer.Heading.About' })}
            </FooterHead>
            <FooterLink
              href="https://ooni.org/about/"
              label={intl.formatMessage({ id: 'Footer.Link.About' })}
            />
            <FooterLink
              href="https://ooni.org/about/data-policy/"
              label={intl.formatMessage({ id: 'Footer.Link.DataPolicy' })}
            />
            <FooterLink
              href="https://github.com/ooni/license/tree/master/data"
              label={intl.formatMessage({ id: 'Footer.Link.DataLicense' })}
            />
            <FooterLink
              href="https://github.com/ooni/explorer"
              label={intl.formatMessage({ id: 'Footer.Link.Code' })}
            />
            <FooterLink
              href="https://ooni.org/about/#contact"
              label={intl.formatMessage({ id: 'Footer.Link.Contact' })}
            />
          </div>
          <div className="py-6 w-1/2 md:w-1/5">
            <FooterHead>
              {intl.formatMessage({ id: 'Footer.Heading.OONIProbe' })}
            </FooterHead>
            <FooterLink
              href="https://ooni.org/install/"
              label={intl.formatMessage({ id: 'Footer.Link.Probe' })}
            />
            <FooterLink
              href="https://ooni.org/nettest/"
              label={intl.formatMessage({ id: 'Footer.Link.Tests' })}
            />
            <FooterLink
              href="https://github.com/ooni"
              label={intl.formatMessage({ id: 'Footer.Link.Code' })}
            />
            <FooterLink
              href="https://api.ooni.io/"
              label={intl.formatMessage({ id: 'Footer.Link.API' })}
            />
          </div>
          <div className="py-6 w-1/2 md:w-1/5">
            <FooterHead>
              {intl.formatMessage({ id: 'Footer.Heading.Updates' })}
            </FooterHead>
            <FooterLink
              href="https://ooni.org/post/"
              label={intl.formatMessage({ id: 'Footer.Link.Blog' })}
            />
            <FooterLink
              href="https://twitter.com/OpenObservatory"
              label={intl.formatMessage({ id: 'Footer.Link.Twitter' })}
            />
            <FooterLink
              href="https://lists.torproject.org/cgi-bin/mailman/listinfo/ooni-talk"
              label={intl.formatMessage({ id: 'Footer.Link.MailingList' })}
            />
            <FooterLink
              href="https://openobservatory.slack.com/"
              label={intl.formatMessage({ id: 'Footer.Link.Slack' })}
            />
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="py-6">
            <small>
              <div className="mb-1">
                {intl.formatMessage(
                  { id: 'Footer.Text.Copyright' },
                  { currentYear },
                )}
              </div>
              <FooterLink
                href="https://github.com/ooni/license"
                label={intl.formatMessage({ id: 'Footer.Text.CCommons' })}
              />
              <div className="mt-0">
                {intl.formatMessage({ id: 'Footer.Text.Version' })}:{' '}
                {process.env.GIT_COMMIT_SHA_SHORT}
              </div>
            </small>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
