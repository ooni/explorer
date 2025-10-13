import { colors } from 'ooni-components'
import { createContext, useReducer, useContext, useMemo } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { colorMap } from './colorMap'

const ooniColors = [
  colors.red['800'],
  colors.yellow['600'],
  colors.blue['600'],
  colors.orange['600'],
  colors.fuchsia['600'],
  colors.pink['600'],
  colors.teal['600'],
  colors.violet['600'],
  colors.gray['600'],
  '#8c564b', //brown
  colors.lime['300'],
  colors.cyan['600'],
]

const legendItemsAnomalies = [
  {
    label: 'MAT.Table.Header.ok_count',
    color: colorMap.ok_count,
  },
  {
    label: 'MAT.Table.Header.confirmed_count',
    color: colorMap.confirmed_count,
  },
  {
    label: 'MAT.Table.Header.anomaly_count',
    color: colorMap.anomaly_count,
  },
  {
    label: 'MAT.Table.Header.failure_count',
    color: colorMap.failure_count,
  },
]

const getChartColors = (selectedFailureTypes) =>
  selectedFailureTypes
    .filter((f) => !['none', 'others'].includes(f))
    .reduce(
      (acc, current, i) => {
        acc[current] = ooniColors[i % ooniColors.length]
        return acc
      },
      {
        ok: colors.green['600'],
        none: colors.green['600'],
        other: colors.gray['300'],
      },
    )

const initialState = {
  all: [],
  selected: [],
  included: [],
  colors: null,
  legendItems: legendItemsAnomalies,
}

const getSelected = (allFailureTypes) =>
  allFailureTypes
    .filter(
      (f) => !['tcp.network_unreachable', 'tcp.host_unreachable'].includes(f),
    )
    .slice(0, 7)

const getLegendItems = (dataType, selected, colors = {}) => {
  if (dataType === 'observations') {
    const items = selected.map((item) => ({
      label: item === 'none' ? 'ok' : item,
      color: colors?.[item],
    }))
    if (colors?.other) {
      items.push({ label: 'other', color: colors.other })
    }
    return items
  }
  if (dataType === 'analysis') {
    return selected.map((item) => ({
      label: item === 'none' ? 'ok' : item,
      color: colors?.[item],
    }))
  }
  return legendItemsAnomalies
}

const getCountKeys = (dataType, selectedItems) => {
  if (dataType === 'analysis') return ['blocked_max']
  if (dataType === 'observations') return selectedItems
  return [
    'anomaly_count',
    'confirmed_count',
    'failure_count',
    'measurement_count',
  ]
}

function reducer(state, action) {
  switch (action.type) {
    case 'updateQuery':
      return { ...state, query: action.payload }
    case 'updateFailureTypes':
      return { ...state, ...action.payload }
    case 'setIncluded':
      return { ...state, included: action.payload }
    case 'setSelected': {
      const chartColors = action.payload.length
        ? getChartColors(action.payload)
        : null
      return {
        ...state,
        selected: action.payload,
        colors: chartColors,
        legendItems: getLegendItems(
          state.query.data,
          action.payload,
          chartColors,
        ),
      }
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
      MATquery?.data === 'observations'
        ? getSelected(allFailureTypes)
        : allFailureTypes,
    [allFailureTypes, MATquery.data],
  )

  const [state, dispatch] = useReducer(reducer, {
    all: allFailureTypes,
    selected,
    included: allFailureTypes,
    colors: getChartColors(selected),
    query: MATquery,
    tooltipIndex: [-1, ''],
    countKeys: getCountKeys(MATquery.data, selected),
  })

  useEffect(() => {
    if (!allFailureTypes?.length) {
      dispatch({ type: 'resetFailureTypes' })
    } else {
      const chartColors = getChartColors(selected)
      dispatch({
        type: 'updateFailureTypes',
        payload: {
          all: allFailureTypes,
          selected,
          included: allFailureTypes,
          colors: chartColors,
          showLegendEditorButton: MATquery.data === 'observations',
          legendItems: getLegendItems(MATquery.data, selected, chartColors),
          countKeys: getCountKeys(MATquery.data, selected),
        },
      })
    }
  }, [allFailureTypes, MATquery.data, selected])

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
