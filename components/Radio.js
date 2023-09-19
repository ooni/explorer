import { Children, cloneElement, isValidElement } from 'react'
import { Flex } from 'ooni-components'

export const RadioGroup = ({
  children,
  name,
  value,
  onChange,
  direction = 'column',
  ...props
}) => {
  const iterateOverChildren = (children) => {
    return Children.map(children, (child) => {
      if (!isValidElement(child)) return null

      return cloneElement(child, {
        ...child.props,
        checked: child.props.value === value,
        onChange: (e) =>
          onChange && onChange(e.target.value),
        children: iterateOverChildren(child.props.children),
      })
    })
  }

  return (
    <Flex flexDirection={direction} {...props}>
      {iterateOverChildren(children)}
    </Flex>
  )
}
