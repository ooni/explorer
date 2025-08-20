// BlockingTypesContext.tsx
import { colors } from 'ooni-components'
import { createContext, useReducer, useContext, useMemo } from 'react'
import { useEffect } from 'react'

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

const initialState = {
  all: [],
  selected: [],
  included: [],
  colors: null,
}

const getSelected = (allBlockingTypes) =>
  allBlockingTypes
    .filter(
      (f) => !['tcp_network_unreachable', 'tcp_host_unreachable'].includes(f),
    )
    .slice(0, 7)

function reducer(state, action) {
  switch (action.type) {
    case 'initFromData': {
      const all = action.payload // ordered list
      return {
        ...state,
        all,
        selected: getSelected(all),
        included: all,
        colors: action.payload.length
          ? chartColors(getSelected(action.payload))
          : null,
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

export function BlockingTypesProvider({ allBlockingTypes = [], children }) {
  const initialState = {
    all: allBlockingTypes,
    selected: getSelected(allBlockingTypes),
    included: allBlockingTypes,
    colors: chartColors(getSelected(allBlockingTypes)),
  }
  console.log('initialState', initialState)
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!allBlockingTypes?.length) {
      dispatch({ type: 'reset' })
    } else {
      dispatch({ type: 'initFromData', payload: allBlockingTypes })
    }
  }, [allBlockingTypes])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useBlockingTypes = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useBlockingTypes must be used within provider')
  return ctx
}

// const [state, dispatch] = useReducer(reducer, {
//     all: allBlockingTypes,
//     selected: allBlockingTypes.slice(0, 8),
//     included: allBlockingTypes,
//     colors: chartColors(allBlockingTypes.slice(0, 8)),
//   })

// When allBlockingTypes changes, sync reducer state
// useEffect(() => {
//   if (!allBlockingTypes?.length) return
//   dispatch({ type: 'initFromData', payload: allBlockingTypes })
// }, [allBlockingTypes])

//   const value = useMemo(() => ({ state, dispatch }), [state])
//   return <Ctx.Provider value={value}>{children}</Ctx.Provider>
