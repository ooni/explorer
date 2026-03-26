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

// Use <div> so block HTML from intl placeholders (e.g. <ul>) is never nested
// inside <p>, which is invalid and breaks hydration after browser HTML fixups.
const MdParagraph = ({ children, className, ...props }) => (
  <div className={twMerge('mb-4 last:mb-0', className)} {...props}>
    {children}
  </div>
)

export const FormattedMarkdownBase = ({ children }) => {
  return (
    <Markdown
      options={{
        overrides: {
          h1: { component: MdH1 },
          p: { component: MdParagraph },
          iframe: () => null,
          script: () => null,
          style: () => null,
          object: () => null,
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
