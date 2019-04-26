// Documentation for markdown-to-jsx
// https://github.com/probablyup/markdown-to-jsx
import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import Markdown from 'markdown-to-jsx'

const FormattedMarkdown = ({ intl, id, values }) => (
  <Markdown>
    {intl.formatMessage({ id }, values)}
  </Markdown>
)

FormattedMarkdown.propTypes = {
  intl: intlShape,
  id: PropTypes.string.isRequired,
  values: PropTypes.object
}

export default injectIntl(FormattedMarkdown)
