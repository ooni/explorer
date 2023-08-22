// Documentation for markdown-to-jsx
// https://github.com/probablyup/markdown-to-jsx
import React from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import Markdown from 'markdown-to-jsx'
import { Link, theme } from 'ooni-components'

export const FormattedMarkdownBase = ({ children }) => {
  return (
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
      {children}
    </Markdown>
  )
}

const FormattedMarkdown = ({ id, defaultMessage, values }) => {
  const intl = useIntl()

  return (
    <FormattedMarkdownBase>
      {intl.formatMessage({id, defaultMessage}, values )}
    </FormattedMarkdownBase>
  )
}

FormattedMarkdown.propTypes = {
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string,
  values: PropTypes.object
}

export default FormattedMarkdown
