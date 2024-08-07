import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormattedMessage, useIntl } from 'react-intl'

import OONI404 from '../public/static/images/OONI_404.svg'

const Custom404 = () => {
  const router = useRouter()
  const intl = useIntl()
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'Error.404.PageNotFound' })}</title>
      </Head>
      <div className="container">
        <div className="flex items-center justify-center">
          <div>
            <h4 className="text-blue-500">
              <FormattedMessage id="Error.404.Heading" />
            </h4>
            <div className="mb-3">
              <FormattedMessage
                id="Error.404.Message"
                defaultMessage="We could not find the content you were looking for. Maybe try {measurementLink} or look at {homePageLink}."
                values={{
                  measurementLink: (
                    <FormattedMessage id="Error.404.MeasurmentLinkText">
                      {(message) => <Link href="/countries">{message}</Link>}
                    </FormattedMessage>
                  ),
                  homePageLink: (
                    <FormattedMessage id="Error.404.HomepageLinkText">
                      {(message) => <Link href="/">{message}</Link>}
                    </FormattedMessage>
                  ),
                }}
              />
            </div>
            <div>
              <FormattedMessage id="Error.404.GoBack">
                {(message) => (
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault()
                      router.back()
                    }}
                  >
                    {message}
                  </a>
                )}
              </FormattedMessage>
            </div>
          </div>
          <div className="p-32">
            <OONI404 height="500px" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Custom404
