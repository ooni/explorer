import { useRouter } from 'next/router'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

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
  domain: '',
  category_code: '',
  tooltipIndex: [-1, ''],
  loni: 'null',
}

export const MATContextProvider = ({
  children,
  queryParams,
  ...initialContext
}) => {
  const [state, setState] = useState({
    ...defaultMATContext,
    ...initialContext,
  })

  const { query } = useRouter()

  const MATquery = queryParams || query

  const stateReducer = useCallback(
    (updates, partial = false) => {
      setState((state) =>
        partial
          ? Object.assign({}, state, updates)
          : Object.assign(
              {},
              state,
              defaultMATContext,
              initialContext,
              updates,
            ),
      )
    },
    [initialContext],
  )

  useEffect(() => {
    stateReducer(MATquery)
  }, [MATquery])

  return (
    <MATStateContext.Provider
      value={{ ...state, updateMATContext: stateReducer }}
    >
      {children}
    </MATStateContext.Provider>
  )
}

export function useMATContext() {
  const { updateMATContext, ...state } = useContext(MATStateContext)
  if (typeof state === 'undefined') {
    throw new Error('useMATContext should be used within a MATContextProvider')
  }
  return [state, updateMATContext]
}
