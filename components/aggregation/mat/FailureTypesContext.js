import { colors } from 'ooni-components'
import { createContext, useReducer, useContext, useMemo } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const ooniColors = [
  colors.red['800'],
  colors.yellow['600'],
  colors.gray['600'],
  colors.blue['600'],
  colors.orange['600'],
  colors.fuchsia['600'],
  colors.pink['600'],
  colors.teal['600'],
  colors.violet['600'],
  colors.fuchsia['600'],
  '#8c564b', //brown
  colors.lime['300'],
  colors.cyan['600'],
]

const chartColors = (selectedFailureTypes) =>
  selectedFailureTypes
    .filter((f) => !['none', 'others'].includes(f))
    .reduce(
      (acc, current, i) => {
        acc[current] = ooniColors[i % ooniColors.length]
        return acc
      },
      {
        none: colors.green['600'],
        other: colors.gray['300'],
      },
    )

const initialState = {
  all: [],
  selected: [],
  included: [],
  colors: null,
}

const getSelected = (allFailureTypes) =>
  allFailureTypes
    .filter(
      (f) => !['tcp.network_unreachable', 'tcp.host_unreachable'].includes(f),
    )
    .slice(0, 7)

function reducer(state, action) {
  switch (action.type) {
    case 'initFromData': {
      //   const all = action.payload // ordered list
      return {
        ...action.payload,
        // ...state,
        // all,
        // selected: getSelected(all),
        // included: all,
        // colors: action.payload.length
        //   ? chartColors(getSelected(action.payload))
        //   : null,
      }
    }
    case 'setIncluded':
      return { ...state, included: action.payload }
    case 'setSelected':
      return {
        ...state,
        selected: action.payload,
        colors: action.payload.length ? chartColors(action.payload) : null,
      }
    case 'reset':
      return initialState
    default:
      return state
  }
}

const Ctx = createContext(null)

export function FailureTypesProvider({ allFailureTypes = [], children }) {
  const router = useRouter()

  const selected = useMemo(
    () =>
      router.query?.loni === 'observations'
        ? getSelected(allFailureTypes)
        : allFailureTypes,
    [allFailureTypes, router.query],
  )

  const initialState = useMemo(
    () => ({
      all: allFailureTypes,
      selected,
      included: allFailureTypes,
      colors: chartColors(selected),
    }),
    [allFailureTypes, selected],
  )

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!allFailureTypes?.length) {
      dispatch({ type: 'reset' })
    } else {
      dispatch({ type: 'initFromData', payload: initialState })
    }
  }, [allFailureTypes, initialState])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useFailureTypes = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useFailureTypes must be used within provider')
  return ctx
}
