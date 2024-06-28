import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

export const DebugContext = createContext()

const initialTimeStampRef = {
  pre: -1,
  post: -1,
}

export const DebugProvider = ({ children }) => {
  const [query, debugQuery] = useState('')
  const [apiResponse, debugApiResponse] = useState(null)
  const tableReshapeTimeRef = useRef({ ...initialTimeStampRef })
  const chartsReshapeTimeRef = useRef({ ...initialTimeStampRef })
  const renderTimeRef = useRef([])
  const scrollStartRef = useRef(-1)
  const [others, debugOthers] = useState({})

  const addToDebug = useCallback(
    (item) => {
      debugOthers({ ...others, ...item })
    },
    [others],
  )

  const doneTableReshaping = useCallback((t0, t1) => {
    if (
      t0 !== tableReshapeTimeRef.current.pre &&
      t1 !== tableReshapeTimeRef.current.post
    ) {
      tableReshapeTimeRef.current.pre = t0
      tableReshapeTimeRef.current.post = t1
    }
  }, [])

  const doneChartReshaping = useCallback((t0, t1) => {
    if (
      t0 !== chartsReshapeTimeRef.current.pre &&
      t1 !== chartsReshapeTimeRef.current.post
    ) {
      chartsReshapeTimeRef.current.pre = t0
      chartsReshapeTimeRef.current.post = t1
    }
  }, [])

  const doneRendering = useCallback((timestamp) => {
    renderTimeRef.current.push(timestamp)
  }, [])

  const startedScrolling = useCallback((timestamp) => {
    scrollStartRef.current = timestamp
  }, [])

  useEffect(() => {
    // when API query is initiated, reset timestamps
    console.debug('Query changed. Resetting timers')
    tableReshapeTimeRef.current = { ...initialTimeStampRef }
    chartsReshapeTimeRef.current = { ...initialTimeStampRef }
    renderTimeRef.current = []
  }, [query])

  return (
    <DebugContext.Provider
      value={{
        query,
        apiResponse,
        tableReshapeTimeRef,
        chartsReshapeTimeRef,
        renderTimeRef,
        scrollStartRef,
        doneTableReshaping,
        doneChartReshaping,
        doneRendering,
        others,
        debugQuery,
        debugApiResponse,
        addToDebug,
        startedScrolling,
      }}
    >
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
