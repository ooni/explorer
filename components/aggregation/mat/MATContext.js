import { useRouter } from 'next/router'
import { colors } from 'ooni-components'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

const ooniColors = [
  colors.red['800'],
  colors.yellow['600'],
  colors.gray['600'],
  colors.blue['600'],
  colors.orange['600'],
  colors.fuchsia['600'],
  colors.pink['600'],
  colors.teal['600'],
]

const chartColors = (selectedBlockingTypes) =>
  selectedBlockingTypes
    .filter((f) => !['none', 'others'].includes(f))
    .reduce(
      (acc, current, i) => {
        acc[current] = ooniColors[i]
        return acc
      },
      {
        none: colors.green['600'],
        other: colors.gray['300'],
      },
    )

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
  legendItems: [],
  colors: null,
  loni: null,
}

export const MATContextProvider = ({
  children,
  queryParams,
  selectedBlockingTypes,
  includedBlockingTypes,
  ...initialContext
}) => {
  const [state, setState] = useState({
    ...defaultMATContext,
    ...initialContext,
  })
  const { query } = useRouter()

  const MATquery = queryParams || query

  const stateReducer = (updates, partial = false) => {
    setState((state) =>
      partial
        ? Object.assign({}, state, updates)
        : Object.assign({}, state, defaultMATContext, initialContext, updates),
    )
  }

  useEffect(() => {
    if (selectedBlockingTypes && includedBlockingTypes) {
      stateReducer(
        {
          legendItems: selectedBlockingTypes,
          colors: chartColors(selectedBlockingTypes),
          includedItems: includedBlockingTypes,
        },
        true,
      )
    }
  }, [selectedBlockingTypes, includedBlockingTypes])

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
