// Documentation for markdown-to-jsx
// https://github.com/probablyup/markdown-to-jsx
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Markdown from 'markdown-to-jsx'
import { Link, theme } from 'ooni-components'

const FormattedMarkdown = (props) => (
  <FormattedMessage {...props} >
    {(msg) => (
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
        {msg}
      </Markdown>
    )}
  </FormattedMessage>
)

FormattedMarkdown.propTypes = {
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string,
  values: PropTypes.object
}

export default FormattedMarkdown
