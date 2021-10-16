import React, { useState, createContext, useContext, useCallback, useEffect, useRef } from 'react'

export const DebugContext = createContext()

export const DebugProvider = ({ children }) => {
  const [query, debugQuery] = useState('')
  const [apiResponse, debugApiResponse] = useState(null)
  const preReshapeTimeRef = useRef(-1)
  const reshapeTimeRef = useRef(-1)
  const renderTimeRef = useRef(-1)
  const [others, debugOthers] = useState(null)
  
  const addToDebug = useCallback((item) => {
    debugOthers({...others, ...item})
  }, [others])

  const doneReshaping = useCallback((t0, t1) => {
    if (t0 !== preReshapeTimeRef.current && t1 !== reshapeTimeRef.current) {
      preReshapeTimeRef.current = t0
      reshapeTimeRef.current = t1
    }
  }, [reshapeTimeRef])

  const doneRendering = useCallback((timestamp) => {
    if (reshapeTimeRef.current > -1 && timestamp !== renderTimeRef.current) {
      renderTimeRef.current = timestamp
    }
  }, [renderTimeRef])

  useEffect(() => {
    // when API query is initiated, reset timestamps
    preReshapeTimeRef.current = -1
    reshapeTimeRef.current = -1
    renderTimeRef.current = -1
  }, [query])

  return (
    <DebugContext.Provider value={{ query, apiResponse, preReshapeTimeRef, reshapeTimeRef, renderTimeRef, doneReshaping, doneRendering, others, debugQuery, debugApiResponse, addToDebug}}>
      {children}
    </DebugContext.Provider>
  )
}

export const withDebugProvider = (Component) => {
  const WithDebugProvider = ({ ...props }) => (
    <DebugProvider>
      <Component {...props} />
    </DebugProvider>
  )
  return WithDebugProvider
}

export const useDebugContext = () => useContext(DebugContext)