import { useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import Filters from './Filters'
import GridChart, { prepareDataForGridChart } from './GridChart'

const prepareDataforTable = (data, query, locale) => {
  const table = []

  const [reshapedData, rows, rowLabels] = prepareDataForGridChart(
    data,
    query,
    locale,
  )

  const countKeys = [
    'anomaly_count',
    'confirmed_count',
    'failure_count',
    'measurement_count',
  ]
  for (const [key, rowData] of reshapedData) {
    const row = {
      [query.axis_y]: key,
      rowLabel: rowLabels[key],
      anomaly_count: 0,
      confirmed_count: 0,
      failure_count: 0,
      measurement_count: 0,
    }

    rowData.forEach((d) => {
      countKeys.forEach((countKey) => {
        row[countKey] = row[countKey] + d[countKey]
      })
    })

    table.push(row)
  }
  return [reshapedData, table, rows, rowLabels]
}

// This same reference is passed to GridChart when there are no rows to filter out
// Maybe this can also be `[]`
const noRowsSelected = null

const TableView = ({ data, query, showFilters = true }) => {
  const intl = useIntl()
  const resetTableRef = useRef(false)
  const yAxis = query.axis_y

  // The incoming data is reshaped to generate:
  // - reshapedData: holds the full set that will be used by GridChart
  //   to then filter out rows based on `selectedRows` generated by the table
  // - tableData: this has aggregated counts and labels for each row to be
  //   displayed in GridChart. It allows to easily filter and sort aggregate data
  // - indexes -
  const [reshapedData, tableData, rowKeys, rowLabels] = useMemo(() => {
    try {
      return prepareDataforTable(data, query, intl.locale)
    } catch (e) {
      return [null, [], [], {}]
    }
  }, [query, data, intl.locale])

  const [dataForCharts, setDataForCharts] = useState(noRowsSelected)

  return (
    <div className="flex flex-col">
      {showFilters && (
        <Filters
          query={query}
          tableData={tableData}
          setDataForCharts={setDataForCharts}
        />
      )}
      <GridChart
        data={reshapedData}
        selectedRows={dataForCharts}
        rowKeys={rowKeys}
        rowLabels={rowLabels}
      />
    </div>
  )
}

export default TableView
