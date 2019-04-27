// Documentation for markdown-to-jsx
// https://github.com/probablyup/markdown-to-jsx
import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import Markdown from 'markdown-to-jsx'

const FormattedMarkdown = ({ intl, id, defaultMessage, ...rest }) => (
  <Markdown>
    {intl.formatMessage({ id, defaultMessage }, {...rest})}
  </Markdown>
)

FormattedMarkdown.propTypes = {
  intl: intlShape,
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string
}

export default injectIntl(FormattedMarkdown)
