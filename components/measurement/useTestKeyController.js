// This file contains a custom hook to render a toolbar
// that can be used to enable/disable parts of `testKeys`
// To use it, add the below code in components/measurement/MeasurementContainer.js
/*
import { useTestKeyController } from './useTestKeyController'
...
...
const { testKeys, TestKeyController } = useTestKeyController(measurement.test_keys)
const measurementMod = Object.assign({}, measurement, { test_keys: testKeys })

return (
  <React.Fragment>
    <TestKeyController />
    <TestDetails measurement={measurementMod} {...props} />
  </React.Fragment>
)
*/

import React, { useState, useCallback } from 'react'
import { Flex } from 'ooni-components'


const setValues = (input, value = true) => {
  // Maps each key in `test_keys` to a boolean value, by default true
  return Object.keys(input).reduce((o, k) => {
    o[k] = value
    return o
  }, {all: value})
}

export const useTestKeyController = (testKeysInitial) => {
  const [testKeys, setTestKeys] = useState(testKeysInitial)
  const [keysMap, setKeysMap] = useState(setValues(testKeysInitial))

  const TestKeyController = () => {
    const onChange = useCallback((event) => {
      const {name, checked} = event.target

      if (name === 'all') {
        setTestKeys(checked ? testKeysInitial : {})
        setKeysMap(setValues(testKeysInitial, checked))
      } else {
        const newTestKeys = {...testKeys}
        // add or delete the original entry from `test_keys`
        if (checked) {
          newTestKeys[name] = testKeysInitial[name]
        } else {
          delete newTestKeys[name]
        }
        setTestKeys(newTestKeys)
        setKeysMap(keysMap => {
          const newKeysMap = {...keysMap}
          newKeysMap[name] = checked
          return newKeysMap
        })
      }
    }, [keysMap, testKeys, setKeysMap, setTestKeys])

    return (
      <Flex flexWrap='wrap' justifyContent='space-evenly'>
        {Object.keys(keysMap).map((k, i) =>
          <Flex key={i} mr={2} alignItems='center'>
            <input type='checkbox' name={k} checked={keysMap[k]} onChange={onChange} />
            <label htmlFor={k}>{k}</label>
          </Flex>
        )}
      </Flex>
    )
  }

  return { testKeys, TestKeyController }
}
