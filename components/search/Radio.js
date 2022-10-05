/*
  This is a copy of design-system/components/atoms/Radio.js
  This was added because importing { RadioButton, RadioGroup } from
  'ooni-components' was throwing an error about an invalid hook call.
  https://reactjs.org/warnings/invalid-hook-call-warning.html
  Strangely importing the same code from a local copy like this, seems
  to work fine. Until fixed, we will be using this copy.
*/

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Radio, Label } from '@rebass/forms/styled-components'
import { Flex } from 'rebass/styled-components'

export const RadioGroup = ({
  children,
  name,
  value,
  onChange,
  direction = 'column',
  ...props
}) => {

  const iterateOverChildren = (children) => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return

      return React.cloneElement(child, {
        ...child.props,
        checked: child.props.value === value,
        onChange: (e) => { onChange(e.target.value) },
        children: iterateOverChildren(child.props.children)})
    })
  }

  return (
    <Flex flexDirection={direction} {...props}>
      {iterateOverChildren(children)}
    </Flex>
  )
}

RadioGroup.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  value: PropTypes.string,
  name: PropTypes.string,
  direction: PropTypes.oneOf(['row', 'column'])
}

export const RadioButton = ({
  label,
  ...props
}) => {
  return (
    <Label htmlFor={props.id} alignItems='center' pb={3}>
      <Radio {...props} />
      {label}
    </Label>
  )
}

RadioButton.propTypes = {
  label: PropTypes.any,
  id: PropTypes.string
}
