// Documentation for markdown-to-jsx
// https://github.com/probablyup/markdown-to-jsx
import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import Markdown from 'markdown-to-jsx'

const FormattedMarkdown = ({ intl, id }) => (
  // <Markdown source={intl.formatMessage({ id })} />
  <Markdown>
    {intl.formatMessage({ id })}
  </Markdown>
)

FormattedMarkdown.propTypes = {
  intl: intlShape,
  id: PropTypes.string.isRequired
}

export default injectIntl(FormattedMarkdown)
