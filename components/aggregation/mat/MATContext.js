import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export const MATStateContext = createContext()

export const defaultMATContext = {
  since: '',
  until: '',
  axis_x: '',
  axis_y: '',
  test_name: '',
  probe_cc: '',
  probe_asn: '',
  input: '',
  category_code: ''
}

export const MATContextProvider = ({ children, ...initalContext }) => {
  const [state, setState] = useState({...defaultMATContext, ...initalContext})

  const { query } = useRouter()

  const stateReducer = useCallback((updates) => {
    setState(state =>
      Object.assign({},
        state,
        Object.keys(defaultMATContext).reduce((o, k) => {
          if (updates[k]) {
            o[k] = updates[k]
          }
          return o
        }, {})
      )
    )
  }, [])

  useEffect(() => {
    stateReducer(query)
  }, [query, stateReducer])

  return (
    <MATStateContext.Provider value={{...state, updateMATContext: stateReducer}}>
      {children}
    </MATStateContext.Provider>
  )
}

export function useMATContext () {
  const {updateMATContext, ...state} = useContext(MATStateContext)
  if (typeof state === 'undefined') {
    throw new Error('useMATContext should be used within a MATContextProvider')
  }
  return [state, updateMATContext]
}