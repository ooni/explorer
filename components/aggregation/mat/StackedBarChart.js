import { useIntl } from 'react-intl'
import GridChart, { prepareDataForGridChart } from './GridChart'
import { NoCharts } from './NoCharts'
import { useFailureTypes } from './FailureTypesContext'

export const StackedBarChart = ({ data, query }) => {
  const intl = useIntl()
  const { state } = useFailureTypes()

  try {
    const [gridData, rows] = prepareDataForGridChart(
      data,
      query,
      intl.locale,
      state.included,
      state.selected,
    )

    return (
      <>
        <div className="flex relative flex-col">
          <GridChart data={gridData} rowKeys={rows} height={500} />
        </div>
      </>
    )
  } catch (e) {
    return <NoCharts message={e.message} />
  }
}
