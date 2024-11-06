// import type { ReactNode } from 'react'

// type ConditionalWrapperProps = {
//   condition: boolean
//   wrapper: (children: ReactNode) => ReactNode
//   children: ReactNode
// }

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children

export default ConditionalWrapper
