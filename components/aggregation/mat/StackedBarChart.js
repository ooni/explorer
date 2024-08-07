import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import GridChart, { prepareDataForGridChart } from './GridChart'
import { NoCharts } from './NoCharts'

export const StackedBarChart = ({ data, query }) => {
  const intl = useIntl()

  try {
    const [gridData, rows] = prepareDataForGridChart(data, query, intl.locale)

    return (
      <div className="flex relative flex-col">
        <GridChart
          data={gridData}
          rowKeys={rows}
          rowLabels={[undefined]}
          height={500}
          noLabels={true}
        />
      </div>
    )
  } catch (e) {
    return <NoCharts message={e.message} />
  }
}

StackedBarChart.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.shape({
      dimension_count: PropTypes.number,
      result: PropTypes.array,
    }),
    loadTime: PropTypes.number,
    url: PropTypes.string,
  }),
  query: PropTypes.object,
}
