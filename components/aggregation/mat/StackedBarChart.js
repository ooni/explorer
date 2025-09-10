import { useIntl } from 'react-intl'
import GridChart, { prepareDataForGridChart } from './GridChart'
import { NoCharts } from './NoCharts'
import { useMATContext } from './MATContext'
import { APIButtons } from '../../APIButtons'

export const StackedBarChart = ({ data, query, apiEndpoint }) => {
  const intl = useIntl()
  const { state } = useMATContext()

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
        <APIButtons apiEndpoint={apiEndpoint} />
      </>
    )
  } catch (e) {
    return <NoCharts message={e.message} />
  }
}
