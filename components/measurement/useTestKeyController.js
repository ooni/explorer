import React, { useState, useCallback } from 'react'
import { Flex } from 'ooni-components'

// Custom hook to render a toolbar to enable/disable parts of `testKeys`
// Usage: Add this to the MeasurementContainer
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

const setValues = (input, value = true) => {
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
        return
      } else {
        const newTestKeys = {...testKeys}

        if (checked) {
          newTestKeys[name] = testKeysInitial[name]
        } else {
          delete newTestKeys[name]
        }
        setTestKeys(newTestKeys)
      }

      setKeysMap(keysMap => {
        const newKeysMap = {...keysMap}
        newKeysMap[name] = checked
        return newKeysMap
      })
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
