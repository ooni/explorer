import { useIntl } from 'react-intl'
import GridChart, {
  prepareDataForGridChart,
  preparePipelineV5DataForGridChart,
  prepareObservationsDataForGridChart,
} from './GridChart'
import { NoCharts } from './NoCharts'
import { colors } from 'ooni-components'
import { useState } from 'react'

const getAllBlockingTypes = (dataOG) => {
  return dataOG.reduce((acc, obj) => {
    if (acc[obj.failure]) {
      acc[obj.failure] += obj.observation_count
    } else {
      acc[obj.failure] = obj.observation_count
    }
    // const existing = acc.find(
    //   (item) => item.failure === failure,
    // )
    // if (existing) {
    //   existing[failure] = observation_count
    // } else {
    //   acc.push({
    //     [failure]: observation_count,
    //   })
    // }
    return acc
  }, {})
}

const getSortedBlockingTypes = (OGdata) => {
  const blockingTypes = getAllBlockingTypes(OGdata)
  return Object.entries(blockingTypes)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key)
  // console.log(blockingTypes.sort((type)))
}

export const StackedBarChart = ({ data, query }) => {
  const intl = useIntl()

  const [allBlockingTypes, setAllBlockingTypes] = useState(
    query?.loni === 'observations' ? getSortedBlockingTypes(data) : [],
  )

  const [selectedBlockingTypes, setSelectedBlockingTypes] = useState(
    allBlockingTypes.slice(0, 8),
  )

  try {
    let gridData
    let rows
    if (query?.loni === 'observations') {
      ;[gridData, rows] = prepareObservationsDataForGridChart(
        data,
        query,
        intl.locale,
        selectedBlockingTypes,
      )
    } else if (query?.loni) {
      ;[gridData, rows] = preparePipelineV5DataForGridChart(
        data,
        query,
        intl.locale,
      )
    } else {
      ;[gridData, rows] = prepareDataForGridChart(data, query, intl.locale)
    }

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

    const chartColors = selectedBlockingTypes
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

    return (
      <>
        {allBlockingTypes?.map((b) => (
          <div key="b">{b}</div>
        ))}
        <div className="flex relative flex-col">
          <GridChart
            data={gridData}
            rowKeys={rows}
            height={500}
            colorScheme={chartColors}
          />
        </div>
      </>
    )
  } catch (e) {
    return <NoCharts message={e.message} />
  }
}
