import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import FormattedMarkdown from '../FormattedMarkdown'
import { getTestMetadata } from '../utils'

const SummaryText = ({ testName, network, country, date, content }) => {
  const { locale } = useIntl()
  const metadata = getTestMetadata(testName)
  const formattedDateTime = dayjs(date)
    .locale(locale)
    .utc()
    .format('MMMM DD, YYYY, hh:mm A [UTC]')

  let textToRender = null
  if (typeof content === 'function') {
    textToRender = content()
  } else if (typeof content === 'string') {
    textToRender = (
      <FormattedMarkdown
        id={content}
        values={{
          testName: `[${metadata.name}](${metadata.info})`,
          network,
          country,
          date: formattedDateTime,
        }}
      />
    )
  } else {
    textToRender = content
  }
  return (
    <div
      className="my-8 text-base md:text-xl"
      style={{ overflowWrap: 'anywhere' }}
    >
      {textToRender}
    </div>
  )
}

SummaryText.propTypes = {
  testName: PropTypes.string.isRequired,
  network: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  country: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.func,
  ]),
}

export default SummaryText
