import Head from 'next/head'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { getTestMetadata } from '../utils'

const HeadMetadata = ({ testName, country, date, content }) => {
  const intl = useIntl()
  let description = ''

  const formattedDate = new Intl.DateTimeFormat(intl.locale, {
    dateStyle: 'long',
    timeStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(date))

  if (content.formatted) {
    description = content.message
  } else {
    const metadata = getTestMetadata(testName)
    description = intl.formatMessage(content.message, {
      testName: metadata.name,
      country: country,
      date: formattedDate,
    })
  }

  const metaDescription = intl.formatMessage(
    {
      id: 'Measurement.MetaDescription',
    },
    {
      description,
      formattedDate,
    },
  )

  return (
    <Head>
      <title>{description}</title>
      <meta
        key="og:description"
        property="og:description"
        content={metaDescription}
      />
      <meta name="description" content={metaDescription} />
    </Head>
  )
}

HeadMetadata.propTypes = {
  content: PropTypes.shape({
    message: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        defaultMessage: PropTypes.string,
      }),
    ]).isRequired,
    formatted: PropTypes.bool.isRequired,
  }),
}

export default HeadMetadata
