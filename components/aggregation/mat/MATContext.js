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
    case 'updateQuery':
      return { ...state, query: action.payload }
    case 'updateFailureTypes':
      return { ...state, ...action.payload }
    case 'setIncluded':
      return { ...state, included: action.payload }
    case 'setSelected':
      return {
        ...state,
        selected: action.payload,
        colors: action.payload.length ? chartColors(action.payload) : null,
      }
    case 'setTooltipIndex':
      return { ...state, tooltipIndex: action.payload }
    case 'reset':
      return initialState
    case 'resetFailureTypes':
      return { ...state, ...initialState }
    default:
      return state
  }
}

const Ctx = createContext(null)

export function MATContextProvider({
  queryProps,
  allFailureTypes = [],
  children,
}) {
  const router = useRouter()
  const MATquery = useMemo(
    () => queryProps || router.query,
    [queryProps, router.query],
  )

  const selected = useMemo(
    () =>
      MATquery?.loni === 'observations'
        ? getSelected(allFailureTypes)
        : allFailureTypes,
    [allFailureTypes, MATquery.loni],
  )

  const [state, dispatch] = useReducer(reducer, {
    all: allFailureTypes,
    selected,
    included: allFailureTypes,
    colors: chartColors(selected),
    query: MATquery,
    tooltipIndex: [-1, ''],
  })

  useEffect(() => {
    if (!allFailureTypes?.length) {
      dispatch({ type: 'resetFailureTypes' })
    } else {
      dispatch({
        type: 'updateFailureTypes',
        payload: {
          all: allFailureTypes,
          selected,
          included: allFailureTypes,
          colors: chartColors(selected),
        },
      })
    }
  }, [allFailureTypes])

  useEffect(() => {
    dispatch({ type: 'updateQuery', payload: MATquery })
  }, [MATquery])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useMATContext = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useMATContext must be used within provider')
  return ctx
}
