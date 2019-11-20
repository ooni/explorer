// Documentation for markdown-to-jsx
// https://github.com/probablyup/markdown-to-jsx
import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import Markdown from 'markdown-to-jsx'
import { Link, theme } from 'ooni-components'

const FormattedMarkdown = ({ id, defaultMessage, values, intl }) => (
  <Markdown
    options={{
      overrides: {
        a: {
          component: Link,
          props: {
            color: theme.colors.blue7
          }
        },
      }
    }}
  >
    {intl.formatMessage({id, defaultMessage}, values )}
  </Markdown>
)

FormattedMarkdown.propTypes = {
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string,
  values: PropTypes.object
}

export default injectIntl(FormattedMarkdown)
