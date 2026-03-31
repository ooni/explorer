// Documentation for markdown-to-jsx
// https://github.com/probablyup/markdown-to-jsx
import Markdown from 'markdown-to-jsx'
import type { ComponentPropsWithoutRef } from 'react'
import { useIntl } from 'react-intl'
import type { MessageDescriptor, PrimitiveType } from 'react-intl'
import { twMerge } from 'tailwind-merge'

type MdH1Props = ComponentPropsWithoutRef<'h3'>

const MdH1 = ({ children, className, ...props }: MdH1Props) => (
  <h3 className={twMerge('my-2', className)} {...props}>
    {children}
  </h3>
)

export function FormattedMarkdownBase({ children }: { children: string }) {
  return (
    <Markdown
      options={{
        overrides: {
          h1: { component: MdH1 },
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

export type FormattedMarkdownProps = MessageDescriptor & {
  values?: Record<string, PrimitiveType>
}

const FormattedMarkdown = ({
  id,
  defaultMessage,
  values,
  description,
}: FormattedMarkdownProps) => {
  const intl = useIntl()
  const descriptor: MessageDescriptor = { id, defaultMessage, description }

  return (
    <FormattedMarkdownBase>
      {intl.formatMessage(descriptor, values)}
    </FormattedMarkdownBase>
  )
}

export default FormattedMarkdown
