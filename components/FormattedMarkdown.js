// Documentation for markdown-to-jsx
// https://github.com/probablyup/markdown-to-jsx
import Markdown from 'markdown-to-jsx'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { twMerge } from 'tailwind-merge'

const MdH1 = ({ children, className, ...props }) => (
  <h3 className={twMerge('my-2', className)} {...props}>
    {children}
  </h3>
)

const MdUL = ({ children, className, ...props }) => (
  <ul className={twMerge('list-disc ps-10', className)} {...props}>
    {children}
  </ul>
)

const MdP = ({ children, className, ...props }) => (
  <p className={twMerge('my-3', className)} {...props}>
    {children}
  </p>
)

export const FormattedMarkdownBase = ({ children }) => {
  return (
    <Markdown
      options={{
        overrides: {
          h1: { component: MdH1 },
          ul: { component: MdUL },
          p: { component: MdP },
        },
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
      {intl.formatMessage({ id, defaultMessage }, values)}
    </FormattedMarkdownBase>
  )
}

FormattedMarkdown.propTypes = {
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string,
  values: PropTypes.object,
}

export default FormattedMarkdown
