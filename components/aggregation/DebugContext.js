import React, { useState, createContext, useContext, useCallback } from 'react'

export const DebugContext = createContext()

const debuggableInit = {
  query: '',
  apiResponse: {},
  others: []
}

export const DebugProvider = ({ children }) => {
  const [debuggable, setState] = useState(debuggableInit)
  
  const addToDebug = useCallback((item) => {
    setState({...debuggable, others: [...debuggable.others, item] })
  }, [debuggable])

  const debugQuery = useCallback(({query, apiResponse}) => {
    setState({...debuggable, query, apiResponse })
  }, [debuggable])

  return (
    <DebugContext.Provider value={{debuggable, debugQuery, addToDebug}}>
      {children}
    </DebugContext.Provider>
  )
}

export const useDebugContext = () => useContext(DebugContext)